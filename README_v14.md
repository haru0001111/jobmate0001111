# JobMate v14

## 今回の追加
- API ルートで Firebase ID トークンを受け取る前提に更新
- `Authorization: Bearer <token>` をクライアント fetch に付与
- `firebase-admin` を使うサーバー側トークン検証ヘルパーを追加
- `company-service` / `essay-service` が `userId` を引数で受け取れるように更新
- 開発環境では `demo-user` フォールバック、本番では未認証時 401 を返す想定

## 追加ファイル
- `lib/server/auth/firebase-admin.ts`
- `lib/server/auth/require-user.ts`
- `lib/auth/client-auth-fetch.ts`

## まだ残っているもの
- Firebase Admin SDK 実環境での秘密鍵設定
- Firestore Rules の最終固定
- events / tasks API の同様な認証化
- Chrome拡張側の Bearer token 受け渡し整理
