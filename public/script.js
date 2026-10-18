const $ = (s, r = document) => r.querySelector(s);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const rnd = n => [...crypto.getRandomValues(new Uint8Array(n))];
const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const newAddr = () => 'G' + rnd(55).map(b => B32[b % 32]).join(''); // dirección de ejemplo (no existe en la red)
const short = k => k.slice(0, 5) + '…' + k.slice(-5);
const LL = { lumi: { lang: 'es', name: 'Lumi' }, wara: { lang: 'ay', name: 'Wara' }, quyllur: { lang: 'qu', name: 'Quyllur' } };
const phones = [];
const SIM = new URLSearchParams(location.search).has('sim'); // ?sim=1 -> todo simulado, sin red (plan B)
let rounds = 0;
async function api(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
  const d = await r.json().catch(() => ({})); if (!r.ok) throw new Error(d.error || 'Error de red'); return d;
}

// QR de demostración: parece un QR (esquinas + módulos) pero NO es escaneable; se genera a partir de la dirección
function qrImg(addr) {
  const n = 25, m = 8, c = document.createElement('canvas'); c.width = c.height = (n + 2) * m;
  const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#2b1810';
  let s = [...addr].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    let on;
    if ((x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7)) {
      const fx = x >= n - 7 ? x - (n - 7) : x, fy = y >= n - 7 ? y - (n - 7) : y;
      on = fx == 0 || fx == 6 || fy == 0 || fy == 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
    } else on = r() > .5;
    if (on) g.fillRect((x + 1) * m, (y + 1) * m, m, m);
  }
  return c.toDataURL();
}

class Chat {
  constructor(n) {
    this.n = n; this.state = 'sel';
    this.root = $('#tpl').content.firstElementChild.cloneNode(true); $('#phones').appendChild(this.root);
    this.msgs = $('.msgs', this.root); this.actions = $('.actions', this.root);
    $('.cap', this.root).textContent = 'Persona ' + n;
    this.root.querySelectorAll('.pick button').forEach(b => b.onclick = () => this.start(b.dataset.l));
  }
  t(k, v = {}) { const s = (LESSONS[this.lang] || {})[k] ?? LESSONS.es[k]; return s.replace(/\{(\w+)\}/g, (_, x) => v[x] ?? ''); }
  scroll() { this.msgs.scrollTo({ top: this.msgs.scrollHeight, behavior: 'smooth' }); }
  bubble(text, me) {
    const row = document.createElement('div'); row.className = 'row' + (me ? ' me' : '');
    row.innerHTML = (me ? '' : `<img src="img/llama-${this.llama}.png" alt="">`) + '<div class="b"></div>';
    row.lastChild.textContent = text; this.msgs.appendChild(row); this.scroll(); return row;
  }
  typing() { const t = this.bubble('', false); t.lastChild.className = 'b dots'; t.lastChild.innerHTML = '<span></span><span></span><span></span>'; return t; }
  async say(text) { const t = this.typing(); await sleep(800 + Math.random() * 600); t.remove(); return this.bubble(text, false); }
  async sticker(name) { // img/stickers/<llama>/<name>.png (intro, explain, chart, normal, hola)
    await sleep(400); const el = document.createElement('div'); el.className = 'sticker';
    el.innerHTML = `<img src="img/stickers/${this.llama}/${name}.png" alt="">`; this.msgs.appendChild(el);
    el.firstChild.onload = () => this.scroll(); this.scroll();
  }
  buttons(opts) {
    this.actions.innerHTML = '';
    opts.forEach(([label, fn]) => { const b = document.createElement('button'); b.textContent = label; b.onclick = () => { this.actions.innerHTML = ''; this.bubble(label, true); fn(); }; this.actions.appendChild(b); });
  }
  async end(text) { await this.say(text); this.actions.innerHTML = ''; this.state = 'end'; }

