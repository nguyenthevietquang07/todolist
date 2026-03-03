import { useState } from 'react'
import './App.css'
import { initialTasks } from "./data.jsx";
import ToDoList from "./ToDoList.jsx";

function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [content, setContent] = useState("");

  function addTask(content){
    const newId = Math.max(...tasks.map(t=>t.id)) + 1;
    const newTask = {id: newId, task: content, completed: false };
    setTasks([...tasks, newTask]);
    setContent("");
  }

  function updateTask(key){
    setTasks(tasks.map(t => t.id === key ?  { ...t, completed: !t.completed} : t));
  }

  return (
    <div>
    <h1> To do list </h1> 
    {/* {tasks.map(task => (<div key={task.id}> {task.task} {String(task.completed)} <button onClick={()=>updateTask(task.id)}>Mark as Done</button>
</div>))} */}
{tasks.map(task => (
  <ToDoList key={task.id}
    {...task}
    onToggle={updateTask}
  />
))}
<form onSubmit={(e)=>{e.preventDefault(); addTask(content)}}>
  <input value={content} onChange={(e) => setContent(e.target.value)}/>
  <button type="submit">Add Task</button>
</form>
    </div>

  )
  

}
export default App;
