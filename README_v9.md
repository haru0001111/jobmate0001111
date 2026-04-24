# JobMate v9

## 今回の追加
- ES に **companyId 紐づけ** を追加
- ES 作成/編集画面で **対象企業を選択** できるように変更
- `GET /api/essays?companyId=...` のフィルタ対応
- Company Hub で **その企業に紐づくES** を優先表示
- 会社未紐づけの流用候補ではなく、**明示的に紐づけたES** を中心に扱う構成へ更新

## 使い方
1. `/essays` で ES を追加
2. 「紐づける企業」で対象企業を選ぶ
3. `/companies/[id]` を開くと、その会社向け ES が「関連するES回答」に表示される

## 今の状態
- Company Hub は API 保存できる
- ES も API 保存できる
- Company Hub と ES が companyId でつながった

## 次にやること
- Chrome拡張で、今開いている企業ページに対応する ES を優先表示
- ES 候補の類似度順表示
- Firestore / Auth への差し替え
