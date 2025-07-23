const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/buscar', require('./routes/buscar'));

// En producción sirve el frontend estático
if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '../frontend/dist');
  app.use(express.static(dist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(dist, 'index.html'));
  });
}

app.listen(process.env.PORT || 4000, () => {
  console.log('Servidor corriendo en puerto', process.env.PORT || 4000);
});
