# JobMate Prototype v7

## 追加したこと
- Company Hub の保存を **API 経由** に変更
- `data/companies.json` を使う **ローカルJSONストア** を追加
- ダッシュボードが保存済み企業一覧を読むように変更
- 企業詳細ページがストアの最新データを読むように変更
- 保存失敗時だけ localStorage にフォールバック

## 今回の位置づけ
まだ Firestore 本接続ではありませんが、
**モック固定から抜けて、保存結果が一覧と詳細に反映される状態** まで進めています。

## 次に差し替える場所
Firestore に移行するときは、主にここを差し替えます。

- `lib/server/company-service.ts`
- `lib/server/company-store.ts`

## 今できること
- Company Hub の編集
- 保存
- ダッシュボードで反映確認
- 企業詳細で反映確認

## 次にやること
1. Firebase Auth
2. Firestore 永続化
3. ES 保存フォーム
4. Chrome拡張で URL と loginId の紐づけ表示
