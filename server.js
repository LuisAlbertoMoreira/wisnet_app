const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let trabajos = [];

app.get('/trabajos', (req, res) => {
  res.json(trabajos);
});

app.post('/trabajos', (req, res) => {
  const trabajo = req.body;
  trabajos.push(trabajo);
  res.json({ message: 'Trabajo agregado', trabajo });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});