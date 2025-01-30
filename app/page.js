"use client";
import { getAPI, postAPI, deleteAPI, putAPI } from "@/services/fetchAPI";
import { useEffect, useState } from "react";
import { FaCheck, FaEdit, FaMinusCircle } from "react-icons/fa";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editMode, setEditMode] = useState({});

 
  const handleCreateTodo = async () => {
    if (newTodo.trim().length === 0) {
      alert("Lütfen bir todo giriniz.");
      return;
    }
    const payload = {
      description: newTodo,
    };

    try {
      const response = await postAPI("/todos", payload);
      if (response) {
        setTodos((prevTodos) => [...prevTodos, response]);
        setNewTodo("");
      }
    } catch (error) {
      console.error("Todo eklenirken hata oluştu:", error);
    }
  };

  const handleKey = async (event) => {
    if (event.key === "Enter") {
      await handleCreateTodo();
    }
  };

  useEffect(() => {
    getAPI("/todos").then((data) => setTodos(data));
  }, []);

  // Todo silme
  const handleDelete = async (id) => {
    try {
      const response = await deleteAPI("/todos", { id });
      if (response) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Todo silinirken hata oluştu:", error);
    }
  };

  const handleEditStart = (id, description) => {
    setEditMode({ ...editMode, [id]: true }); 
    setNewTodo(description); 
  };


  const handleEditSave = async (id) => {
    if (newTodo.trim().length === 0) {
      alert("Lütfen bir todo giriniz.");
      return;
    }

    const payload = {
      id,
      description: newTodo,
    };

    try {
      const response = await putAPI("/todos", payload);
      if (response) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, description: newTodo } : todo
          )
        );
        setNewTodo("");
        setEditMode({ ...editMode, [id]: false });
      }
    } catch (error) {
      console.error("Todo güncellenirken hata oluştu:", error);
    }
  };

  return (
    <div className="bg-slate-300 min-h-screen">
      <div className="flex justify-center items-center flex-col pt-4">
        <input
          className="p-2 border-solid border-b-2 border-gray-500 w-1/3 max-lg:w-2/3"
          type="text"
          value={newTodo}
          placeholder="ToDo Giriniz..."
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          className="mt-2 hover:bg-gray-600 bg-gray-400 font-semibold text-white py-2 px-4 border-2 border-gray-500 rounded cursor-pointer"
          onClick={handleCreateTodo}
        >
          ToDo Oluştur
        </button>
      </div>

      {todos &&
        todos.map((todo) => {
          return (
            <div className="flex justify-center" key={todo.id}>
              <div className="break-normal p-2 w-1/3 max-lg:w-2/3 border border-gray-400 mt-2 rounded-md flex justify-between items-center bg-slate-100">
                {editMode[todo.id] ? (
                  // Düzenleme modunda input göster
                  <input
                    className="p-1 border border-gray-400 rounded w-full"
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                  />
                ) : (
                  <p>{todo.description}</p>
                )}

                <div className="flex gap-x-2 text-xl">
                  <FaMinusCircle
                    onClick={() => handleDelete(todo.id)}
                    className="cursor-pointer text-red-600 hover:text-red-800"
                  />
                  {editMode[todo.id] ? (
                    <FaCheck
                      onClick={() => handleEditSave(todo.id)}
                      className="cursor-pointer text-green-600 hover:text-green-800"
                    />
                  ) : (
                    <FaEdit
                      onClick={() => handleEditStart(todo.id, todo.description)}
                      className="cursor-pointer text-blue-600 hover:text-blue-800"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
