"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Certifique-se de configurar o Firebase corretamente
import { useAuth } from "../../lib/firebaseauth";

interface Task {
    id: string;
    title: string;
    completed: boolean;
    activities: { name: string; completed: boolean }[];
}

export default function Register() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const { user, loading } = useAuth();

    // Carregar tarefas do Firestore
    useEffect(() => {
        const fetchTasks = async () => {
            const querySnapshot = await getDocs(collection(db, "tasks"));
            const tasksData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];
            setTasks(tasksData);
        };
        fetchTasks();
    }, []);

    // Adicionar nova tarefa
    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        const docRef = await addDoc(collection(db, "tasks"), {
            title: newTaskTitle,
            completed: false,
            activities: [],
        });
        setTasks([...tasks, { id: docRef.id, title: newTaskTitle, completed: false, activities: [] }]);
        setNewTaskTitle("");
    };

    // Marcar tarefa como concluída
    const handleToggleComplete = async (taskId: string, completed: boolean) => {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { completed: !completed });
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !completed } : task)));
    };

    // Excluir tarefa
    const handleDeleteTask = async (taskId: string) => {
        const taskRef = doc(db, "tasks", taskId);
        await deleteDoc(taskRef);
        setTasks(tasks.filter((task) => task.id !== taskId));
    };

    // Editar tarefa
    const handleEditTask = async (taskId: string, newTitle: string) => {
        if (!newTitle.trim()) return;
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { title: newTitle });
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task)));
    };

    // Calcular percentual geral de tarefas concluídas
    const calculateOverallCompletionPercentage = () => {
        if (tasks.length === 0) return 0;
        const completedTasks = tasks.filter((task) => task.completed).length;
        return Math.round((completedTasks / tasks.length) * 100);
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (!user) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
                <h1 className="text-xl font-bold">Acesso negado</h1>
                <p className="text-gray-700 mt-2">
                    Por favor, <a href="/login" className="text-blue-500 underline">faça login</a> ou <a href="/register" className="text-blue-500 underline">registre-se</a> para acessar esta página.
                </p>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
            <div className="w-full max-w-md bg-white p-4 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Gerenciador de Tarefas</h1>
                <div className="flex mb-4">
                    <input
                        type="text"
                        className="flex-1 border p-2 rounded"
                        placeholder="Nova tarefa"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                    <button
                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAddTask}
                    >
                        Adicionar
                    </button>
                </div>
                <ul>
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="flex flex-col p-2 border-b"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => handleToggleComplete(task.id, task.completed)}
                                        className="mr-2"
                                    />
                                    {task.title}
                                </div>
                                <div className="flex items-center">
                                    <button
                                        className="text-blue-500 mr-2"
                                        onClick={() => {
                                            const newTitle = prompt("Editar tarefa:", task.title);
                                            if (newTitle !== null) {
                                                handleEditTask(task.id, newTitle);
                                            }
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="text-red-500"
                                        onClick={() => handleDeleteTask(task.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="mt-4 text-center">
                    <h2 className="text-lg font-bold">Progresso Geral</h2>
                    <div className="w-full bg-gray-300 rounded h-4 mt-2">
                        <div
                            className="bg-green-500 h-4 rounded"
                            style={{
                                width: `${calculateOverallCompletionPercentage()}%`,
                            }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        {calculateOverallCompletionPercentage()}% das tarefas concluídas
                    </p>
                </div>
            </div>
        </div>
    );
}