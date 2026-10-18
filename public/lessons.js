// Textos de la lección por idioma. es = completo. ay (aymara) y qu (quechua): agrega aquí las claves traducidas
// por hablantes; lo que falte se muestra en español automáticamente.
const LESSONS = {
 es: {
  pending: 'Aviso: la lección en este idioma está en construcción. Por ahora la verás en español.',
  yes: 'Sí, vamos', doubt: 'Tengo una duda', y: 'Sí', n: 'No', ready: 'LISTO', send: 'Enviar', ok: 'CONFIRMAR', cancel: 'CANCELAR', view: 'Ver en Stellar Testnet',
  m1: 'Hola. Soy {name}, tu instructora. Vamos a aprender Stellar en una sola lección. Al final harás una transferencia con otra persona en la red de pruebas. No necesitas experiencia previa. ¿Empezamos?',
  m1doubt: 'Sin problema. Esta lección dura unos 5 minutos y no usas dinero real. ¿Empezamos?',
  bye: 'Cuando quieras, aquí estaré.',
  m2a: 'Stellar es una red digital que permite enviar, recibir e intercambiar activos digitales entre cuentas.\n\nImagina que quieres enviar valor a alguien en otra ciudad. Stellar registra esa operación en una red compartida, sin que cada uno tenga su propio registro. A eso se le llama blockchain.\n\nVamos a comprobarlo.',
  m2q: '¿Para qué sirve la red Stellar?\nA) Para enviar, recibir e intercambiar activos digitales.\nB) Para almacenar fotos de WhatsApp.\nC) Para reemplazar apps de mensajería.',
  m2ok: 'Exacto.', m2bad: 'Casi. Stellar sirve para operar con activos digitales. La respuesta correcta es A.',
  m3a: 'Ahora XLM.\n\nXLM (o lumen) es el activo nativo de Stellar. Sirve, entre otras cosas, para pagar las pequeñas comisiones de las transacciones.\n\nTu cuenta tiene dos claves. La clave pública es como tu número de cuenta: se puede compartir. La clave secreta es como tu PIN: autoriza operaciones y nunca se comparte, ni por chat ni con nadie.',
  m3q: 'Si alguien te pide tu clave secreta para "enviarte XLM", ¿qué haces?\n\nA) Se la envío por WhatsApp.\nB) La publico para que me ayuden.\nC) No la comparto nunca.',
  m3ok: 'Correcto.', m3bad: 'Cuidado: la clave secreta permite autorizar operaciones sobre tu cuenta, por eso nunca se comparte. La respuesta correcta es C.',
  m4: 'Perfecto. Ahora usaremos Stellar Testnet, una red de pruebas con fondos ficticios, sin valor real.\n\nVoy a preparar tu cuenta de prueba. Dame un momento.',
  m4ready: 'Tu cuenta de prueba está lista. Cuando quieras continuar, responde:',
  scanIntro: 'Llegó el momento de la transferencia entre ustedes dos.\n\nAbajo está tu código QR: contiene tu clave pública, así que es seguro mostrarlo. Quien quiera enviar debe escanear el QR de la otra persona: arrastra ese QR hasta la zona de escaneo, como si le sacaras una foto.',
  qrLabel: 'Tu código QR\n{addr}', scanLabel: 'Zona de escaneo\nArrastra aquí el QR de la otra persona', scanOk: 'Código leído: {to}', scanBad: 'Ese QR no se puede leer ahora. Usa el QR de la otra persona cuando esté listo.',
  scanned: 'Escaneé el código de {to}',
  amount: 'Código leído. ¿Cuántos XLM de prueba quieres enviar? Recuerda que son ficticios. Máximo 100.',
  badAmount: 'Cantidad inválida. Ingresa un número positivo, máximo 100.',
  summary: 'Revisemos antes de ejecutar.\n\nResumen\nRed: Stellar Testnet\nDe: {from}\nPara: {to}\nActivo: XLM de prueba\nCantidad: {amt} XLM\n\nEsto no usa dinero real. Una vez confirmada en la red, no se puede deshacer.',
  cancelled: 'Operación cancelada. No se envió nada.',
  confirmed: 'Confirmado. Enviando a Stellar Testnet.\n\nToca el botón para ver qué pasa en la red.',
  received: 'Recibiste {amt} XLM de prueba de {from}.\n\nToca el botón para ver la transacción en la red.',
  closing: 'Transferencia completada en Stellar Testnet (simulación).\n\nAprendiste qué es Stellar, qué es XLM, por qué la clave secreta es privada y cómo se ve una transacción confirmada.\n\nGracias por aprender conmigo.'
 },
 ay: {}, // aymara: pendiente de traducción
 qu: {}  // quechua: pendiente de traducción
};
