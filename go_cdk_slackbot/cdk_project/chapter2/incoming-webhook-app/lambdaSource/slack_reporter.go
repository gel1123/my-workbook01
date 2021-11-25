package main

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/labstack/gommon/log"
)

type SlackRequestBody struct {
	Channel   string  `json:"channel"`
	Username  string  `json:"username"`
	Text      string  `json:"text"`
	IconEmoji *string `json:"icon_emoji,omitempty"` // Go言語はアスタリスクで、ポインタが指し示す変数の実体を抽出する
}

// Slackにメッセージを通知する関数（SlackAppのエンドポイントにHTTP通信を投げる関数）
func ReportToSlack(webhookUrl string, reqBody SlackRequestBody) error {

	// リクエストボディ用のJSONを取得（SlackRequestBody型の構造体をJSONにエンコード）
	jsonAsByte, _ := json.Marshal(reqBody)

	req, err := http.NewRequest(
		"POST",
		webhookUrl,
		bytes.NewReader(jsonAsByte), // リクエストボディにはio.Reader型の値が必要
	)

	if err != nil {
		log.Error(err)
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}

	// Slackサーバに対してリクエスト送信
	resp, err := client.Do(req)
	if err != nil {
		log.Error(err)
		return err
	}

	defer resp.Body.Close()

	return nil
}
