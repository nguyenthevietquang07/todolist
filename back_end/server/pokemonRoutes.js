const express = require('express');
const router = express.Router();
const supabase = require('../supabase');

function formatPokemon(data) {
  return {
    id: data.id,
    name: data.name,
    sprite:
      data.sprites?.other?.["official-artwork"]?.front_default ??
      data.sprites?.front_default ??
      null,
  };
}

async function fetchPokemonById(id) {
  const apiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!apiResponse.ok) {
    throw new Error(`PokeAPI request failed for pokemon ${id}`);
  }

  const data = await apiResponse.json();
  return formatPokemon(data);
}

function getPokemonIdFromBody(body) {
  return Number(body?.pokemon_id ?? body?.pokemonId ?? body?.id);
}

router.get('/', async (req, res) => {
  try {
  const apiResponse = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
  if (!apiResponse.ok) throw new Error('PokeAPI request failed');
  const data = await apiResponse.json()

  const responses = await Promise.all(data.results.map(p => fetch(p.url)))
  const pic = await Promise.all(responses.map(p => p.json()))
  const list = pic.map(formatPokemon)
  res.json({ list });

} catch (err) {
  console.error(err)  
  res.status(500).json({ message: 'Something went wrong' });
    }
  });

router.get('/favorites', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id, pokemon_id')
      .order('id', { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to fetch favorites' });
    }

    const favorites = await Promise.all(
      (data || []).map(async (favorite) => {
        const pokemon = await fetchPokemonById(favorite.pokemon_id);
        return {
          id: favorite.id,
          pokemon_id: favorite.pokemon_id,
          name: pokemon.name,
          sprite: pokemon.sprite,
        };
      })
    );

    res.json({ favorites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/favorites', async (req, res) => {
  try {
    const pokemonId = getPokemonIdFromBody(req.body);

    if (!pokemonId) {
      return res.status(400).json({ message: 'pokemon_id is required' });
    }

    const { data: exists, error: existsError } = await supabase
      .from('favorites')
      .select('id')
      .eq('pokemon_id', pokemonId)
      .limit(1);

    if (existsError) {
      console.error(existsError);
      return res.status(500).json({
        message: 'Failed to check existing favorite',
        detail: existsError.message,
      });
    }

    if (exists && exists.length > 0) {
      return res.status(200).json({ message: 'Already favorited' });
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([{ pokemon_id: pokemonId }]);

    if (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Failed to save favorite',
        detail: error.message,
      });
    }

    res.status(201).json({ pokemon_id: pokemonId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.delete('/favorites/:pokemonId', async (req, res) => {
  try {
    const pokemonId = Number(req.params.pokemonId);
    if (!pokemonId) {
      return res.status(400).json({ message: 'Invalid pokemon id' });
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('pokemon_id', pokemonId);

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to remove favorite' });
    }

    res.status(200).json({ message: 'Removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.get('/:id', async (req, res) => {
  
  try {
    const { id } = req.params;
    const apiResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!apiResponse.ok) {
      return res.status(apiResponse.status).json({ message: 'Pokemon not found' });
    }
    const data = await apiResponse.json();
    const wantedStats = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"];
    const filteredStats = (data.stats || []).filter(s => wantedStats.includes(s.stat.name));
  
    const traits = {
      id: data.id,
      sprite:
      data.sprites?.other?.["official-artwork"]?.front_default ??
      data.sprites?.front_default ??
      null,
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
