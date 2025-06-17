import React, { useState, useEffect } from 'react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todoTitle, setTodoTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTodoId, setEditingTodoId] = useState(null);

  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('savedProjects')) || [];
    const savedTodos = JSON.parse(localStorage.getItem('savedProjectTodos')) || [];
    setProjects(savedProjects);
    setTodos(savedTodos);
  }, []);

  // Convert number to Roman numeral
  const toRoman = (num) => {
    const romanNumerals = [
      { value: 1000, numeral: 'M' },
      { value: 900, numeral: 'CM' },
      { value: 500, numeral: 'D' },
      { value: 400, numeral: 'CD' },
      { value: 100, numeral: 'C' },
      { value: 90, numeral: 'XC' },
      { value: 50, numeral: 'L' },
      { value: 40, numeral: 'XL' },
      { value: 10, numeral: 'X' },
      { value: 9, numeral: 'IX' },
      { value: 5, numeral: 'V' },
      { value: 4, numeral: 'IV' },
      { value: 1, numeral: 'I' }
    ];
    
    let result = '';
    let remaining = num;
    
    for (let i = 0; i < romanNumerals.length; i++) {
      while (remaining >= romanNumerals[i].value) {
        result += romanNumerals[i].numeral;
        remaining -= romanNumerals[i].value;
      }
    }
    
    return result;
  };

  const handleSave = () => {
    if (title && description) {
      if (editingId) {
        // Update existing project
        const updatedProjects = projects.map(project => 
          project.id === editingId ? 
          { ...project, title, description, lastEdited: new Date().toLocaleString() } : 
          project
        );
        setProjects(updatedProjects);
        localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
        setEditingId(null);
      } else {
        // Create new project
        const newProject = {
          id: Date.now(),
          title,
          description,
          date: new Date().toLocaleString(),
          lastEdited: new Date().toLocaleString()
        };
        
        const updatedProjects = [...projects, newProject];
        setProjects(updatedProjects);
        localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
      }
      
      setTitle('');
      setDescription('');
    }
  };

  const handleSaveTodo = () => {
    if (todoTitle) {
      if (editingTodoId) {
        // Update existing todo
        const updatedTodos = todos.map(todo => 
          todo.id === editingTodoId ? 
          { ...todo, title: todoTitle, lastEdited: new Date().toLocaleString() } : 
          todo
        );
        setTodos(updatedTodos);
        localStorage.setItem('savedProjectTodos', JSON.stringify(updatedTodos));
        setEditingTodoId(null);
      } else {
        // Create new todo
        const newTodo = {
          id: Date.now(),
          title: todoTitle,
          completed: false,
          date: new Date().toLocaleString(),
          lastEdited: new Date().toLocaleString()
        };
        
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        localStorage.setItem('savedProjectTodos', JSON.stringify(updatedTodos));
      }
      
      setTodoTitle('');
    }
  };

  const handleEdit = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setEditingId(project.id);
  };

  const handleEditTodo = (todo) => {
    setTodoTitle(todo.title);
    setEditingTodoId(todo.id);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setEditingId(null);
  };

  const handleCancelTodo = () => {
    setTodoTitle('');
    setEditingTodoId(null);
  };

  const handleDelete = (id) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('savedProjects', JSON.stringify(updatedProjects));
    
    if (editingId === id) {
      setTitle('');
      setDescription('');
      setEditingId(null);
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('savedProjectTodos', JSON.stringify(updatedTodos));
    
    if (editingTodoId === id) {
      setTodoTitle('');
      setEditingTodoId(null);
    }
  };

  const toggleTodoComplete = (id) => {
    const updatedTodos = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem('savedProjectTodos', JSON.stringify(updatedTodos));
  };

  return (
    <div className="page-container">
      <h2>Project Ideas</h2>
      
      <div className="project-form">
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
        />
        <div className="button-group">
          <button onClick={handleSave}>
            {editingId ? 'Update Project' : 'Save Project'}
          </button>
          {editingId && (
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <div className="item-list">
        <h3>Your Project Ideas</h3>
        <table className="project-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">No project ideas saved yet</td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr key={project.id} className={editingId === project.id ? "editing-row" : ""}>
                  <td className="roman-numeral">{toRoman(index + 1)}</td>
                  <td>{project.title}</td>
                  <td className="description-cell">
                    {project.description.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </td>
                  <td>{project.date}</td>
                  <td>
                    <div className="button-group">
                      <button onClick={() => handleEdit(project)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(project.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Project To-Do List</h2>
      
      <div className="project-form">
        <input
          type="text"
          placeholder="To-Do Item"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <div className="button-group">
          <button onClick={handleSaveTodo}>
            {editingTodoId ? 'Update To-Do' : 'Add To-Do'}
          </button>
          {editingTodoId && (
            <button onClick={handleCancelTodo} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </div>
      
      <div className="item-list">
        <h3>Your Project To-Do Items</h3>
        <table className="project-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Task</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">No to-do items saved yet</td>
              </tr>
            ) : (
              todos.map((todo, index) => (
                <tr key={todo.id} className={`${editingTodoId === todo.id ? "editing-row" : ""} ${todo.completed ? "completed-row" : ""}`}>
                  <td className="roman-numeral">{toRoman(index + 1)}</td>
                  <td>{todo.title}</td>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={todo.completed} 
                      onChange={() => toggleTodoComplete(todo.id)}
                    />
                    {todo.completed ? "Completed" : "Pending"}
                  </td>
                  <td>{todo.date}</td>
                  <td>
                    <div className="button-group">
                      <button onClick={() => handleEditTodo(todo)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsPage;