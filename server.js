// Demo 100% visual: solo sirve archivos estáticos. No usa red ni claves reales.
const express = require('express');
const app = express();
app.use(express.static('public'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Llamaywan en http://localhost:${PORT}`));
