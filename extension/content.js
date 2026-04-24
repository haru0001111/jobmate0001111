function normalize(text) {
  return (text || '').toLowerCase().replace(/[\s\u3000]+/g, ' ').trim();
}

function getQuestionNearField(field) {
  const aria = field.getAttribute('aria-label');
  if (aria) return aria;

  const placeholder = field.getAttribute('placeholder');
  if (placeholder) return placeholder;

  const label = field.labels?.[0]?.innerText;
  if (label) return label;

  let el = field.previousElementSibling;
  let depth = 0;
  while (el && depth < 3) {
    const text = el.textContent?.trim();
    if (text && text.length <= 120) return text;
    el = el.previousElementSibling;
    depth += 1;
  }

  const parentText = field.parentElement?.innerText?.split('\n').find((line) => {
    const t = line.trim();
    return t && t.length <= 120 && t !== normalize(field.value);
  });

  return parentText || '設問文を取得できませんでした';
}

function buildSelector(field) {
  if (field.id) return `#${CSS.escape(field.id)}`;
  const all = Array.from(document.querySelectorAll('textarea, input[type="text"]'));
  const index = all.indexOf(field);
  return `__index__:${index}`;
}

function resolveField(selector) {
  if (selector.startsWith('__index__:')) {
    const index = Number(selector.split(':')[1]);
    return Array.from(document.querySelectorAll('textarea, input[type="text"]'))[index] || null;
  }
  return document.querySelector(selector);
}

function detectFields() {
  return Array.from(document.querySelectorAll('textarea, input[type="text"]'))
    .filter((field) => {
      const rect = field.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })
    .slice(0, 10)
    .map((field) => ({
      selector: buildSelector(field),
      question: getQuestionNearField(field),
      maxLength: field.maxLength > 0 ? field.maxLength : null,
      currentValue: field.value || '',
    }));
}

function isVisible(field) {
  const rect = field.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function likelyLoginField(field) {
  const type = (field.getAttribute('type') || '').toLowerCase();
  const hints = [
    field.name,
    field.id,
    field.placeholder,
    field.getAttribute('aria-label'),
    field.labels?.[0]?.innerText,
  ].filter(Boolean).join(' ');
  const text = normalize(hints);

  if (type === 'email') return true;
  if (!['text', 'email', ''].includes(type)) return false;

  return ['id', 'mail', 'email', 'ログイン', '会員', 'ユーザー', 'user'].some((kw) => text.includes(normalize(kw)));
}

function detectLoginField() {
  return Array.from(document.querySelectorAll('input'))
    .filter((field) => isVisible(field) && likelyLoginField(field))[0] || null;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'GET_DETECTED_FIELDS') {
    sendResponse({
      url: location.href,
      title: document.title,
      fields: detectFields(),
      hasLoginField: Boolean(detectLoginField()),
    });
    return true;
  }

  if (message.type === 'INSERT_ANSWER') {
    const field = resolveField(message.selector);
    if (!field) {
      sendResponse({ ok: false });
      return true;
    }

    field.focus();
    field.value = message.answer;
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    sendResponse({ ok: true });
    return true;
  }

  if (message.type === 'INSERT_LOGIN_ID') {
    const field = detectLoginField();
    if (!field) {
      sendResponse({ ok: false });
      return true;
    }

    field.focus();
    field.value = message.value || '';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));
    sendResponse({ ok: true });
    return true;
  }
});
