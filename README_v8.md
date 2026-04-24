# JobMate Prototype v8

## 追加したこと
- ES の **保存 / 編集 / 削除** API を追加
- `data/essays.json` を使う **ローカルJSONストア** を追加
- ES一覧ページを **EssayManager** に置き換え
- 100 / 200 / 300 / 400 字版をまとめて編集できるフォームを追加
- Company Hub と同じく、まずは **API経由で保存** する形に統一

## 今できること
- Company Hub の編集と保存
- 企業一覧 / 詳細への反映
- ES の追加 / 編集 / 削除
- ES の文字数別テンプレ管理

## まだ未接続
- Firebase Auth
- Firestore 本接続
- ES と Company Hub の companyId 紐づけ
- Chrome拡張から保存済みESの取得
- メール連携

## 次にやること
1. ES に companyId 紐づけを追加
2. Chrome拡張で設問候補として表示
3. Firestore へ service 差し替え
