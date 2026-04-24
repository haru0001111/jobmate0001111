# JobMate Prototype v6

## 이번 버전 / この版で進めたこと
- Company Hub に編集フォームを追加
- 編集内容をブラウザの localStorage に保存できるようにした
- マイページURL / 採用ページURL / ログインID / 適性検査 / 募集要項をその場で更新できる
- 将来 Firestore に差し替えるための保存境界を `lib/company-storage.ts` に切り出した
- `/api/companies/[id]` を追加して、次の Firestore 接続先を用意した

## 今の保存仕様
- **実際に保存される**: Company Hub 編集内容（このブラウザ内の localStorage）
- **まだ未接続**: Firebase Authentication / Firestore 本保存

## 次にやること
1. `lib/company-storage.ts` を Firestore リポジトリに差し替える
2. ダッシュボードと一覧にもローカル保存結果を反映する
3. ES 一覧にも同じ保存方式の編集フォームを入れる
4. Chrome拡張で `portalUrl` と `loginId` を表示する
