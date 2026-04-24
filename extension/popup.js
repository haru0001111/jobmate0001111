const app = document.getElementById('app');
const DEFAULT_BASE_URL = 'http://localhost:3000';

function truncate(text, n = 80) {
  if (!text) return '';
  return text.length > n ? text.slice(0, n) + '…' : text;
}

function normalize(text) {
  return (text || '').toLowerCase().replace(/[\s\u3000]+/g, ' ').trim();
}

function hostOf(url) {
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return '';
  }
}

function score(question, essay) {
  const q = normalize(question);
  const e = normalize(essay.question);
  if (!q || !e) return 0;
  if (q === e) return 100;
  if (q.includes(e) || e.includes(q)) return 60;

  const keywords = ['学生時代', '自己pr', '志望動機', '強み', '弱み', '挑戦', 'チーム', '研究', '失敗'];
  let s = 0;
  keywords.forEach((kw) => {
    if (q.includes(kw) && e.includes(kw)) s += 12;
  });

  const tagMatches = (essay.tags || []).filter((tag) => q.includes(normalize(tag))).length;
  s += tagMatches * 8;
  return s;
}

function bestAnswerForField(field, essays) {
  return [...essays]
    .map((essay) => ({ ...essay, score: score(field.question, essay) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((essay) => ({
      id: essay.id,
      question: essay.question,
      answer: essay.answerLong || essay.answer400 || essay.answer300 || essay.answer200 || essay.answer100 || '',
      score: essay.score,
      companyId: essay.companyId,
    }));
}

async function getStoredBaseUrl() {
  const result = await chrome.storage.local.get(['jobmateBaseUrl']);
  return (result.jobmateBaseUrl || DEFAULT_BASE_URL).replace(/\/$/, '');
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`fetch_failed:${response.status}`);
  return response.json();
}

function renderError(message) {
  app.innerHTML = `<div class="card"><div class="q">接続できませんでした</div><div class="a">${message}</div></div>`;
}

function appendCard() {
  const card = document.createElement('div');
  card.className = 'card';
  app.appendChild(card);
  return card;
}

function renderHeader({ company, baseUrl, matchedBy }) {
  const card = appendCard();
  card.innerHTML = `
    <div class="q">接続先: ${baseUrl}</div>
    <div class="a">${company ? `企業候補: ${company.name}（${matchedBy}一致）` : '企業は未特定。全ESから候補を出します。'}</div>
  `;
}

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

function renderPortalCard(tab, company) {
  if (!company?.portal) return;

  const card = appendCard();
  const loginId = company.portal.loginId || '';
  const label = company.portal.loginIdLabel || 'ログインID';
  const memo = company.portal.loginMemo || '未設定';
  const portalUrl = company.portal.portalUrl || '';
  const recruitingUrl = company.portal.recruitingUrl || '';

  card.innerHTML = `
    <div class="q">マイページ情報</div>
    <div class="a"><strong>${label}:</strong> ${loginId || '未設定'}</div>
    <div class="a"><strong>メモ:</strong> ${memo}</div>
    <div class="a"><strong>マイページ:</strong> ${portalUrl ? truncate(portalUrl, 50) : '未設定'}</div>
    <div class="a"><strong>採用ページ:</strong> ${recruitingUrl ? truncate(recruitingUrl, 50) : '未設定'}</div>
  `;

  if (loginId) {
    const actionRow = document.createElement('div');
    actionRow.className = 'actions';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = `${label}をコピー`;
    copyBtn.onclick = async () => {
      await copyText(loginId);
      copyBtn.textContent = 'コピー済み';
      setTimeout(() => { copyBtn.textContent = `${label}をコピー`; }, 1200);
    };
    actionRow.appendChild(copyBtn);

    const insertBtn = document.createElement('button');
    insertBtn.textContent = `${label}を入力`;
    insertBtn.onclick = async () => {
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'INSERT_LOGIN_ID',
        value: loginId,
      }).catch(() => ({ ok: false }));

      insertBtn.textContent = response?.ok ? '入力しました' : '入力できません';
      setTimeout(() => { insertBtn.textContent = `${label}を入力`; }, 1500);
    };
    actionRow.appendChild(insertBtn);

    card.appendChild(actionRow);
  }

  if (portalUrl) {
    const openBtn = document.createElement('button');
    openBtn.textContent = 'マイページを開く';
    openBtn.onclick = () => chrome.tabs.create({ url: portalUrl });
    card.appendChild(openBtn);
  }
}

