# Llamaywan — demo educativa (Stellar Testnet)

Dos celulares en pantalla con la lección (Lumi/es, Wara/ay, Quyllur/qu). Al final se hace una transferencia REAL en Stellar Testnet
(fondos ficticios) entre las dos cuentas: se arrastra el QR de una persona a la zona de escaneo de la otra. Luego se invita a devolver el envío.

Requisitos: Node 18+ e internet. `npm install && npm start`, abrir http://localhost:3000 (en Codespaces, el puerto 3000 que se reenvía).
Plan B sin internet: http://localhost:3000/?sim=1 (todo simulado y rotulado como tal).

Cada celular crea su cuenta con Friendbot al terminar la parte de XLM. Las claves secretas nunca salen del servidor.
Limitaciones: Testnet puede reiniciarse; sesiones en memoria; una transacción por celular. Textos en `public/lessons.js`.
