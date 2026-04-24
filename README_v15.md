# JobMate v15

## 今回の更新
- `events / tasks` を `companies / essays` と同じ **認証前提 API** に統一
- `GET /api/events`, `POST /api/events`, `PUT /api/events/[id]`, `DELETE /api/events/[id]` を追加
- `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/[id]`, `DELETE /api/tasks/[id]` を追加
- JSON ストアと Firestore アダプタを `events / tasks` にも追加
- ダッシュボードが **認証付き API** から企業 / 予定 / タスクをまとめて取得する形に更新

## 今の到達点
- companies
- essays
- events
- tasks

上の 4 系統が、同じ `userId` ベースの扱いに寄りました。

## まだ残っているもの
- Firebase Admin の本番鍵設定
- Firestore Rules の最終固定
- Chrome 拡張への token 受け渡し整理
- Gmail / Outlook 連携

## 次に進む候補
1. Chrome拡張でも認証付き API を安全に叩けるようにする
2. events / tasks の編集UIを足す
3. Firestore rules を `userId` 前提で固める
