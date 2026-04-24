# JobMate v2 プロダクト設計

## プロダクト概要
新卒就活生向けの **応募管理 + ES回答バンク + ES入力支援** サービス。

構成は次の2つです。
- **Webアプリ**: 企業管理、日程管理、ES回答保存、文字数別テンプレ編集
- **Chrome拡張**: 採用サイト上の設問検出、候補回答の提示、ユーザー承認後の挿入

## 誰向けか
- 新卒就活生
- 複数社を並行して受ける人
- ESの使い回しと調整が面倒な人
- 面接、締切、適性検査、説明会をまとめて管理したい人

## 解く課題
1. 面接や締切を忘れる
2. 企業ごとの進捗が散らばる
3. ES回答の再利用が面倒
4. 採用サイトで毎回同じ内容を手入力するのが面倒
5. 文字数違いのESを何度も作り直すのが面倒

## MVPスコープ
### Webアプリ
- ログイン
- ダッシュボード
- 企業管理
- イベント管理（説明会 / ES締切 / 適性検査 / 面接 / その他）
- タスク管理
- ES回答バンク
- 文字数別回答保存（100 / 200 / 300 / 400 / long）
- タグ、カテゴリ、企業ひも付け

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

## 差別化ポイント
- 就活管理とES入力支援が一体
- 「回答保存」だけでなく「設問に近い候補を出して挿入」まで行う
- 文字数別テンプレで再利用しやすい

## 料金案
### Free
- 企業3社まで
- ES 10件まで
- 手動管理のみ

### Pro 500円 / 月
- 企業無制限
- ES無制限
- タグ・カテゴリ管理
- Chrome拡張での候補表示
- ワンクリック挿入
- 文字数別テンプレ保存

### Pro Plus 980円 / 月
- AI短縮
- AI言い換え
- 企業別最適化
- 面接質問生成

## KPI
- 初回登録率
- 7日継続率
- 企業登録数 / ユーザー
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

## リリース順
### Phase 1
- WebアプリMVP
- Firestore接続
- ES回答バンク

### Phase 2
- Chrome拡張で設問抽出
- 候補表示
- 手動挿入

### Phase 3
- AI短縮 / 言い換え
- 類似度向上
- 通知
- 課金
