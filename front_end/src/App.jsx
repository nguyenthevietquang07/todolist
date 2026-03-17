import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Routes, Route, useParams } from 'react-router-dom'
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

function PokemonPage(){
  const [pokemon, setPokemon] = useState([])

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

  return (
    <div className = "pokemon-grid">
      {pokemon.map(p => 
      <Link key={p.id} to={`/pokemon/${p.id}`}>
      <PokemonCard sprite={p.sprite} name={p.name}/>
      </Link>)}
    </div>
  )
}

function PokemonDetailPage(){
  const { id } = useParams()
  const [pokemonDetails, setPokemonDetails] = useState(null)

  useEffect(() => {
    async function fetchPokemonDetails() {
      const res = await fetch(`http://localhost:3001/api/pokemon/${id}`)
      const data = await res.json()
      setPokemonDetails(data)
    }
    fetchPokemonDetails()
  }, [id])
    if (!pokemonDetails) return <p>Loading...</p>

  return (
    <div>
    <div>
      <h1>Pokemon Details</h1>
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
      </nav>

      <Routes>
        {/* <Route path="/" element={<ToDoPage />} /> */}
        <Route path="/" element={<Home/>}></Route>
        <Route path="/about" element={<About />} />
        <Route path="/pokemon" element={<PokemonPage />} />
        <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
