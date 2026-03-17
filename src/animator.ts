function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const NEARBY_KEYS: Record<string, string> = {
  a: 's', b: 'v', c: 'x', d: 'f', e: 'r', f: 'g', g: 'h',
  h: 'g', i: 'o', j: 'k', k: 'l', l: 'k', m: 'n', n: 'b',
  o: 'p', p: 'o', q: 'w', r: 't', s: 'd', t: 'y', u: 'i',
  v: 'c', w: 'e', x: 'z', y: 'u', z: 'x',
};

type Action =
  | { type: 'add'; char: string }
  | { type: 'delete' }
  | { type: 'pause'; ms: number };

function buildActions(text: string): Action[] {
  const actions: Action[] = [];
  let typoCount = 0;
  let charsSinceLastTypo = Infinity;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const lower = char.toLowerCase();
    const canTypo =
      typoCount < 2 &&
      charsSinceLastTypo >= 4 &&
      lower in NEARBY_KEYS &&
      Math.random() < 0.12;

    if (canTypo) {
      // Type 1–2 wrong characters
      const wrongCount = 1 + (i + 1 < text.length && text[i + 1].toLowerCase() in NEARBY_KEYS ? Math.round(Math.random()) : 0);
      actions.push({ type: 'add', char: NEARBY_KEYS[lower] });
      if (wrongCount === 2 && i + 1 < text.length) {
        actions.push({ type: 'add', char: NEARBY_KEYS[text[i + 1].toLowerCase()] });
      }
      // Pause (noticing the mistake)
      actions.push({ type: 'pause', ms: 300 });
      // Backspace the wrong characters
      for (let d = 0; d < wrongCount; d++) {
        actions.push({ type: 'delete' });
      }
      // Pause before resuming
      actions.push({ type: 'pause', ms: 150 });

      typoCount++;
      charsSinceLastTypo = 0;
    }

    actions.push({ type: 'add', char });
    charsSinceLastTypo++;
  }

  return actions;
}

async function executeActions(element: HTMLTextAreaElement, actions: Action[]): Promise<void> {
  for (const action of actions) {
    switch (action.type) {
      case 'add':
        element.value += action.char;
        await sleep(120 + Math.random() * 80 - 40);
        break;
      case 'delete':
        element.value = element.value.slice(0, -1);
        await sleep(80);
        break;
      case 'pause':
        await sleep(action.ms);
        break;
    }
  }
}

async function runAnimation(
  textarea: HTMLTextAreaElement,
  inputBox: HTMLDivElement,
  sendBtn: HTMLButtonElement,
  query: string,
): Promise<void> {
  await sleep(800);

  inputBox.classList.add('focused');
  await sleep(200);

  const actions = buildActions(query);
  await executeActions(textarea, actions);

  await sleep(700);

  sendBtn.classList.add('active');
  await sleep(300);

  sendBtn.classList.add('pressed');
  await sleep(200);
  sendBtn.classList.remove('pressed');

  await sleep(1000);

  window.location.href = `https://claude.ai/new?q=${encodeURIComponent(query)}`;
}

export function initAnimator(query: string): void {
  const app = document.getElementById('app')!;

  app.innerHTML = `
    <div class="animator">
      <div class="animator-top-bar">
        <button class="animator-top-btn" aria-label="Sidebar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
        <div class="animator-avatar"></div>
      </div>
      <div class="animator-main">
        <div class="animator-greeting">Let me ask Claude for you</div>
        <div class="animator-input-box">
          <textarea
            class="animator-textarea"
            readonly
            placeholder="How can I help you today?"
            rows="1"
          ></textarea>
          <div class="animator-toolbar">
            <div class="animator-toolbar-left">
              <button class="animator-attach" aria-label="Attach">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
            </div>
            <div class="animator-toolbar-right">
              <span class="animator-model">Sonnet 4.6</span>
              <button class="animator-send" aria-label="Send">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const textarea = app.querySelector<HTMLTextAreaElement>('.animator-textarea')!;
  const inputBox = app.querySelector<HTMLDivElement>('.animator-input-box')!;
  const sendBtn = app.querySelector<HTMLButtonElement>('.animator-send')!;

  runAnimation(textarea, inputBox, sendBtn, query);
}
