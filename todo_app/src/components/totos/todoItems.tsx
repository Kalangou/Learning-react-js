import { Trash } from 'lucide-react';

type Priority = 'Urgente' | 'Moyenne' | 'Basse';

type Todo = {
  id: number;
  title: string;
  prority: Priority;
}

type Props = {
    todo: Todo;
    onDelete: () => void;
    isSelected?: boolean;
    onSelect?: (id: number) => void;
}

const TodoItems = ({ todo, onDelete, isSelected, onSelect } : Props) => {
    return (
        <li key={todo.id} className="card bg-base-200">
            <div className="card-body flex flex-row justify-between items-center">
                <input 
                    type="checkbox" 
                    className='checkbox checkbox-primary checkbox-sm' 
                    checked={isSelected} 
                    onChange={() => onSelect && onSelect(todo.id)}
                />

                <h2 className="card-title">{todo.title}</h2>

                <div className={`badge badge-sm badge-soft ${todo.prority === 'Urgente' ? 'badge-error' : todo.prority === 'Moyenne' ? 'badge-warning' : 'badge-success'}`}>
                {todo.prority}
                </div>

                <button onClick={onDelete} className='btn btn-sm btn-error btn-soft btn-circle' title='Supprimer'>
                    <Trash className='w-4 h-4'/>
                </button>
            </div>
        </li>
    )
}

export default TodoItems