  async start(l) {
    this.llama = l; this.lang = LL[l].lang;
    $('.sel', this.root).hidden = true; $('.chat', this.root).hidden = false;
    $('.hav', this.root).src = `img/llama-${l}.png`; $('.hname', this.root).textContent = LL[l].name;
    await this.sticker('intro'); await this.say(this.t('m1', { name: LL[l].name }));
    this.buttons([[this.t('yes'), () => this.m2()], [this.t('doubt'), async () => {
      await this.say(this.t('m1doubt')); this.buttons([[this.t('y'), () => this.m2()], [this.t('n'), () => this.end(this.t('bye'))]]);
    }]]);
  }
  quiz(correct, okKey, badKey, next) {
    const f = ok => async () => { await this.say(this.t(ok ? okKey : badKey)); next(); };
    this.buttons(['A', 'B', 'C'].map(x => [x, f(x === correct)]));
  }
  async m2() {
    this.state = 'm2'; await this.sticker('explain'); await this.say(this.t('m2a')); await this.say(this.t('m2q'));
    this.quiz('A', 'm2ok', 'm2bad', () => this.m3());
  }
  async m3() {
    await this.sticker('chart'); await this.say(this.t('m3a')); await this.say(this.t('m3q'));
    this.quiz('C', 'm3ok', 'm3bad', () => this.m4());
  }
  async m4() { await this.say(this.t('m4')); await this.prepare(); }
  async prepare() { // cuenta real de Testnet (o ficticia en ?sim=1)
    const t = this.typing();
    try {
      const a = SIM ? { sessionId: null, publicKey: newAddr(), balance: '10000.0000000', qr: qrImg(newAddr()) } : await api('/api/session/start');
      Object.assign(this, { sessionId: a.sessionId, addr: a.publicKey, bal: a.balance, qr: a.qr }); t.remove();
      await this.say(this.t('m4ready')); this.buttons([[this.t('ready'), () => this.m5()]]);
    } catch (e) { t.remove(); await this.say(this.t('prepErr', { err: e.message })); this.buttons([[this.t('retry'), () => this.prepare()]]); }
  }
  async m5() { await this.sticker('normal'); await this.say(this.t('scanIntro')); this.showQR(); this.showScan(); }
  showQR() {
    this.state = 'qr';
    const card = document.createElement('div'); card.className = 'card';
    card.innerHTML = `<img src="${this.qr}" draggable="true" alt="QR"><div>${this.t('qrLabel', { addr: short(this.addr) }).replace('\n', '<br>')}</div>`;
    card.firstChild.ondragstart = e => e.dataTransfer.setData('text/plain', String(this.n));
    this.msgs.appendChild(card); this.scroll();
  }
  showScan() {
    this.state = 'scan';
    const z = this.zone = document.createElement('div'); z.className = 'scan'; z.innerHTML = this.t('scanLabel').replace('\n', '<br>');
    z.ondragover = e => { e.preventDefault(); z.classList.add('over'); }; z.ondragleave = () => z.classList.remove('over');
    z.ondrop = e => { e.preventDefault(); z.classList.remove('over'); this.drop(+e.dataTransfer.getData('text/plain')); };
    this.msgs.appendChild(z); this.scroll();
  }
  async drop(fromN) {
    const other = phones.find(p => p.n === fromN);
    if (this.state !== 'scan' || !other || other === this || !['qr', 'scan'].includes(other.state)) return this.say(this.t('scanBad'));
    this.state = 'amount'; other.state = 'receiving'; this.peer = other; other.zone?.classList.add('off');
    this.zone.classList.add('ok'); this.zone.textContent = this.t('scanOk', { to: short(other.addr) });
    this.bubble(this.t('scanned', { to: short(other.addr) }), true);
    await this.say(this.t('amount'));
    this.actions.innerHTML = `<input type="number" step="any" min="0" max="100" inputmode="decimal" autocomplete="off" placeholder="Máx. 100"><button>${this.t('send')}</button>`;
    const inp = $('input', this.actions), go = async () => {
      const n = Number(inp.value.replace(',', '.'));
      if (!inp.value || !(n > 0) || n > 100) return this.say(this.t('badAmount'));
      this.actions.innerHTML = ''; this.bubble(n + ' XLM', true); this.summary(n);
    };
    inp.focus();
    $('button', this.actions).onclick = go; inp.addEventListener('keydown', e => { if (e.key === 'Enter') go(); }); // no devolver false: cancelaría el tecleo
  }
  async summary(amt) {
    await this.say(this.t('summary', { from: short(this.addr), to: short(this.peer.addr), amt }));
    this.buttons([[this.t('ok'), () => this.confirm(amt)], [this.t('cancel'), () => { this.peer.state = 'qr'; this.peer.zone?.classList.remove('off'); this.state = 'scan'; this.end(this.t('cancelled')); }]]);
  }
  async confirm(amt) {
    const to = this.peer, t = this.typing();
    let r;
    try { r = SIM ? simTx(this, to, amt) : await api('/api/transaction', { sessionId: this.sessionId, destination: to.addr, amount: amt }); }
    catch (e) { t.remove(); await this.say(this.t('txErr', { err: e.message })); this.buttons([[this.t('retry'), () => this.confirm(amt)]]); return; }
    t.remove();
    const tx = { amt, from: this.addr, to: to.addr, real: !SIM, fee: '0.0000100', ...r };
    this.bal = r.senderBalanceAfter; to.bal = r.receiverBalanceAfter; this.state = 'done'; to.state = 'done'; rounds++;
    await this.say(this.t('confirmed')); this.buttons([[this.t('view'), () => this.view(tx)]]);
    await to.say(to.t('received', { amt, from: short(this.addr) })); to.buttons([[to.t('view'), () => to.view(tx)]]);
    if (rounds === 1) { // invitar a la otra persona a devolver el envío
      await to.say(to.t('inviteBack')); to.showScan(); this.showQR();
    }
  }
  async view(tx) { await openPanel(tx); await this.sticker('hola'); await this.say(this.t('closing')); }
}

