# JobMate v13

v13 では、Firebase Auth を本番向けに差し替えるための土台を追加しました。

## 今回追加したもの

- Google ログイン用の `AuthProvider`
- ログイン必須画面の `AuthGate`
- ダッシュボード上のユーザーメニュー
- `userId` ベースで保存層に渡すための `getCurrentUser()`
- `company-service` / `essay-service` の userId 対応

## まだ未完了

- Firebase Admin SDK での ID トークン検証
- Firestore Rules の userId 厳密化
- API ルート単位の認証チェック
- Firestore 保存時の完全なユーザー分離

## この版の意味

試作品の UI にログイン導線が入り、保存レイヤーも userId 前提の形に寄りました。
次は **API で Firebase ID トークンを検証して、本当にユーザー単位で保存する** ステップに進めます。
