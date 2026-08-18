import React, { useState } from 'react';
import { ListTodo, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';
import './TodoList.css';

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Review pull requests', completed: true },
    { id: 2, text: 'Design new landing page', completed: false },
    { id: 3, text: 'Update dependencies', completed: false },
  ]);
  const [inputValue, setInputValue] = useState('');

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  };

  return (
    <div className="todo-container glass-panel">
      <div className="todo-header">
        <ListTodo size={20} className="text-gradient" />
        <h2>Tasks</h2>
      </div>

      <form className="add-todo-form" onSubmit={addTodo}>
        <input 
          type="text" 
          placeholder="Add a new task..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="todo-input"
        />
        <button type="submit" className="add-btn">
          <Plus size={18} />
        </button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <button className="check-btn" onClick={() => toggleTodo(todo.id)}>
              {todo.completed ? <CheckCircle2 size={18} className="icon-completed" /> : <Circle size={18} className="icon-pending" />}
            </button>
            <span className="todo-text">{todo.text}</span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              <Trash2 size={16} />
            </button>
          </li>
        ))}
        {todos.length === 0 && (
          <li className="empty-state">No tasks for today. You're all caught up!</li>
        )}
      </ul>
    </div>
  );
};

export default TodoList;
