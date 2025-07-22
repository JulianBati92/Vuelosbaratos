const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/buscar', require('./routes/buscar'));

app.listen(process.env.PORT || 4000, () => {
  console.log('Servidor corriendo en puerto', process.env.PORT || 4000);
});
