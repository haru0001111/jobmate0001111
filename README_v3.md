# JobMate v3

JobMate v3 は、新卒就活生向けの **就活管理 + ES回答バンク + ES入力支援 + Company Hub** のプロトタイプです。

## できること
- 応募企業を管理する
- 説明会 / 面接 / ES締切 / 適性検査を管理する
- ES回答を保存する
- 文字数別にESを持つ
- 企業ごとの募集要項・選考フロー・適性検査情報をまとめる
- Chrome拡張から設問に近いES候補を表示し、入力欄へ挿入する

## ディレクトリ
- `app/` Next.js App Router
- `components/` UIコンポーネント
- `extension/` Chrome拡張の最小構成
- `lib/` Firebase・モックデータ・マッチングロジック
- `types/` 型定義
- `PRODUCT_SPEC_v3.md` v3仕様書

## 次にやること
1. Firebase Authentication接続
2. Firestoreへの保存処理
3. `/companies/[id]` のCompany Hub詳細画面
4. `/events` と `/tasks` の本実装
5. Chrome拡張から保存済みESを読む接続
6. 課金制限の実装

## 注意
- このリポジトリはプロトタイプです
- 自動送信、ログイン突破、適性検査自動回答などは対象外です
- 他社サービスの無断転載やスクレイピングを前提にしていません
