// Textos de la lección por idioma.
// es = completo.
// ay (aymara) y qu (quechua): traducciones base para la demo.
// Pendiente: revisar con hablantes nativos de las variantes de Bolivia.
// Si falta una clave en ay o qu, se muestra la de español (ver t() en script.js).
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
    closing: 'Transferencia completada en Stellar Testnet.\n\nAprendiste qué es Stellar, qué es XLM, por qué la clave secreta es privada y cómo se ve una transacción confirmada.\n\nGracias por aprender conmigo.',
    // Claves nuevas (solo español por ahora; ay y qu caen a español hasta que las traduzcan)
    inviteBack: 'Ahora te toca a ti. Envíale XLM de prueba a la otra persona: arrastra su QR (aparece en su celular) hasta tu zona de escaneo.',
    retry: 'Reintentar', prepErr: 'No se pudo preparar la cuenta de prueba. Detalle: {err}', txErr: 'No se pudo completar la transferencia. Detalle: {err}'
  },

  // ── AYMARA ──────────────────────────────────────────────────────────────
  ay: {
    pending: 'Uñacht’awi: aka aru tuqina yatichäwi lurataskiwa. Jichhax español aru tuqin uñakipätawa.',
    yes: 'Jisa, qallantawi', doubt: 'Jiskt’awiwa', y: 'Jisa', n: 'Janiwa', ready: 'WAKISATA', send: 'Aptayaña', ok: 'CHIQANCHAYAÑA', cancel: 'APTAÑA', view: 'Stellar Testnet uñjaña',
    m1: 'Kamisaraki. Nayan sutijax {name}, yatichirima. Stellar yatichäwi mä lección tukuyana yatichätwa. Tukuyanx mä qutu markachirinakampi prueba llika tuqin aptayaña lurasma. Nayra yatichäwi jan wakisi. ¿Qallantawi?',
    m1doubt: 'Jan wakisi. Aka lecciónax phisqa minutu tuqikwa, qullqi chiqap jan apnaqkta. ¿Qallantawi?',
    bye: 'Kunjampachas munktax, akanwa.',
    m2a: 'Stellar mä llika digitalwa, kunawsatix mä cuenta tuqin mä cuenta tuqiru activo digital apayaña, katuqaña, turkasiña wakisi.\n\nUñakipam: mä markachiriru yaqha markana mä kun apayaña munktax. Stellar uka operación mä llika tuqin qillqt’i, sapa mayni jank’ak qillqt’kaspa. Ukax blockchain satawa.\n\nUñakipañäni.',
    m2q: '¿Kunatakis Stellar llika aski?\nA) Activo digital apayaña, katuqaña, turkasiñataki.\nB) WhatsApp foto imañataki.\nC) Mensajería app turkasiñataki.',
    m2ok: 'Chiqpachawa.', m2bad: 'Jani chiqpachax. Stellar activo digital apnaqañatakiwa. Chiqapa jaysawix A.',
    m3a: 'Jichhax XLM.\n\nXLM (lumen satan) Stellar llika activo nativo. Ukanakax transacción comisión jisk’a apnaqañataki.\n\nCuentamax pä llaveyuwa. Llave pública ukhax cuenta numeromawa: yaqhanakampi apnaqaspa. Llave secreta ukhax PINjamawa: operación chiqanchayaña, jani kunampis apnaqaspa, jan chat tuqis.',
    m3q: 'Kunawsatix mä jaqi “XLM apayañataki” sasina llave secreta munt’amax, ¿kamsna?\n\nA) WhatsApp tuqin apayanisma.\nB) Yaqhanakax yanapt’apxañapataki uñacht’ayasma.\nC) Jan kunampis apnaqkasma.',
    m3ok: 'Chiqpachawa.', m3bad: 'Uñakipam: llave secreta ukhax cuenta operación chiqanchayaña, ukat jan apnaqkaspa. Chiqapa jaysawix C.',
    m4: 'Waliki. Jichhax Stellar Testnet apnaqañäni, mä prueba llika, qullqi jan chiqap, jan chanini.\n\nCuenta prueba wakicht’äma. Juk’a suyt’am.',
    m4ready: 'Cuenta prueba wakicht’atawa. Kunawsatix qallantañ muntax, aru qillqt’am:',
    scanIntro: 'Jichhaw pär markachirinakampi aptayañ pachawa.\n\nAkan QR códigomawa: llave públicamampi, ukat uñacht’ayañax askiwa. Khitis apayaña muntax, yaqha markachir QR escanearpa: uka QR escaneo tuqiru jitht’am, fotojam.',
    qrLabel: 'QR códigom\n{addr}', scanLabel: 'Escanear tuqi\nAkan yaqha markachir QR jitht’am', scanOk: 'Código ullt’ata: {to}', scanBad: 'Uka QR jichhax jan ullt’añax wakisi. Yaqha markachir QR apnaqam.',
    scanned: '{to} código escaneé',
    amount: 'Código ullt’ata. ¿Qhawqha XLM prueba apayaña muntax? Jan chiqap, jan chanini. Juk’a 100.',
    badAmount: 'Cantidad jan walika. Mä número positivo, juk’a 100 apayam.',
    summary: 'Uñakipañäni jan apnaqañataki.\n\nResumen\nLlika: Stellar Testnet\nKutt’ani: {from}\nKatuqiri: {to}\nActivo: XLM prueba\nCantidad: {amt} XLM\n\nAka jan chiqap qullqi apnaqkiti. Mä kuti llika tuqin chiqanchayata, jan kutt’ayañax wakisi.',
    cancelled: 'Operación aptata. Jan kun apayatati.',
    confirmed: 'Chiqanchayata. Stellar Testnet tuqiru apayataski.\n\nBotón limt’am llika tuqin kun pasaspa uñjañataki.',
    received: '{amt} XLM prueba katuqta {from} tuqin.\n\nBotón limt’am transacción llika tuqin uñjañataki.',
    closing: 'Stellar Testnet tuqin transferencia tukuyata.\n\nStellar kuna, XLM kuna, llave secreta kuna, transacción chiqanchayata uñjaña yatichäta.\n\nYuspagaräma yatichäwimampi.'
  },

  // ── QUECHUA ─────────────────────────────────────────────────────────────
  qu: {
    pending: 'Willakuy: kay simipi lección ruwakushan. Kunanqa español simipi qhawanki.',
    yes: 'Arí, qallarisun', doubt: 'Tapukuy kan', y: 'Arí', n: 'Manan', ready: 'WAKICHISQA', send: 'Kachay', ok: 'Takyachiy', cancel: 'Sayachiy', view: 'Stellar Testnet qhaway',
    m1: 'Allillanchu. Ñuqa {name}, yachachiqniyki. Stellar yachayta huk lecciónpi yachachisqayki. Tukuytaq huk runawan prueba llika pi transferenciata ruwanki. Manan ñawpa yachayta munanchu. ¿Qallarisun?',
    m1doubt: 'Manan sasachu. Kay lecciónqa phisqa minutu, manan qullqita apaykanki. ¿Qallarisun?',
    bye: 'Maypachachus munanki, kaypi kasaq.',
    m2a: 'Stellar huk llika digital, cuenta-cuentapi activo digital kachay, chaskiy, turkay atikun.\n\nYuyaychakuy: huk runaman huk llaqtapi imatapas kachayta munanki. Stellar chay ruwayta huk llika pi qillqan, sapa runa mana qillqanankupaq. Chayta blockchain ninchik.\n\nQhawarisun.',
    m2q: '¿Imapaq Stellar llika allin?\nA) Activo digital kachay, chaskiy, turkaypaq.\nB) WhatsApp fotokunata waqaychaypaq.\nC) Mensajería appkunata turkaypaq.',
    m2ok: 'Allinmi.', m2bad: 'Manan allinchu. Stellar activo digital apaypaqmi. Allin kutichiyqa A.',
    m3a: 'Kunanqa XLM.\n\nXLM (lumen nisqa) Stellar llika activo nativo. Transacción comisión uchuyta apaypaq.\n\nCuentaykipi iskay llave kan. Llave pública cuentan yupay hina: runakunawan qunakuy atikun. Llave secreta PIN hina: ruwaykunata takyachin, manan pipas qunakunchu, ni chat pi.',
    m3q: 'Pipas “XLM kachaypaq” nispa llave secretaykita mañakusunki, ¿imata ruwanki?\n\nA) WhatsApp pi kachayman.\nB) Runakuna yanapawanankupaq willarman.\nC) Manan pipas qunaymanchu.',
    m3ok: 'Allinmi.', m3bad: 'Yuyaychakuy: llave secreta ruwaykunata takyachin, chayrayku manan qunakunchu. Allin kutichiyqa C.',
    m4: 'Allinmi. Kunanqa Stellar Testnet apaykusun, huk prueba llika, mana chiqap qullqi, mana chaninniyuq.\n\nPrueba cuentaykita wakichisaq. Huk ratulla suyay.',
    m4ready: 'Prueba cuentayki wakichisqaña. Maypachachus qallariyta munanki, kayta kutichiy:',
    scanIntro: 'Kunanqa iskay runakuna transferenciata ruwanankupaq pacha.\n\nKaypi QR códigoyki: llave públicayki, chayrayku qhaway allinmi. Pipas kachayta munaspa, huk runap QR-ninta escanearichun: chay QR escaneo sitioman astay, foto hina.',
    qrLabel: 'QR códigoyki\n{addr}', scanLabel: 'Escanear sitiu\nKaypi huk runap QR-ninta astay', scanOk: 'Código ñawinchasqa: {to}', scanBad: 'Chay QR kunanqa mana ñawinchanachu. Huk runap QR-ninta apaykuy.',
    scanned: '{to} código escaneerqani',
    amount: 'Código ñawinchasqa. ¿Hayk’a XLM prueba kachayta munanki? Manan chiqapchu, mana chaninniyuqchu. Aswan 100.',
    badAmount: 'Cantidad mana allinchu. Huk número positivo, aswan 100 kachaykuy.',
    summary: 'Qhawarisun manaraq apaykuspa.\n\nResumen\nLlika: Stellar Testnet\nKachaq: {from}\nChaskaq: {to}\nActivo: XLM prueba\nCantidad: {amt} XLM\n\nKayqa manan chiqap qullqita apaychu. Huk kuti llika pi takyachisqa, manan kutichiyta atikunchu.',
    cancelled: 'Ruway sayachisqa. Manan imatapas kachasqachu.',
    confirmed: 'Takyachisqa. Stellar Testnetman kachashan.\n\nBotónta ñitiy llika pi ima pasasqanta qhawanaykipaq.',
    received: '{amt} XLM prueba chaskirqanki {from}manta.\n\nBotónta ñitiy transacción llika pi qhawanaykipaq.',
    closing: 'Stellar Testnet pi transferencia tukusqa.\n\nStellar ima, XLM ima, llave secreta ima, transacción takyachisqa qhaway ima yacharqanki.\n\nAñay yachaywan.'
  }
};
