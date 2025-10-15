import { useEffect, useState } from "react";
import TodoItems from "./components/totos/todoItems";
import { Construction } from "lucide-react";

type Priority = 'Urgente' | 'Moyenne' | 'Basse';

type Todo = {
  id: number;
  title: string;
  prority: Priority;
}

function App() {

  const [input, setInput] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  
  const savedTodos = localStorage.getItem("todos");
  const initialTodos: Todo[] = savedTodos ? JSON.parse(savedTodos) : [];
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [filter, setFilter] = useState<Priority | "Tous">("Tous");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if(input === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      title: input.trim(),
      prority: priority
    }
    // Ajout au début du tableau
    const newTodos = [newTodo, ...todos];
    setTodos(newTodos);
    setInput("");
    setPriority("Moyenne");
    console.log(newTodos );
  }

  let filteredTodos: Todo[] = [];

  if(filter === "Tous") {
    filteredTodos = todos;
  } else {
    filteredTodos = todos.filter((todo) => todo.prority === filter);
  }

  const urgentCount = todos.filter((todo) => todo.prority === "Urgente").length;
  const moyenneCount = todos.filter((todo) => todo.prority === "Moyenne").length;
  const basseCount = todos.filter((todo) => todo.prority === "Basse").length; 
  const totalCount = todos.length;

  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());

  function toggleSelectTodo(id: number) {
    const newSelectedTodos = new Set(selectedTodos);
    if(newSelectedTodos.has(id)) {
      newSelectedTodos.delete(id);
    } else {
      newSelectedTodos.add(id);
    }
    setSelectedTodos(newSelectedTodos);
  }

  function finishSelection() {
    const newTodos = todos.filter((todo) => !selectedTodos.has(todo.id));
    setTodos(newTodos);
    setSelectedTodos(new Set());
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-5 bg-base-300 p-5 rounded-2xl">
        <div className="flex gap-4">
          <input 
            type="text" 
            className="input w-full"
            placeholder="Ajouter une tâche ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <select className="select w-full" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option disabled selected>Priorité</option>
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>

          <button onClick={addTodo} className="btn btn-primary">Ajouter</button>
        </div>

        <div className="space-y-2 flex-1 h-fit">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <button className={`btn btn-soft ${filter === 'Tous' ? 'btn-primary': ""}`} onClick={() => setFilter("Tous")} >
                Tous ({totalCount})
              </button>

              <button className={`btn btn-soft ${filter === 'Urgente' ? 'btn-error': ""}`} onClick={() => setFilter("Urgente")} >
                Urgente ({urgentCount})
              </button>
              
              <button className={`btn btn-soft ${filter === 'Moyenne' ? 'btn-warning': ""}`} onClick={() => setFilter("Moyenne")} >
                Moyenne ({moyenneCount})
              </button>

              <button className={`btn btn-soft ${filter === 'Basse' ? 'btn-success': ""}`} onClick={() => setFilter("Basse")} >
                Basse ({basseCount})
              </button>
            </div>
            <button 
              className="btn btn-primary"
              disabled={selectedTodos.size === 0}
              onClick={() => finishSelection()}
            >
              Finir la sèlection ({selectedTodos.size}) 
            </button>
          </div>
        </div>

        {filteredTodos.length === 0 ? (
          <div className="flex justify-center items-center flex-col p-5">
            <div>
              <Construction strokeWidth={1} className="w-40 h-40 text-primary" />
            </div>
            <p className="text-sm">Aucune tâche trouvèe...</p>
          </div>
        ) : (
          <ul className="space-y-2 divide-y divide-primary/20">
            {filteredTodos.map((todo) => (
              <li key={todo.id} className="card bg-base-200">
                <TodoItems 
                  todo={todo} 
                  onDelete={() => deleteTodo(todo.id)} 
                  isSelected={selectedTodos.has(todo.id)}
                  onSelect={toggleSelectTodo}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
