package main

// Goはimport文で他のモジュールをパッケージ単位でインポートする。

// なお、これらのパッケージをローカルにインストールしたいなら、
// `go mod tidy` を go.mod の存在するディレクトリで実行すればいい。
// ※ go.modが存在しない場合は、先に `go init` ｺﾏﾝﾄﾞで、ファイルを生成すべき
//
// 上記を実施済みで、かつVSCodeの拡張機能もインストール済みなら、
// "github.com/aws/aws-lambda-go/events" のような外部パッケージも、
// コードの予測変換が効くようになる。
import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/ec2"
	"github.com/labstack/gommon/log"
	"github.com/pkg/errors"
)

// Goはクラスをもたず、データの入れ子として構造体を使う
type EC2Status struct {
	InstanceID string `json:"instance-id"`
	State      string `json:"state"`
}

// Goでは型に別名をつけることができる. また別名とメソッドを紐づけることもできる
type EC2_STATE string

const (
	EC2_RUNNING_STATE EC2_STATE = "running"
	EC2_STOPPED_STATE EC2_STATE = "stopped"
)

const (
	SLACK_ICON = ":ok"
	SLACK_NAME = "Sample Notice"
)

const EC2_RESOURCES = "aws.ec2"

func main() {
	lambda.Start(noticeHandler)
}

// EventBridgeを監視して、イベントソースに応じたハンドリングを行う
func noticeHandler(context context.Context, event events.CloudWatchEvent) (e error) {
	// incoming-webhool-app-stackにて、Lambda定義時に環境変数として指定している
	webHookURL := os.Getenv("webHookUrl")
	channel := os.Getenv("slackCannel")

	// EventBridgeで検出されたイベントのソースを判定
	switch event.Source {
	case EC2_RESOURCES:
		// イベントソースがEC2なら、EC2のステータスを通知する関数を実行
		if err := notifyEC2Status(event, webHookURL, channel); err != nil {
			// エラーが発生したなら、ログ出力
			log.Error(err)
			return err
		}
		return nil
	default:
		return errors.New("想定するリソースのイベントではありません")
	}
}

// EC2のステータスを通知する
func notifyEC2Status(event events.CloudWatchEvent, webHookURL string, channel string) (e error) {
	/**
	 * EventBrigeで検出されたイベント情報（JSON形式）のうち、
	 * event.Detail には json.RawMessage 型の JSON文字列が格納されている。
	 * このJSON文字列を、json.Unmershalでデコードし、第二引数で指定したEC2Status型の変数に代入する。
	 */
	status := &EC2Status{}
	err := json.Unmarshal([]byte(event.Detail), status)
	if err != nil {
		log.Error(err)
		return err
	}
	// EC2クライアントのインスタンス起動
	ec := ec2.New(session.New(), &aws.Config{Region: aws.String("ap-northeast-1")})
	// EC2インスタンスの情報を、EC2クライアントインスタンスに取得させる。
	// その際、EventBridgeの情報からインスタンスIDを取得して、ec2クライアントインスタンスに渡している。
	descOutput, err := ec.DescribeInstances(&ec2.DescribeInstancesInput{
		InstanceIds: []*string{&status.InstanceID},
	})

	// EC2クライアントが取得した情報の中から、EC2インスタンスの名前を取得
	var instanceName string
	for _, tag := range descOutput.Reservations[0].Instances[0].Tags {
		if *tag.Key == "Name" {
			instanceName = *tag.Value
		}
	}

	// slackに送るメッセージの内容を取得
	var title string
	switch EC2_STATE(status.State) {
	case EC2_RUNNING_STATE:
		title = fmt.Sprintf("*%v が %v*", instanceName, status.State)
	case EC2_STOPPED_STATE:
		title = fmt.Sprintf("*%v が %v*", instanceName, status.State)
	default:
		return nil
	}

	// slackにメッセージを送信する関数を実行
	err = ReportToSlack(webHookURL, SlackRequestBody{
		Channel:   channel,
		Username:  SLACK_NAME,
		Text:      title,
		IconEmoji: aws.String(SLACK_ICON), // aws.String()で文字列SLACK_ICONのポインタを渡している（ &SLACK_ICON と同様 ）
	})

	return nil

}
