'use client';

import { useMemo, useState } from 'react';
import type { Company } from '@/types';
import { mergeCompany, readCompanyOverride, writeCompanyOverride } from '@/lib/company-storage';
import { getAuthHeaders } from '@/lib/auth/client-auth-fetch';

type Props = {
  company: Company;
};

type FormState = {
  jobType: string;
  location: string;
  salary: string;
  deadline: string;
  testType: string;
  memo: string;
  selectionFlowText: string;
  portalUrl: string;
  recruitingUrl: string;
  loginId: string;
  loginIdLabel: string;
  loginMemo: string;
  nextCheckAt: string;
};

function toInputDateTime(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromInputDateTime(value: string) {
  if (!value) return undefined;
  return new Date(value).toISOString();
}

function buildInitialState(company: Company): FormState {
  return {
    jobType: company.jobType ?? '',
    location: company.location ?? '',
    salary: company.salary ?? '',
    deadline: toInputDateTime(company.deadline),
    testType: company.testType ?? '',
    memo: company.memo ?? '',
    selectionFlowText: (company.selectionFlow ?? []).join('\n'),
    portalUrl: company.portal?.portalUrl ?? '',
    recruitingUrl: company.portal?.recruitingUrl ?? '',
    loginId: company.portal?.loginId ?? '',
    loginIdLabel: company.portal?.loginIdLabel ?? '',
    loginMemo: company.portal?.loginMemo ?? '',
    nextCheckAt: toInputDateTime(company.portal?.nextCheckAt),
  };
}

export default function CompanyHubEditor({ company }: Props) {
  const hydratedCompany = useMemo(() => mergeCompany(company, readCompanyOverride(company.id)), [company]);
  const [form, setForm] = useState<FormState>(() => buildInitialState(hydratedCompany));
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const previewFlow = useMemo(
    () => form.selectionFlowText.split('\n').map((step) => step.trim()).filter(Boolean),
    [form.selectionFlowText],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    const override: Partial<Company> = {
      jobType: form.jobType,
      location: form.location,
      salary: form.salary,
      deadline: fromInputDateTime(form.deadline),
      testType: form.testType,
      memo: form.memo,
      selectionFlow: previewFlow,
      portal: {
        ...hydratedCompany.portal,
        portalUrl: form.portalUrl,
        recruitingUrl: form.recruitingUrl,
        loginId: form.loginId,
        loginIdLabel: form.loginIdLabel,
        loginMemo: form.loginMemo,
        nextCheckAt: fromInputDateTime(form.nextCheckAt),
      },
      updatedAt: new Date().toISOString(),
    };

    setStatus('saving');
    setMessage('');

    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: 'PUT',
        headers: await getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(override),
      });

      if (!response.ok) {
        throw new Error('save_failed');
      }

      writeCompanyOverride(company.id, override);
      setSavedAt(new Date().toLocaleString('ja-JP'));
      setStatus('saved');
      setMessage('保存しました。ダッシュボードにも反映されます。');
    } catch {
      writeCompanyOverride(company.id, override);
      setSavedAt(new Date().toLocaleString('ja-JP'));
      setStatus('error');
      setMessage('サーバー保存に失敗したため、このブラウザにだけ保存しました。');
    }
  }

  async function handleCopyLoginId() {
    if (!form.loginId) return;
    try {
      await navigator.clipboard.writeText(form.loginId);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="card">
      <div className="header" style={{ alignItems: 'flex-start' }}>
        <div>
          <span className="badge">編集フォーム</span>
          <h2 style={{ marginBottom: 6 }}>Company Hub を更新</h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            今回から API 経由の保存に対応。失敗時はブラウザ内保存にフォールバックします。
          </p>
        </div>
        <button className="btn" onClick={handleSave} disabled={status === 'saving'}>
          {status === 'saving' ? '保存中...' : '保存'}
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="grid" style={{ gap: 14 }}>
          <label>
            職種
            <input className="input" value={form.jobType} onChange={(e) => update('jobType', e.target.value)} />
          </label>
          <label>
            勤務地
            <input className="input" value={form.location} onChange={(e) => update('location', e.target.value)} />
          </label>
          <label>
            給与
            <input className="input" value={form.salary} onChange={(e) => update('salary', e.target.value)} />
          </label>
          <label>
            締切
            <input type="datetime-local" className="input" value={form.deadline} onChange={(e) => update('deadline', e.target.value)} />
          </label>
          <label>
            適性検査
            <input className="input" value={form.testType} onChange={(e) => update('testType', e.target.value)} placeholder="SPI / 玉手箱 / TG-WEB" />
          </label>
          <label>
            選考フロー（1行1ステップ）
            <textarea className="textarea" rows={6} value={form.selectionFlowText} onChange={(e) => update('selectionFlowText', e.target.value)} />
          </label>
          <label>
            メモ
            <textarea className="textarea" rows={5} value={form.memo} onChange={(e) => update('memo', e.target.value)} />
          </label>
        </div>

        <div className="grid" style={{ gap: 14 }}>
          <label>
            マイページURL
            <input className="input" value={form.portalUrl} onChange={(e) => update('portalUrl', e.target.value)} />
          </label>
          <label>
            採用ページURL
            <input className="input" value={form.recruitingUrl} onChange={(e) => update('recruitingUrl', e.target.value)} />
          </label>
          <label>
            ログインID
            <div className="row" style={{ alignItems: 'center' }}>
              <input className="input" value={form.loginId} onChange={(e) => update('loginId', e.target.value)} />
              <button type="button" className="btn btn-secondary" onClick={handleCopyLoginId}>
                {copied ? 'コピー済み' : 'IDをコピー'}
              </button>
            </div>
          </label>
          <label>
            ID種別
            <input className="input" value={form.loginIdLabel} onChange={(e) => update('loginIdLabel', e.target.value)} placeholder="メールアドレス / 会員ID" />
          </label>
          <label>
            ログインメモ
            <textarea className="textarea" rows={4} value={form.loginMemo} onChange={(e) => update('loginMemo', e.target.value)} placeholder="Googleログイン / 2段階認証 / SMS認証 など" />
          </label>
          <label>
            次回確認予定
            <input type="datetime-local" className="input" value={form.nextCheckAt} onChange={(e) => update('nextCheckAt', e.target.value)} />
          </label>

          <div className="item" style={{ background: '#fafafa' }}>
            <strong>プレビュー</strong>
            <p style={{ color: '#6b7280' }}>保存先は API 経由。失敗時だけブラウザ保存に切り替えます。</p>
            <p><strong>選考フロー:</strong> {previewFlow.join(' → ') || '未設定'}</p>
            <p><strong>ログインID:</strong> {form.loginId || '未設定'}</p>
            <p style={{ marginBottom: 0 }}><strong>次回確認予定:</strong> {form.nextCheckAt || '未設定'}</p>
          </div>
        </div>
      </div>

      {savedAt ? <p style={{ color: '#065f46', marginTop: 16, marginBottom: 0 }}>最終保存: {savedAt}</p> : null}
      {message ? (
        <p style={{ color: status === 'error' ? '#b45309' : '#065f46', marginTop: 8, marginBottom: 0 }}>{message}</p>
      ) : null}
    </div>
  );
}
