require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { Horizon, Keypair, TransactionBuilder, Operation, Asset, Networks, BASE_FEE } = require('@stellar/stellar-sdk');

const NETWORK = process.env.STELLAR_NETWORK || 'testnet';
if (NETWORK !== 'testnet') { console.error('Esta demo solo corre en testnet.'); process.exit(1); }
const HORIZON = process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org';
const FRIENDBOT = process.env.FRIENDBOT_URL || 'https://friendbot.stellar.org';
const PORT = process.env.PORT || 3000;
const server = new Horizon.Server(HORIZON);

const sessions = new Map(); // sessionId -> { sender:{publicKey,secret}, receiverPublicKey, status, hash, result }
let receiverKp = null;      // destinatario compartido, se crea y fondea una sola vez

const app = express();
app.use(express.json());
app.use(express.static('public'));

async function fund(pub) {
  const r = await fetch(`${FRIENDBOT}?addr=${encodeURIComponent(pub)}`);
  // Friendbot responde 400 si la cuenta ya estaba fondeada; lo tratamos como OK
  if (!r.ok && r.status !== 400) throw new Error(`Friendbot respondió ${r.status}`);
}
async function balance(pub) {
  const acc = await server.loadAccount(pub);
  return acc.balances.find(b => b.asset_type === 'native').balance;
}
async function ensureReceiver() {
  if (!receiverKp) { const kp = Keypair.random(); await fund(kp.publicKey()); receiverKp = kp; }
  return receiverKp.publicKey();
}

app.post('/api/session/start', async (req, res) => {
  try {
    const sender = Keypair.random();
    const receiverPublicKey = await ensureReceiver();
    await fund(sender.publicKey());
    const [senderBalance, receiverBalance] = await Promise.all([balance(sender.publicKey()), balance(receiverPublicKey)]);
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { sender: { publicKey: sender.publicKey(), secret: sender.secret() }, receiverPublicKey, status: 'ready' });
    res.json({ sessionId, senderPublicKey: sender.publicKey(), receiverPublicKey, senderBalance, receiverBalance });
  } catch (e) {
    console.error('start error:', e.message);
    res.status(502).json({ error: 'No se pudo preparar la cuenta de prueba (Friendbot/Horizon). Intenta de nuevo.' });
  }
});

app.post('/api/transaction', async (req, res) => {
  const { sessionId, amount } = req.body || {};
  const s = sessions.get(sessionId);
  if (!s) return res.status(404).json({ error: 'Sesión no encontrada. Reinicia la demo.' });
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0 || amt > 100) return res.status(400).json({ error: 'Cantidad inválida (0 < x ≤ 100).' });
  if (s.status === 'done') return res.json(s.result); // una transacción por sesión: no se duplica
  if (s.status === 'sending') return res.status(409).json({ error: 'Transacción en curso.' });
  s.status = 'sending';
  const explorerUrl = h => `https://stellar.expert/explorer/testnet/tx/${h}`;
  try {
    // Si hubo un intento previo fallido, verificamos en Horizon si realmente entró a la red
    if (s.hash) {
      try { await server.transactions().transaction(s.hash).call(); s.status = 'done'; s.result = { ...(s.pending || {}), success: true, hash: s.hash, explorerUrl: explorerUrl(s.hash) }; return res.json(s.result); } catch (_) { /* no existe: se puede reintentar */ }
    }
    const kp = Keypair.fromSecret(s.sender.secret);
    const [sBefore, rBefore] = await Promise.all([balance(kp.publicKey()), balance(s.receiverPublicKey)]);
    if (Number(sBefore) < amt + 1) throw Object.assign(new Error('Saldo insuficiente'), { friendly: 'Saldo insuficiente.' });
    const account = await server.loadAccount(kp.publicKey());
    // Transacción real: un pago de XLM (asset nativo) firmado en el servidor
    const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
      .addOperation(Operation.payment({ destination: s.receiverPublicKey, asset: Asset.native(), amount: amt.toFixed(7) }))
      .setTimeout(60).build();
    tx.sign(kp);
    s.hash = tx.hash().toString('hex'); // guardado antes de enviar para poder verificar en reintentos
    const r = await server.submitTransaction(tx);
    const [sAfter, rAfter] = await Promise.all([balance(kp.publicKey()), balance(s.receiverPublicKey)]);
    s.status = 'done';
    s.result = { success: true, hash: r.hash, explorerUrl: explorerUrl(r.hash), senderBalanceBefore: sBefore, senderBalanceAfter: sAfter, receiverBalanceBefore: rBefore, receiverBalanceAfter: rAfter };
    res.json(s.result);
  } catch (e) {
    if (s.status !== 'done') s.status = 'ready';
    const codes = e.response?.data?.extras?.result_codes;
    console.error('tx error:', e.friendly || e.message, codes ? JSON.stringify(codes) : '');
    res.status(500).json({ error: e.friendly || (codes ? `La red rechazó la transacción: ${JSON.stringify(codes)}` : 'No se pudo enviar la transacción a Testnet.') });
  }
});

app.get('/api/session/:id/status', (req, res) => {
  const s = sessions.get(req.params.id);
  s ? res.json({ status: s.status, hash: s.hash || null }) : res.status(404).json({ error: 'no existe' });
});

app.listen(PORT, () => console.log(`Llamas Stellar en http://localhost:${PORT}`));
