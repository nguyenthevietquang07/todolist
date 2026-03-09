export default function ToDoList({ id, task, completed, onToggle }) {
  return (
    <div className="card">
      <input type="checkbox" checked={completed} onChange={()=>onToggle(id)}/>
      <span className={completed ? "completed" : ""}> {task} </span>
      </div>
  );
}
