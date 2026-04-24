# JobMate v5 Product Spec

## 追加内容
- Company Hub にマイページ情報欄を追加
- 企業ごとに以下を保持できるようにした
  - マイページURL
  - 採用ページURL
  - ログインID
  - ID種別（メールアドレス / 会員ID など）
  - ログイン方法メモ
  - 最終確認日時
  - 次回確認予定
- 認証情報の安全ポリシーを明文化

## v5で目指す価値
- 「どの企業のマイページをどこから開くか」がすぐ分かる
- 「この企業はどのIDで入るか」を迷わない
- Company Hub を就活の司令塔として使える

## MVPで保持する認証情報
- portalUrl
- recruitingUrl
- loginId
- loginIdLabel
- loginMemo
- lastCheckedAt
- nextCheckAt

## MVPで保持しないもの
- パスワード平文
- セキュリティ質問
- ワンタイムコード
- 自動ログイン情報

## セキュリティ方針
- パスワードは MVP では保存しない
- パスワードが必要な場合は、端末やブラウザのパスワードマネージャー利用を前提にする
- 将来保存機能を追加する場合は、クライアント側暗号化と再認証を前提にする
- 自動ログインや自動送信は対象外

## 画面変更
### Company Hub 詳細ページ
新規セクションを追加:
- マイページURL
- 採用ページURL
- ログインID
- ID種別
- ログインメモ
- 最終確認
- 次回確認予定

## データ設計
```ts
interface CompanyPortal {
  portalUrl?: string;
  recruitingUrl?: string;
  loginId?: string;
  loginIdLabel?: string;
  loginMemo?: string;
  passwordStored?: boolean;
  lastCheckedAt?: string;
  nextCheckAt?: string;
}
```

## 次の実装優先順位
1. Company Hub の編集フォーム追加
2. Firestore の companies ドキュメントに portal を保存
3. Chrome拡張で portalUrl と loginId を参照
4. Gmail連携で企業メールから portal 候補を抽出
