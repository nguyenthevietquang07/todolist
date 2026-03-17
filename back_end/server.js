const express = require('express');
const cors = require('cors');
const pokemonRoutes = require('./server/pokemonRoutes.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.use("/api/pokemon", pokemonRoutes);

app.use("/api/pokemon/:id", pokemonRoutes);

// Tells your backend to be listening to this PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});