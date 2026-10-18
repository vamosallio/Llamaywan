# Llamaywan — demo educativa (simulada)

Dos celulares en pantalla, cada uno con la lección guiada por una llama (Lumi/español, Wara/aymara, Quyllur/quechua).
Al final, una persona arrastra el QR de la otra hasta su zona de escaneo y se simula la transferencia; el botón
"Ver en Stellar Testnet" abre el panel azul.

Requisitos: Node 18+. `npm install && npm start` y abrir http://localhost:3000. Pensada para pantalla de PC.

## Qué es simulado
Todo: cuentas, QR (no es escaneable), saldos, hash y confirmación. No hay conexión con Stellar.
## Idiomas
Textos en `public/lessons.js`. Solo español está completo; completa `ay` y `qu` (lo que falte cae a español).
## Stickers
`public/img/stickers/<llama>/{intro,explain,chart,normal,hola}.png`
