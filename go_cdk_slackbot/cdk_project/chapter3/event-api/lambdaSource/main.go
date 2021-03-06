package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/labstack/gommon/log"
	"github.com/nlopes/slack"
)

const (
	ACTION_SELECT = "select"
	ACTION_CANCEL = "cancel"
)

const (
	URL_VERIFICATION_EVENT = "url_verification"
	EVENT_CALLBACK_EVENT   = "event_callback"
)

const (
	SLACK_ICON = ":ok:"
	SLACK_NAME = "Sample Bot"
)

type ApiEvent struct {
	Type       string     `json:"type"`
	Text       string     `json:"text"`
	Challenge  string     `json:"challenge"`
	Token      string     `json:"token"`
	SlackEvent SlackEvent `json:"event"`
}
type SlackEvent struct {
	User    string `json:"user"`
	Type    string `json:"type"`
	Text    string `json:"text"`
	Channel string `json:"channel"`
}

func main() {
	lambda.Start(eventApiHandler)
}

func eventApiHandler(ctx context.Context,
	request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	vals, _ := url.ParseQuery(request.Body)
	log.Infof("vals:%v", vals)

	response := events.APIGatewayProxyResponse{}

	//環境変数を取得する
	channelID := os.Getenv("CHANNEL_ID")
	botID := os.Getenv("BOT_ID")
	botOAuth := os.Getenv("BOT_OAUTH")
	signingSecrets := os.Getenv("SIGNING_SECRETS")

	apiEvent := &ApiEvent{}
	for key, _ := range vals {
		err := json.Unmarshal([]byte(key), apiEvent)
		if err != nil {
			return response, err
		}
	}
	switch apiEvent.Type {
	case URL_VERIFICATION_EVENT:
		response.Headers = make(map[string]string)
		response.Headers["Content-Type"] = "text/plain"
		response.Body = apiEvent.Challenge
		response.StatusCode = http.StatusOK
		return response, nil
	case EVENT_CALLBACK_EVENT:
		slackClient := slack.New(botOAuth)

		slackEvent := apiEvent.SlackEvent

		//input validate
		if slackEvent.Type != "app_mention" {
			return response, errors.New("eventTypeがapp_mentionではありません")
		}

		if !strings.HasPrefix(slackEvent.Text, fmt.Sprintf("<@%s> ", botID)) {
			return response, errors.New("botIDが一致しません")
		}

		if slackEvent.Channel != channelID {
			return response, errors.New("channelIDが一致しません")
		}

		if err := verify(signingSecrets, request); err != nil {
			log.Error(err)
			return response, err
		}

		m := strings.Split(strings.TrimSpace(slackEvent.Text), " ")[1:]
		if len(m) == 0 || (m[0] != "down" && m[0] != "up") {
			return response, fmt.Errorf("対応外のメッセージです")
		}

		ec2Client := ec2.New(session.New(),
			&aws.Config{Region: aws.String("ap-northeast-1")})

		var (
			operation       string
			targetEc2Status string
		)
		if m[0] == "down" {
			operation = "停止"
			targetEc2Status = "running"
		}
		if m[0] == "up" {
			operation = "再起動"
			targetEc2Status = "stopped"
		}

		descOutput, err := ec2Client.DescribeInstances(&ec2.DescribeInstancesInput{
			Filters: []*ec2.Filter{
				&ec2.Filter{
					Name: aws.String("instance-state-name"),
					Values: []*string{
						aws.String(targetEc2Status),
					},
				},
			},
		})

		if err != nil {
			return response, err
		}

		options := []slack.AttachmentActionOption{}
		for _, reservation := range descOutput.Reservations {
			for _, instance := range reservation.Instances {
				instanceName := extractTargetInstanceName(instance)
				options = append(options, slack.AttachmentActionOption{
					Text:  instanceName,
					Value: instanceName + ":" + operation,
				})
			}
		}

		attachment := slack.Attachment{
			Text:       "どのサーバーが" + operation + "対象かの?",
			Color:      "#f9a41b",
			CallbackID: "server",
			Actions: []slack.AttachmentAction{
				{
					Name:    ACTION_SELECT,
					Type:    "select",
					Options: options,
				},

				{
					Name:  ACTION_CANCEL,
					Text:  "やっぱ何でもないわ",
					Type:  "button",
					Style: "danger",
				},
			},
		}

		params := slack.PostMessageParameters{
			IconEmoji: SLACK_ICON,
			Username:  SLACK_NAME,
		}

		msgOptText := slack.MsgOptionText("", true)
		msgOptParams := slack.MsgOptionPostMessageParameters(params)
		msgOptAttachment := slack.MsgOptionAttachments(attachment)

		if _, _, err := slackClient.PostMessage(channelID, msgOptText,
			msgOptParams, msgOptAttachment); err != nil {
			return response, fmt.Errorf("メッセージ送信に失敗: %s", err)
		}

		response.StatusCode = http.StatusOK
		return response, nil
	default:
		response.StatusCode = http.StatusOK
		return response, nil
	}

}

func verify(signingSecrets string, request events.APIGatewayProxyRequest) error {
	httpHeader := http.Header{}
	for key, value := range request.Headers {
		httpHeader.Set(key, value)
	}
	sv, err := slack.NewSecretsVerifier(httpHeader, signingSecrets)
	if err != nil {
		log.Error(err)
		return err
	}

	if _, err := sv.Write([]byte(request.Body)); err != nil {
		log.Error(err)
		return err
	}

	if err := sv.Ensure(); err != nil {
		log.Error("Invalid SIGNING_SECRETS")
		return err
	}
	return nil
}

func extractTargetInstanceName(instance *ec2.Instance) string {
	var instanceName string
	for _, tag := range instance.Tags {
		if *tag.Key == "Name" {
			instanceName = *tag.Value
		}
	}
	return instanceName
}
