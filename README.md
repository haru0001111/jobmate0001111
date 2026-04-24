# JobMate Prototype

就活生向けのスケジュール・選考・ES管理アプリのMVP雛形です。

## MVP機能
- 企業管理
- 説明会/面接/締切イベント管理
- タスク管理
- ダッシュボード
- 無料プラン制限のための基礎実装ポイント

## 想定技術
- Next.js (App Router)
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Tailwind CSS
- Vercel

## 開発メモ
この雛形は設計重視です。`lib/firebase.ts` に Firebase 設定を入れ、API route を Firestore 実装に差し替えてください。

## 収益化の初期案
- 無料: 3社まで、イベント20件まで
- Pro(月額500円): 企業/イベント/タスク無制限、通知、ESテンプレ保存

## 画面
- `/login`
- `/dashboard`

## Firestore collection案
- users/{userId}
- users/{userId}/companies/{companyId}
- users/{userId}/events/{eventId}
- users/{userId}/tasks/{taskId}
- users/{userId}/subscription/current

## 起動
```bash
npm install
npm run dev
```

## 次にやること
1. Firebaseプロジェクト作成
2. Authentication有効化（Googleログイン or メール）
3. Firestore作成
4. 環境変数を設定
5. API route を Firestore 実装に接続
6. Vercelへデプロイ
