require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const QRCode = require('qrcode');
const { Horizon, Keypair, StrKey, TransactionBuilder, Operation, Asset, Networks, BASE_FEE } = require('@stellar/stellar-sdk');

if ((process.env.STELLAR_NETWORK || 'testnet') !== 'testnet') { console.error('Esta demo solo corre en testnet.'); process.exit(1); }
const server = new Horizon.Server(process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org');
const FRIENDBOT = process.env.FRIENDBOT_URL || 'https://friendbot.stellar.org';
const sessions = new Map(); // sessionId -> { sender:{publicKey,secret}, status, hash, result } (en memoria)

const app = express();
app.use(express.json());
app.use(express.static('public'));

async function fund(pub) {
  const r = await fetch(`${FRIENDBOT}?addr=${encodeURIComponent(pub)}`);
  if (!r.ok && r.status !== 400) throw new Error(`Friendbot respondió ${r.status}`); // 400 = ya fondeada
}
async function balance(pub) {
  const acc = await server.loadAccount(pub);
  return acc.balances.find(b => b.asset_type === 'native').balance;
}

// Cada celular crea su propia cuenta real de Testnet. La clave secreta nunca sale del servidor.
app.post('/api/session/start', async (req, res) => {
  try {
    const kp = Keypair.random();
    await fund(kp.publicKey());
    const [bal, qr] = await Promise.all([balance(kp.publicKey()), QRCode.toDataURL(kp.publicKey(), { margin: 1, width: 300 })]);
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, { sender: { publicKey: kp.publicKey(), secret: kp.secret() }, status: 'ready' });
    res.json({ sessionId, publicKey: kp.publicKey(), balance: bal, qr });
  } catch (e) {
    console.error('start error:', e.message);
    res.status(502).json({ error: 'Friendbot u Horizon no respondieron. Intenta de nuevo.' });
  }
});

app.post('/api/transaction', async (req, res) => {
  const { sessionId, destination, amount } = req.body || {};
  const s = sessions.get(sessionId);
  if (!s) return res.status(404).json({ error: 'Sesión no encontrada. Reinicia la demo.' });
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0 || amt > 100) return res.status(400).json({ error: 'Cantidad inválida (0 < x ≤ 100).' });
  if (!StrKey.isValidEd25519PublicKey(destination || '') || destination === s.sender.publicKey) return res.status(400).json({ error: 'Destinatario inválido.' });
  if (s.status === 'done') return res.json(s.result);
  if (s.status === 'sending') return res.status(409).json({ error: 'Transacción en curso.' });
  s.status = 'sending';
  try {
    // Reintento: si un envío anterior ya entró a la red, devolvemos ese resultado en vez de duplicar
    if (s.hash && s.pending) {
      try { await server.transactions().transaction(s.hash).call(); s.status = 'done'; s.result = { ...s.pending, senderBalanceAfter: await balance(s.sender.publicKey), receiverBalanceAfter: await balance(destination) }; return res.json(s.result); } catch (_) {}
    }
    const kp = Keypair.fromSecret(s.sender.secret);
    const [sBefore, rBefore] = await Promise.all([balance(kp.publicKey()), balance(destination)]);
    if (Number(sBefore) < amt + 1) throw Object.assign(new Error('x'), { friendly: 'Saldo insuficiente.' });
    const account = await server.loadAccount(kp.publicKey());
    // Pago real de XLM, firmado en el servidor con la clave secreta del remitente
    const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
      .addOperation(Operation.payment({ destination, asset: Asset.native(), amount: amt.toFixed(7) }))
      .setTimeout(60).build();
    tx.sign(kp);
    s.hash = tx.hash().toString('hex');
    s.pending = { success: true, hash: s.hash, explorerUrl: `https://stellar.expert/explorer/testnet/tx/${s.hash}`, senderBalanceBefore: sBefore, receiverBalanceBefore: rBefore };
    await server.submitTransaction(tx);
    const [sAfter, rAfter] = await Promise.all([balance(kp.publicKey()), balance(destination)]);
    s.status = 'done'; s.result = { ...s.pending, senderBalanceAfter: sAfter, receiverBalanceAfter: rAfter };
    res.json(s.result);
  } catch (e) {
    if (s.status !== 'done') s.status = 'ready';
    const codes = e.response?.data?.extras?.result_codes;
    console.error('tx error:', e.friendly || e.message, codes ? JSON.stringify(codes) : '');
    res.status(500).json({ error: e.friendly || (codes ? `La red rechazó la transacción: ${JSON.stringify(codes)}` : 'No se pudo enviar la transacción a Testnet.') });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Llamaywan en http://localhost:${PORT}`));
