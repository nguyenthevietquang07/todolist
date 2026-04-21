import { useEffect, useState } from 'react'
import { Link, Routes, Route, useParams } from 'react-router-dom'
import './App.css'
import { initialTasks } from "./data.jsx";
import ToDoList from "./ToDoList.jsx";
import PokemonCard from './PokemonCard.jsx';
import PokemonTrait from './PokemonTrait.jsx'

function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is a learning project as part of the WDB's Developer Bootcamp.</p>
    </div>
  )
}

// function ToDoPage() {
//   const [tasks, setTasks] = useState(initialTasks);
//   const [content, setContent] = useState("");

//   function addTask(content){
//     const newId = Math.max(...tasks.map(t=>t.id)) + 1;
//     const newTask = {id: newId, task: content, completed: false };
//     setTasks([...tasks, newTask]);
//     setContent("");
//   }

//   function updateTask(key){
//     setTasks(tasks.map(t => t.id === key ?  { ...t, completed: !t.completed} : t));
//   }

//   return (
    
//     <div>
//     <h1> To do list </h1> 
//     {/* {tasks.map(task => (<div key={task.id}> {task.task} {String(task.completed)} <button onClick={()=>updateTask(task.id)}>Mark as Done</button>
// </div>))} */}
//     {tasks.map(task => (
//       <ToDoList key={task.id}
//         {...task}
//         onToggle={updateTask}
//       />
//     ))}
//     <form onSubmit={(e)=>{e.preventDefault(); addTask(content)}}>
//       <input value={content} onChange={(e) => setContent(e.target.value)}/>
//       <button type="submit">Add Task</button>
//     </form>
//         </div>

//       )
// }

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
        const res = await fetch("http://localhost:3001/api/pokemon/favorites")
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
        const res = await fetch("http://localhost:3001/api/pokemon")
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
        const res = await fetch("http://localhost:3001/api/pokemon/favorites")
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
        ? await fetch(`http://localhost:3001/api/pokemon/favorites/${pokemonId}`, { method: "DELETE" })
        : await fetch("http://localhost:3001/api/pokemon/favorites", {
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
            {favoriteIds.includes(Number(p.id)) ? "★" : "☆"}
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
      const res = await fetch(`http://localhost:3001/api/pokemon/${id}`)
      const data = await res.json()
      setPokemonDetails(data)
    }
    fetchPokemonDetails()
  }, [id])

  useEffect(() => {
    async function fetchFavoriteStatus() {
      try {
        const res = await fetch("http://localhost:3001/api/pokemon/favorites")
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
        ? await fetch(`http://localhost:3001/api/pokemon/favorites/${pokemonId}`, { method: "DELETE" })
        : await fetch("http://localhost:3001/api/pokemon/favorites", {
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
          {isFavorite ? "★" : "☆"}
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
        {/* <Route path="/" element={<ToDoPage />} /> */}
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
