# JobMate v3 プロダクト設計

## プロダクト概要
新卒就活生向けの **就活OS**。

1つのサービス内で次をまとめて扱う。
- 応募企業の管理
- 説明会 / ES締切 / 適性検査 / 面接の日程管理
- ES回答バンク
- 採用サイトでのES入力支援
- 企業ごとの募集要項・選考フロー・検査情報の整理表示
- （Phase 2）ユーザー投稿ベースの企業選考データ共有

構成は次の2つ。
- **Webアプリ**: 就活管理、企業情報管理、ES保存、面接準備、設定
- **Chrome拡張**: 採用サイト上で設問を検出し、保存済みESから候補を表示して挿入する

## 誰向けか
- 新卒就活生
- 複数社を並行して受ける人
- ESの使い回しと調整が面倒な人
- 企業ごとの情報を1画面で見たい人
- 面接や締切、適性検査をまとめて管理したい人

## 解く課題
1. 企業ごとの情報が散らばっている
2. 募集要項・選考フロー・締切が見返しにくい
3. ES回答の再利用が面倒
4. 採用サイトで毎回同じ内容を手入力するのが面倒
5. 文字数違いのESを何度も作り直すのが面倒
6. 選考の進捗と次にやることが分かりにくい

## 価値提案
JobMateは、就活生が「どの企業に、いつ、何を、どう書くか」を1か所で管理できるサービス。

単なるタスク管理ではなく、
- 企業ページ = 企業研究ハブ
- ESバンク = 回答資産
- Chrome拡張 = 入力支援
として機能する。

## v3で追加された中核機能
### 1. Company Hub（MVPに含む）
企業ごとに次の情報をまとめて保持する。
- 基本情報（社名、業界、URL）
- 募集要項（職種、勤務地、給与、締切、概要メモ）
- 選考フロー（ES → Webテスト → 面接 → 最終 など）
- 適性検査種別（SPI / 玉手箱 / TG-WEB など）
- 自分の応募ステータス
- その企業に紐づくES、イベント、タスク、メモ

### 2. ES入力支援（MVPに含む）
- 採用サイト上で設問文を推定
- 保存済みESの中から候補を提示
- ユーザー承認後に入力欄へ挿入
- 文字数超過を警告

### 3. 企業選考データ共有（Phase 2）
他サービスの内容を転載せず、**ユーザー投稿ベース**で蓄積する。
- 選考フロー投稿
- ES設問投稿
- 適性検査の種類
- 面接質問投稿
- 投稿ベースの参考傾向表示

## MVPスコープ
### Webアプリ
- ログイン
- ダッシュボード
- 企業一覧
- 企業詳細（Company Hub）
- イベント管理
- タスク管理
- ES回答バンク
- 文字数別回答保存（100 / 200 / 300 / 400 / long）
- タグ / カテゴリ / 企業ひも付け

### 企業詳細ページ（MVP）
- 企業名、業界、URL
- 募集要項入力
  - 職種
  - 勤務地
  - 給与
  - 締切
  - 概要メモ
- 選考フロー入力
- 適性検査種別入力
- 応募ステータス更新
- この企業に紐づくイベント一覧
- この企業に紐づくES一覧
- 自由メモ

### Chrome拡張
- 現在ページのテキストエリア・入力欄を検出
- 設問文の取得（近傍ラベル / 見出し / placeholder などから推定）
- 保存済み回答候補を3件まで表示
- ユーザー承認後に回答を入力欄へ挿入
- maxlength が取れる場合は超過警告

## やらないこと
- 自動送信
- CAPTCHA回避
- ログイン突破
- 非表示データの取得
- 適性検査や性格診断への自動回答
- 背後で全欄を無断入力する動作
- 他社サイトの無断転載やスクレイピングを前提にした企業情報取得

## データ取得ポリシー
### 許可する方向
- ユーザー本人が入力した企業情報
- ユーザー本人が作成したES
- ユーザー本人の体験投稿
- 公開URLのメモ保存

