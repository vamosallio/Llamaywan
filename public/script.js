const $ = s => document.querySelector(s);
const msgs = $('#msgs'), actions = $('#actions');
const sleep = ms => new Promise(r => setTimeout(r, ms));
let sessionId = null, accts = null, amount = null, state = 'SELECT_LLAMA';
const short = k => k.slice(0, 6) + '…' + k.slice(-6);
const scroll = () => msgs.scrollTo({ top: msgs.scrollHeight, behavior: 'smooth' });

function bubble(text, me, html) {
  const row = document.createElement('div'); row.className = 'row' + (me ? ' me' : '');
  row.innerHTML = (me ? '' : '<img src="img/llama-lumi.png" alt="">') + '<div class="b"></div>';
  row.lastChild[html ? 'innerHTML' : 'textContent'] = text;
  msgs.appendChild(row); scroll(); return row;
}
// Muestra "escribiendo…" y luego el mensaje del bot
async function say(text, html) {
  const t = bubble('', false); t.lastChild.className = 'b dots'; t.lastChild.innerHTML = '<span></span><span></span><span></span>';
  await sleep(800 + Math.random() * 600); t.remove(); return bubble(text, false, html);
}
function buttons(opts) { // opts: [label, handler]
  actions.innerHTML = '';
  opts.forEach(([label, fn]) => { const b = document.createElement('button'); b.textContent = label; b.onclick = () => { actions.innerHTML = ''; bubble(label, true); fn(); }; actions.appendChild(b); });
}
const LLAMA = 'lumi'; // llama elegida: stickers en img/stickers/<llama>/<nombre>.png
async function sticker(name) {
  await sleep(500);
  const el = document.createElement('div'); el.className = 'sticker';
  el.innerHTML = `<img src="img/stickers/${LLAMA}/${name}.png" alt="">`; msgs.appendChild(el);
  el.querySelector('img').onload = scroll; scroll();
}
const end = async t => { await say(t); actions.innerHTML = ''; state = 'END'; };

// Selector de llama
document.querySelectorAll('.pick button').forEach(b => b.onclick = () => {
  const l = b.dataset.l;
  if (l === 'lumi') { $('#select').hidden = true; $('#chat').hidden = false; msg1(); }
  else { const s = $('#soon'); s.hidden = false; s.textContent = `🚧 Próximamente: lección en ${l === 'wara' ? 'aymara' : 'quechua'}`; setTimeout(() => s.hidden = true, 2500); }
});

