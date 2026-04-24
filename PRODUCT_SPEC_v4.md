# JobMate v4 Product Spec

## 追加内容
- Company Hub 詳細画面を追加
- 企業単位で募集要項・選考フロー・適性検査・メモ・関連ES・関連予定・タスクを集約
- ダッシュボードの企業一覧から企業詳細へ遷移

## MVPで提供する画面
- ダッシュボード
- ES回答バンク
- Company Hub 詳細ページ
- Chrome拡張の最小UI

## Company Hub の価値
- 企業研究情報が散らばらない
- 応募準備と選考進捗を1画面で追える
- その企業に使えるES候補がすぐ分かる

## 実装メモ
- 現在は mock-data と mock-essays から描画
- Firestore 接続時は companies/{id}, events, essays, tasks を companyId で紐付ける
- Chrome拡張は companyId ごとの ES 候補 API を読む形に拡張する