// Transacción simulada (solo con ?sim=1)
function simTx(a, b, amt) {
  const sb = Number(a.bal), rb = Number(b.bal);
  return { hash: rnd(32).map(x => x.toString(16).padStart(2, '0')).join(''), senderBalanceBefore: sb, senderBalanceAfter: sb - amt - 0.00001, receiverBalanceBefore: rb, receiverBalanceAfter: rb + amt };
}
const fmt = n => Number(n).toFixed(5);
async function openPanel(tx) {
  const p = $('#panelT'), b = $('.body', p); p.hidden = false; p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter');
  $('.badge', p).textContent = tx.real ? 'TESTNET REAL' : 'SIMULACIÓN';
  b.innerHTML = `<div class="kv"><small>Remitente</small><code>${tx.from}</code></div><div class="kv"><small>Destinatario</small><code>${tx.to}</code></div><ul class="steps"></ul><div class="spin"></div>`;
  const steps = [`Transacción armada: pago de ${tx.amt} XLM`, 'Firmada con la clave secreta del remitente', 'Validada por la red', 'Confirmada en el libro compartido'];
  for (const s of steps) { await sleep(800); const li = document.createElement('li'); li.textContent = s; $('.steps', b).appendChild(li); }
  await sleep(600); p.classList.add('glow');
  b.innerHTML = `<div class="ok"><img src="img/success-icon.png" alt="Éxito"><h3>Transacción confirmada</h3></div>
   <div class="kv"><small>Hash</small><code>${tx.hash}</code></div>
   <div class="kv"><small>Remitente</small>${fmt(tx.senderBalanceBefore)} → <b>${fmt(tx.senderBalanceAfter)}</b> XLM</div>
   <div class="kv"><small>Destinatario</small>${fmt(tx.receiverBalanceBefore)} → <b>${fmt(tx.receiverBalanceAfter)}</b> XLM</div>
   <div class="kv"><small>Comisión</small>${tx.fee} XLM</div>
   ${tx.real ? `<a href="${tx.explorerUrl}" target="_blank" rel="noopener">Ver en explorador</a>` : '<p class="note">Simulación: este hash y estas cuentas no existen en la red real.</p>'}`;
}
phones.push(new Chat(1), new Chat(2));
