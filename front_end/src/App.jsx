import { useEffect, useState } from 'react'
import { Link, Routes, Route, useParams } from 'react-router-dom'
import './App.css'
import PokemonCard from './PokemonCard.jsx';
import PokemonTrait from './PokemonTrait.jsx'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a learning project as part of the WDB's Developer Bootcamp.</p>
    </div>
  )
}

function ErrorPage(){
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  )
}

function FavoritePage(){
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pokemon/favorites`)
        const data = await res.json()
        setFavorites(data.favorites || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchFavorites()
  }, [])

  return (
    <div className = "pokemon-grid">
      {favorites.map((p) => (
        <Link key={p.pokemon_id} to={`/pokemon/${p.pokemon_id}`}>
          <PokemonCard sprite={p.sprite} name={p.name}/>
        </Link>
      ))}
    </div>
  )
}

function PokemonPage(){
  const [pokemon, setPokemon] = useState([])
  const [favoriteIds, setFavoriteIds] = useState([])

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pokemon`)
        const data = await res.json()
        setPokemon(data.list || [])
      } catch (err) {
        console.error(err)
      }
    }
    fetchPokemon()
  }, [])

  useEffect(() => {
    async function fetchFavoriteIds() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pokemon/favorites`)
        const data = await res.json()
        const ids = (data.favorites || []).map((f) => Number(f.pokemon_id))
        setFavoriteIds(ids)
      } catch (err) {
        console.error(err)
      }
    }
    fetchFavoriteIds()
  }, [])

  async function toggleFavorite(p, e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      const pokemonId = Number(p.id)
      const isFav = favoriteIds.includes(pokemonId)
      const res = isFav
        ? await fetch(`${API_BASE_URL}/api/pokemon/favorites/${pokemonId}`, { method: "DELETE" })
        : await fetch(`${API_BASE_URL}/api/pokemon/favorites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pokemon_id: pokemonId
            })
          })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Failed to toggle favorite (${res.status})`)
      }
      setFavoriteIds((prev) =>
        isFav ? prev.filter((id) => id !== pokemonId) : [...new Set([...prev, pokemonId])]
      )
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className = "pokemon-grid">
      {pokemon.map(p => (
        <div key={p.id} className="pokemon-item">
          <Link to={`/pokemon/${p.id}`}>
            <PokemonCard sprite={p.sprite} name={p.name}/>
          </Link>
          <button
            className={`favorite-star ${favoriteIds.includes(Number(p.id)) ? "favorite" : ""}`}
            onClick={(e) => toggleFavorite(p, e)}
            aria-label="Add to favorites"
          >
            {favoriteIds.includes(Number(p.id)) ? "\u2605" : "\u2606"}
          </button>
        </div>
      ))}
    </div>
  )
}

function PokemonDetailPage(){
  const { id } = useParams()
  const [pokemonDetails, setPokemonDetails] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    async function fetchPokemonDetails() {
      const res = await fetch(`${API_BASE_URL}/api/pokemon/${id}`)
      const data = await res.json()
      setPokemonDetails(data)
    }
    fetchPokemonDetails()
  }, [id])

  useEffect(() => {
    async function fetchFavoriteStatus() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pokemon/favorites`)
        const data = await res.json()
        const ids = (data.favorites || []).map((f) => Number(f.pokemon_id))
        setIsFavorite(ids.includes(Number(id)))
      } catch (err) {
        console.error(err)
      }
    }
    fetchFavoriteStatus()
  }, [id])

  async function toggleDetailFavorite() {
    if (!pokemonDetails) return
    try {
      const pokemonId = Number(pokemonDetails.id)
      const res = isFavorite
        ? await fetch(`${API_BASE_URL}/api/pokemon/favorites/${pokemonId}`, { method: "DELETE" })
        : await fetch(`${API_BASE_URL}/api/pokemon/favorites`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              pokemon_id: pokemonId
            })
          })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.detail || errorData.message || `Failed to toggle favorite (${res.status})`)
      }
      setIsFavorite((prev) => !prev)
    } catch (err) {
      console.error(err)
    }
  }

    if (!pokemonDetails) return <p>Loading...</p>

  return (
    <div>
    <div>
      <div className="detail-header">
        <h1>Pokemon Details</h1>
        <button
          className={`favorite-star detail-favorite-star ${isFavorite ? "favorite" : ""}`}
          onClick={toggleDetailFavorite}
          aria-label="Toggle favorite"
        >
          {isFavorite ? "\u2605" : "\u2606"}
        </button>
      </div>
      <PokemonTrait 
        key={pokemonDetails.id}
        name={pokemonDetails.name}
        sprite={pokemonDetails.sprite}
        height={pokemonDetails.height}
        weight={pokemonDetails.weight}
        stats={pokemonDetails.stats}/>
    </div>
    </div>
  );
}
function Home(){
  return (
    <>
    <div>
    <h1>Home</h1>
    <p>Welcome to PokeDex!</p>
    </div></>
  )
}
function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: 12 }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/pokemon">Pokemon</Link>
        <Link to="/favorites">Favorites</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/pokemon" element={<PokemonPage />} />
        <Route path="/favorites" element={<FavoritePage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
