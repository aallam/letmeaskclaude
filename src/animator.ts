function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element: HTMLTextAreaElement, text: string): Promise<void> {
  for (const char of text) {
    element.value += char;
    const delay = 120 + Math.random() * 80 - 40;
    await sleep(delay);
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

  await typeText(textarea, query);

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
