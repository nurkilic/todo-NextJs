"use client";
import { getAPI, postAPI ,deleteAPI} from "@/services/fetchAPI";
import { useEffect, useState } from "react";
import { FaMinusCircle } from "react-icons/fa";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const handleCreateTodo = async () => {
    if (newTodo.trim().length === 0) {
      alert("Lütfen bir todo giriniz.");
      return;
    }
    const payload = {
      id: Math.floor(Math.random() * 999999),
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
                <p>{todo.description}</p>
                <div className="flex gap-x-2 text-xl">
                  <FaMinusCircle
                    onClick={() => handleDelete(todo.id)}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
