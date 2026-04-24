# JobMate v2 Prototype

就活生向けの **応募管理 + ES回答バンク + Chrome拡張によるES入力支援** の雛形です。

## 含まれるもの
- Next.js Webアプリ雛形
- TypeScriptの型定義更新
- ES管理画面の雛形
- Chrome拡張の最小構成
- Firestore ルール例
- 更新版仕様書

## 構成
- `app/` Webアプリ
- `components/` UIコンポーネント
- `lib/` Firebase / mock data / matching utility
- `types/` 型定義
- `extension/` Chrome拡張

## MVP機能
### Webアプリ
- 企業管理
- イベント管理
- タスク管理
- ES回答バンク
- 文字数別回答保存

### Chrome拡張
- 現在ページの入力欄検出
- 設問文の推定
- 保存済み回答候補の表示
- 選択した回答を入力欄へ反映

## 起動
```bash
npm install
npm run dev
```

## Chrome拡張の試し方
1. `extension/` を開く
2. Chrome の `chrome://extensions` を開く
3. デベロッパーモードをON
4. 「パッケージ化されていない拡張機能を読み込む」で `extension/` を指定
5. 採用サイト風のフォームで拡張を開き、サンプル候補を確認

## 次にやること
1. Firebase Authentication 接続
2. Firestore CRUD 実装
3. ES一覧 / 編集画面の保存接続
4. 拡張機能から WebアプリAPI を呼ぶ
5. 類似度ロジック改善
6. 課金導線追加
