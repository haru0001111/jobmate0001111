# JobMate Final Pack

## これは何か
JobMate の現時点の統合版パックです。これまでの要件を1つのプロジェクトにまとめています。

### 収録済みの中核機能
- Company Hub（企業詳細・募集要項・選考フロー・適性検査・メモ）
- ES管理（一覧・追加・編集・削除・文字数別保存）
- events / tasks の API と保存層
- Chrome拡張
  - 設問検出
  - 保存済みES候補の表示
  - loginId の表示 / コピー / 入力
- Firebase Auth / Firebase Admin / Firestore へ差し替えるための土台
- userId ベースの API 設計

## まだ接続が必要なもの
このパックだけでは、次はまだ各自の環境設定が必要です。

- Firebase プロジェクト作成
- Google ログイン有効化
- Firebase Web SDK の env 設定
- Firebase Admin SDK の秘密鍵設定
- Firestore ルール反映
- Chrome拡張の接続先 URL 設定
- Gmail / Outlook 連携（未実装）

## 今の完成度
- ローカル試作として: かなり高い
- 本番接続済みSaaSとして: 接続前

## 最短セットアップ
1. `npm install`
2. `.env.example` を `.env.local` にコピー
3. まずは `JOBMATE_DATA_PROVIDER=json` で起動
4. `npm run dev`
5. Chrome拡張を `extension/` から読み込む
6. 動作確認後、Firebase を設定して `JOBMATE_DATA_PROVIDER=firestore` に切り替える

## 推奨する次の実作業順
1. Firebase Web / Admin を本物の値で設定
2. Firestore Rules を適用
3. Auth付き API の本番動作確認
4. Chrome拡張がローカル / 本番 URL で動くか確認
5. events / tasks の編集 UI を強化
6. その後にメール連携

## 注意
- パスワードは MVP では保存しない前提です
- loginId は企業ごとに保存できます
- 自動送信やログイン突破のような動作は入れていません
