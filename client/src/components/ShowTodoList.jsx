import React, { useState, useEffect } from "react";
import axios from "axios";

function TodoCard({ data, handleDelete }) {
  const { _id, content } = data;
  return (
    <li className="todo.item" key={_id}>
      <p className="todo-content">{content}</p>
    </li>
  );
}

function ShowTodoList() {
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");

  const handleEdit = (e) => {
    setNewTodo(e.target.name);
    setId(e.target.id);
    setIsEdit(true);
  };

  const finishEdit = () => {
    axios
      .put(`http://localhost:8000/api/todo/${id}`, { content: newTodo })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setIsEdit(false);
    setNewTodo("");
  };

  const handleAdd = () => {
    axios
      .post("http://localhost:8000/api/todo", {
        content: newTodo,
      })
      .then((res) => {
        console.log(res.data.message);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setNewTodo("");
  };

  const handleDelete = (e) => {
    axios
      .delete(`http://localhost:8000/api/todo/${e.target.id}`)
      .then(() => {
        console.log("Successfully deleted");
      })
      .catch((err) => {
        console.log(err.message);
      });

    setTodo((data) => {
      return data.filter((todo) => todo._id !== e.target.id);
    });
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/todo")
      .then((res) => {
        setTodo(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [todo]);

  return (
    <div>
      <header>
        <h1>My Todo List</h1>
      </header>
      <section>
        <input
          type="text"
          className="todo-input"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />

        {isEdit ? (
          <button className="finishEdit-btn" onClick={finishEdit}>
            Edit
          </button>
        ) : (
          <button className="todo-button" onClick={handleAdd}>
            <i className="fas fa-plus-square">+</i>
          </button>
        )}
      </section>
      <div className="todo-container">
        <ul className="todo-list">
          {todo.map((data, idx) => {
            return (
              <div className="todo" key={idx}>
                <TodoCard data={data} handleDelete={handleDelete} />
                <button
                  id={data._id}
                  name={data.content}
                  className="edit-btn"
                  onClick={handleEdit}
                >
                  Edit
                </button>

                <button
                  id={data._id}
                  name={data.content}
                  className="delete-btn"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ShowTodoList;
