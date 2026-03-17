const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
  const apiResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
  const data = await apiResponse.json()

  const responses = await Promise.all(data.results.map(p => fetch(p.url)))
  const pic = await Promise.all(responses.map(p => p.json()))
  const list = pic.map(p => ({"id": p.id, "name" : p.name, "sprite": p.sprites.other["official-artwork"].front_default}))
  res.json({ list });

} catch (err) {
  console.error(err)  
  res.status(500).json({ message: 'Something went wrong' });
    }
  });

router.get('/:id', async (req, res) => {
  
  try {
    const { id } = req.params;
    const apiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await apiResponse.json();
    const wantedStats = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
    const filteredStats = (data.stats || []).filter(s => wantedStats.includes(s.stat.name));
  
    const traits = {
      id: data.id,
      sprite:
      data.sprites.other["official-artwork"].front_default,
      name: data.name,
      height: data.height,
      weight: data.weight,
      stats: filteredStats.map(s => ({ name: s.stat.name, base: s.base_stat }))
    };

    res.json(traits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});
module.exports = router;