### 避ける方向
- 他サービスのコンテンツを丸ごと複製すること
- 利用規約に反する自動収集
- 第三者の有料投稿の転記

## 差別化ポイント
- 就活管理とES入力支援が一体
- 企業ごとに「締切 / 選考 / ES / タスク / メモ」がまとまる
- 単なるメモ帳ではなく、採用サイトの入力支援までつながる
- 将来的に、投稿ベースの企業研究データがたまる

## 料金案
### Free
- 企業3社まで
- ES 10件まで
- 企業詳細の保存制限あり
- Chrome拡張の候補表示なし

### Pro 500円 / 月
- 企業無制限
- ES無制限
- Company Hub 完全利用
- タグ・カテゴリ管理
- Chrome拡張での候補表示
- ワンクリック挿入
- 文字数別テンプレ保存

### Pro Plus 980円 / 月
- AI短縮
- AI言い換え
- 企業別最適化
- 面接質問生成
- （将来）企業研究の参考サマリー生成

## KPI
- 初回登録率
- 7日継続率
- 企業登録数 / ユーザー
- Company Hub入力率
- ES登録数 / ユーザー
- 拡張機能インストール率
- ES候補挿入利用率
- 無料→有料転換率

## 画面一覧
### Webアプリ
- `/login`
- `/dashboard`
- `/companies`
- `/companies/[id]`
- `/events`
- `/tasks`
- `/essays`
- `/essays/[id]`
- `/settings`
- `/billing`

### Chrome拡張
- Popup
- Options（将来）
- Content Script Overlay（将来）

## Firestore構成案
- users/{userId}
- users/{userId}/companies/{companyId}
- users/{userId}/events/{eventId}
- users/{userId}/tasks/{taskId}
- users/{userId}/essays/{essayId}
- users/{userId}/promptMatchLogs/{logId}
- users/{userId}/subscription/current
- companiesPublic/{normalizedCompanyName}/reports/{reportId} （Phase 2）

## 主なデータモデル
### Company
```ts
export interface Company {
  id: string;
  userId?: string;
  name: string;
  industry?: string;
  website?: string;
  jobType?: string;
  location?: string;
  salary?: string;
  deadline?: string;
  description?: string;
  selectionFlow?: string[];
  testType?: string;
  stage: 'interest' | 'applied' | 'es' | 'test' | 'interview' | 'offer' | 'rejected';
  memo?: string;
  createdAt: string;
  updatedAt?: string;
}
```

### EssayEntry
```ts
export interface EssayEntry {
  id: string;
  userId?: string;
  companyId?: string;
  category: 'gakuchika' | 'self_pr' | 'motivation' | 'strengths' | 'other';
  question: string;
  answerLong: string;
  answer400?: string;
  answer300?: string;
  answer200?: string;
  answer100?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}
```

### SelectionReport（Phase 2）
```ts
export interface SelectionReport {
  id: string;
  userId?: string;
  companyName: string;
  flow?: string[];
  testType?: string;
  esQuestions?: string[];
  interviewQuestions?: string[];
  result?: 'passed' | 'failed';
  reachedStage?: string;
  difficulty?: number;
  memo?: string;
  createdAt: string;
}
```

## リリース順
### Phase 1
- WebアプリMVP
- Firestore接続
- ES回答バンク
- Company Hub

### Phase 2
- Chrome拡張で設問抽出
- 候補表示
- 手動挿入
- 企業研究用の投稿データ基盤

### Phase 3
- AI短縮 / 言い換え
- 類似度向上
- 通知
- 課金
- 企業研究の参考サマリー

## 開発優先順位
### 今すぐ作るべきもの
1. 企業一覧
2. 企業詳細（Company Hub）
3. ES回答バンク
4. イベント / タスク管理
5. Chrome拡張の最小版

### 後で足すもの
1. 投稿データ共有
2. AI最適化
3. 詳細な分析指標
4. 高度な通知