async function msg1() {
  state = 'MSG1';
  await sticker('pizarra');
  await say('¡Hola! 👋 Soy Lumi, tu instructora. Vamos a aprender Stellar en una sola lección. Al final harás una transferencia real en la red de pruebas. No necesitas experiencia previa. ¿Empezamos? 🚀');
  buttons([['Sí, vamos', msg2], ['Tengo una duda', async () => {
    await say('Sin problema. Esta lección dura ~5 minutos y no usas dinero real. ¿Empezamos?');
    buttons([['Sí', msg2], ['No', () => end('Cuando quieras, aquí estaré 🦙')]]);
  }]]);
}
async function msg2() {
  state = 'MSG2';
  await say('Stellar es una red digital que permite enviar, recibir e intercambiar activos digitales entre cuentas. 🌐\n\nImagina que quieres enviar valor a alguien en otra ciudad. Stellar registra esa operación en una red compartida, sin que cada uno tenga su propio registro. A eso se le llama blockchain.\n\nVamos a comprobarlo 👇');
  await sticker('lentes');
  await say('¿Para qué sirve la red Stellar?\nA) Para enviar, recibir e intercambiar activos digitales.\nB) Para almacenar fotos de WhatsApp.\nC) Para reemplazar apps de mensajería.');
  const ans = ok => async () => { await say(ok ? '¡Exacto! 🎉' : 'Casi. Stellar sirve para operar con activos digitales. La respuesta correcta es A.'); msg3(); };
  buttons([['A', ans(true)], ['B', ans(false)], ['C', ans(false)]]);
}
async function msg3() {
  state = 'MSG3';
  await say('Ahora XLM. 💡\n\nXLM (o lumen) es el activo nativo de Stellar. Sirve, entre otras cosas, para pagar las pequeñas comisiones de las transacciones.\n\n⚠️ Y algo muy importante: tu clave secreta autoriza operaciones. Nunca la compartas por chat, ni conmigo ni con nadie.');
  await sticker('grafico');
  await say('Si alguien te pide tu clave secreta para "enviarte XLM", ¿qué haces?\n\nA) Se la envío por WhatsApp.\nB) La publico para que me ayuden.\nC) No la comparto nunca.');
  const ans = ok => async () => { await say(ok ? '¡Correcto! 🔐' : 'Cuidado: la clave secreta permite autorizar operaciones sobre tu cuenta, por eso nunca se comparte. La respuesta correcta es C.'); msg4(); };
  buttons([['A', ans(false)], ['B', ans(false)], ['C', ans(true)]]);
}
async function msg4() {
  state = 'MSG4';
  await say('Perfecto. Ahora usaremos Stellar Testnet, una red de pruebas con fondos ficticios, sin valor real. 🧪\n\nVoy a preparar tu cuenta de prueba. Dame un momento…');
  const t = bubble('', false); t.lastChild.className = 'b dots'; t.lastChild.innerHTML = '<span></span><span></span><span></span>';
  try {
    const r = await fetch('/api/session/start', { method: 'POST' }); const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    accts = d; sessionId = d.sessionId; t.remove();
    await say('✅ Tu cuenta de prueba está lista.\n\nCuando quieras continuar, responde:');
    buttons([['LISTO', msg5]]);
  } catch (e) { t.remove(); await say('⚠️ ' + (e.message || 'Error de red.')); buttons([['Reintentar', msg4]]); }
}
async function msg5() {
  state = 'MSG5';
  await sticker('normal');
  await say(`¡Llegó el momento de tu primera transferencia! 🤝\n\nTenemos un destinatario de prueba asignado: ${short(accts.receiverPublicKey)}.\n\n¿Continuamos con esta persona?`);
  buttons([['SÍ', askAmount], ['NO', async () => {
    await say('Sin problema. En esta demo usamos un destinatario fijo. ¿Continuamos de todas formas?');
    buttons([['SÍ', askAmount], ['CANCELAR', () => end('Sin problema, aquí estaré 🦙')]]);
  }]]);
}
async function askAmount() {
  state = 'MSG5B';
  await say('¿Cuántos XLM de prueba quieres enviar? Recuerda que son ficticios.');
  actions.innerHTML = '<input id="amt" type="number" step="any" min="0" max="100" placeholder="Máx. 100"><button id="go">Enviar</button>';
  const go = async () => {
    const v = $('#amt').value.trim(), n = Number(v);
    if (!v || !(n > 0) || n > 100) { await say('Cantidad inválida. Ingresa un número positivo, máximo 100.'); return; }
    amount = n; actions.innerHTML = ''; bubble(`${n} XLM`, true); msg6();
  };
  $('#go').onclick = go; $('#amt').onkeydown = e => e.key === 'Enter' && go();
}
async function msg6() {
  state = 'MSG6';
  await say(`Revisemos antes de ejecutar 👀\n\nResumen\nRed: Stellar Testnet\nDe: ${short(accts.senderPublicKey)}\nPara: ${short(accts.receiverPublicKey)}\nActivo: XLM de prueba\nCantidad: ${amount} XLM\n\nEsto no usa dinero real. Una vez confirmada en la red, no se puede deshacer.`);
  buttons([['CONFIRMAR', msg7], ['CANCELAR', () => end('Operación cancelada. No se envió nada. 🦙')]]);
}
// ---- Celular B ----
const B = $('#panelB');
function showB() {
  const p = $('#phoneB'); p.hidden = false; p.classList.add('enter');
  if (innerWidth <= 900) { $('#hint').hidden = false; p.scrollIntoView({ behavior: 'smooth' }); setTimeout(() => $('#hint').hidden = true, 4000); }
}
const acctHtml = () => `<div class="kv"><small>Remitente (tu cuenta de prueba)</small><code>${accts.senderPublicKey}</code> <button class="btn" style="padding:4px;margin:4px 0 0" onclick="navigator.clipboard.writeText('${accts.senderPublicKey}')">Copiar</button></div>
 <div class="kv"><small>Destinatario</small><code>${accts.receiverPublicKey}</code></div><div class="kv"><small>Saldo remitente</small>${accts.senderBalance} XLM</div>`;
async function msg7() {
  state = 'MSG7';
  await say('¡Confirmado! 🚀 Enviando a Stellar Testnet…\n\nMira el celular de la derecha: ahí verás lo que pasa de verdad en la red.');
  showB(); await sendTx();
}
async function sendTx() {
  B.innerHTML = acctHtml() + '<div class="spin"></div><p style="text-align:center">Enviando transacción a Testnet…</p>';
  try {
    const r = await fetch('/api/transaction', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId, amount }) });
    const d = await r.json(); if (!r.ok || !d.success) throw new Error(d.error || 'Error desconocido');
    $('#phoneB').classList.add('glow');
    B.innerHTML = `<div class="ok"><img src="img/success-icon.png" alt="Éxito"><h3>Transacción confirmada</h3></div>
     <div class="kv"><small>Hash</small><code>${d.hash}</code></div>
     <div class="kv"><small>Remitente</small>${d.senderBalanceBefore} → <b>${d.senderBalanceAfter}</b> XLM</div>
     <div class="kv"><small>Destinatario</small>${d.receiverBalanceBefore} → <b>${d.receiverBalanceAfter}</b> XLM</div>
     <a href="${d.explorerUrl}" target="_blank" rel="noopener">Ver en explorador</a>`;
    state = 'MSG8';
    await sticker('hola');
    await say(`🎉 ¡Transferencia completada en Stellar Testnet!\n\nGuarda este identificador:\n<code>${d.hash}</code>\n\nAprendiste qué es Stellar, qué es XLM, por qué la clave secreta es privada, y cómo se ve una transacción verificada en la blockchain.\n\n¡Gracias por aprender conmigo! 🌟🦙`, true);
  } catch (e) {
    B.innerHTML = `<h3 class="err">No se pudo completar</h3><p class="err">${e.message}</p><button class="btn" id="retry">Reintentar</button>`;
    $('#retry').onclick = sendTx; // el servidor verifica en Horizon antes de reenviar
  }
}
