# Llamas Stellar — demo educativa (Stellar Testnet)

Lección tipo chat guiada por la llama Lumi + una transferencia **real** en Stellar Testnet mostrada en un segundo celular. Fondos ficticios.

## Uso
Requisitos: Node 18+.
```
npm install && npm start
```
Abrir http://localhost:3000. Opcional: copiar `.env.example` a `.env` (el servidor arranca sin él).

## Probar el flujo
Elegir Lumi → responder A, C → LISTO → SÍ → cantidad (ej. 5) → CONFIRMAR. Aparece el celular B con el hash.
Verificar: abrir "Ver en explorador" o pegar el hash en https://stellar.expert/explorer/testnet

## Limitaciones
- Testnet puede reiniciarse (cuentas y hashes desaparecen) y Friendbot puede fallar o ir lento.
- Sesiones en memoria: si reinicias el servidor se pierden.
- Una transacción por sesión; los reintentos verifican primero en Horizon.
- Wara y Quyllur son solo selector (lección "próximamente").
- Las claves secretas nunca salen del servidor. Es solo una demo, no es un producto.
