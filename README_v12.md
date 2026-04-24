# JobMate v12

## 今回の追加
- 保存層を **JSON / Firestore 切り替え可能** に整理
- `JOBMATE_DATA_PROVIDER` で保存先を切り替え
- Firestore 接続用の adapter を追加
- Firestore 接続に失敗した場合は **既存のJSONストアへフォールバック**
- `.env.example` を追加

## 追加ファイル
- `lib/server/provider.ts`
- `lib/server/firestore-admin-lite.ts`
- `lib/server/firestore/company-firestore.ts`
- `lib/server/firestore/essay-firestore.ts`
- `.env.example`

## 使い方
### 1. これまで通り JSON で動かす
```bash
cp .env.example .env.local
# JOBMATE_DATA_PROVIDER=json のまま
npm install
npm run dev
```

### 2. Firestore モードに切り替える
`.env.local` を作って Firebase の値を入れ、以下を設定します。

```env
JOBMATE_DATA_PROVIDER=firestore
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 注意
- この版は **Firestore へ差し替えるための土台** です。
- 認証付きの本番運用では、あとで **Firebase Auth** と **Firestore ルールの絞り込み** を入れる前提です。
- いまの Firestore adapter は、接続できない時に JSON へ戻るので、ローカル試作を止めません。

## 次にやること
- Firebase Auth を追加して `userId` ごとにデータ分離
- Firestore ルールを `request.auth.uid` ベースに更新
- Chrome拡張からも認証済みAPIへ接続