function renderFieldCard(tab, field, index) {
  const card = document.createElement('div');
  card.className = 'card';

  const q = document.createElement('div');
  q.className = 'q';
  q.textContent = `設問 ${index + 1}: ${field.question || '不明な設問'}`;
  card.appendChild(q);

  if (field.maxLength) {
    const max = document.createElement('div');
    max.className = 'muted';
    max.textContent = `文字数上限: ${field.maxLength}`;
    card.appendChild(max);
  }

  if (!field.suggestions?.length) {
    const empty = document.createElement('div');
    empty.className = 'a';
    empty.textContent = '近いES候補が見つかりませんでした。';
    card.appendChild(empty);
    return card;
  }

  field.suggestions.forEach((s) => {
    const meta = document.createElement('div');
    meta.className = 'muted';
    meta.textContent = `一致度 ${s.score} / 元設問: ${truncate(s.question, 32)}`;
    card.appendChild(meta);

    const a = document.createElement('div');
    a.className = 'a';
    a.textContent = truncate(s.answer);
    card.appendChild(a);

    const btn = document.createElement('button');
    btn.textContent = 'この回答を挿入';
    btn.onclick = () => {
      chrome.tabs.sendMessage(tab.id, {
        type: 'INSERT_ANSWER',
        selector: field.selector,
        answer: s.answer,
      });
    };
    card.appendChild(btn);
  });

  return card;
}

async function main() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) {
    app.textContent = 'タブを取得できませんでした。';
    return;
  }

  const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_DETECTED_FIELDS' }).catch(() => null);
  if (!response) {
    app.textContent = 'このページではまだ候補を取得できません。';
    return;
  }

  const fields = response.fields || [];
  const baseUrl = await getStoredBaseUrl();

  let companies = [];
  let allEssays = [];
  try {
    const [companyData, essayData] = await Promise.all([
      fetchJson(`${baseUrl}/api/companies`),
      fetchJson(`${baseUrl}/api/essays`),
    ]);
    companies = companyData.items || [];
    allEssays = essayData.items || [];
  } catch {
    renderError('JobMate本体に接続できません。ローカルで起動しているか確認してください。');
    return;
  }

  let matchedBy = '';
  const company = companies.find((item) => {
    const portalMatch = [item.portal?.portalUrl, item.portal?.recruitingUrl, item.website]
      .filter(Boolean)
      .some((url) => hostOf(url) && hostOf(url) === hostOf(tab.url));
    if (portalMatch) matchedBy = 'URL';
    if (portalMatch) return true;
    const titleMatch = normalize(tab.title || '').includes(normalize(item.name));
    if (titleMatch) matchedBy = 'タイトル';
    return titleMatch;
  });

  const targetEssays = company
    ? allEssays.filter((essay) => essay.companyId === company.id).concat(allEssays.filter((essay) => essay.companyId !== company.id))
    : allEssays;

  const enrichedFields = fields.map((field) => ({
    ...field,
    suggestions: bestAnswerForField(field, targetEssays),
  }));

  app.innerHTML = '';
  renderHeader({ company, baseUrl, matchedBy });
  if (company) {
    renderPortalCard(tab, company);
  }

  if (!fields.length) {
    const card = appendCard();
    card.innerHTML = '<div class="q">ES入力欄は未検出</div><div class="a">このページでは設問入力欄がまだ見つかりませんでした。ログインIDだけ使えます。</div>';
    return;
  }

  enrichedFields.forEach((field, index) => {
    app.appendChild(renderFieldCard(tab, field, index));
  });
}

main().catch(() => {
  renderError('拡張機能の初期化に失敗しました。');
});
