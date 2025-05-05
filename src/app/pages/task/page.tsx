"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Certifique-se de configurar o Firebase corretamente
import { useAuth } from "../../lib/firebaseauth";

interface SubTask {
    id: string;
    name: string;
    completed: boolean;
}

interface Task {
    id: string;
    title: string;
    subtasks: SubTask[];
}

export default function TaskPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const { user, loading } = useAuth();

    // Carregar tarefas do Firestore vinculadas ao usuário logado
    useEffect(() => {
        if (!user) return;

        const fetchTasks = async () => {
            const tasksQuery = query(collection(db, "tasks"), where("uid", "==", user.uid)); // Filtra pelo uid do usuário
            const querySnapshot = await getDocs(tasksQuery);
            const tasksData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];
            setTasks(tasksData);
        };

        fetchTasks();
    }, [user]);

    // Adicionar nova tarefa vinculada ao usuário logado
    const handleAddTask = async () => {
        if (!newTaskTitle.trim()) return;
        const docRef = await addDoc(collection(db, "tasks"), {
            title: newTaskTitle,
            subtasks: [],
            uid: user?.uid, // Vincula a tarefa ao usuário logado
        });
        setTasks([...tasks, { id: docRef.id, title: newTaskTitle, subtasks: [] }]);
        setNewTaskTitle("");
    };

    // Adicionar subtarefa
    const handleAddSubTask = async (taskId: string, subTaskName: string) => {
        if (!subTaskName.trim()) return;
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                const newSubTask = { id: Date.now().toString(), name: subTaskName, completed: false };
                return { ...task, subtasks: [...task.subtasks, newSubTask] };
            }
            return task;
        });
        setTasks(updatedTasks);
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { subtasks: updatedTasks.find((task) => task.id === taskId)?.subtasks });
    };

    // Marcar subtarefa como concluída
    const handleToggleSubTask = async (taskId: string, subTaskId: string) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                const updatedSubTasks = task.subtasks.map((subTask) =>
                    subTask.id === subTaskId ? { ...subTask, completed: !subTask.completed } : subTask
                );
                return { ...task, subtasks: updatedSubTasks };
            }
            return task;
        });
        setTasks(updatedTasks);
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { subtasks: updatedTasks.find((task) => task.id === taskId)?.subtasks });
    };

    // Editar tarefa
    const handleEditTask = async (id: string, newTitle: string) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, title: newTitle } : task
        );
        setTasks(updatedTasks);
        const taskRef = doc(db, "tasks", id);
        await updateDoc(taskRef, { title: newTitle });
    };

    // Apagar tarefa
    const handleDeleteTask = async (id: string) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        const taskRef = doc(db, "tasks", id);
        await deleteDoc(taskRef);
    };

    // Editar subtarefa
    const handleEditSubTask = async (taskId: string, subTaskId: string, newName: string) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                const updatedSubTasks = task.subtasks.map((subTask) =>
                    subTask.id === subTaskId ? { ...subTask, name: newName } : subTask
                );
                return { ...task, subtasks: updatedSubTasks };
            }
            return task;
        });
        setTasks(updatedTasks);
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { subtasks: updatedTasks.find((task) => task.id === taskId)?.subtasks });
    };

    // Apagar subtarefa
    const handleDeleteSubTask = async (taskId: string, subTaskId: string) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                const updatedSubTasks = task.subtasks.filter((subTask) => subTask.id !== subTaskId);
                return { ...task, subtasks: updatedSubTasks };
            }
            return task;
        });
        setTasks(updatedTasks);
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, { subtasks: updatedTasks.find((task) => task.id === taskId)?.subtasks });
    };

    // Calcular percentual de conclusão de subtarefas
    const calculateSubTaskCompletionPercentage = (subtasks: SubTask[]) => {
        if (subtasks.length === 0) return 0;
        const completedSubTasks = subtasks.filter((subTask) => subTask.completed).length;
        return Math.round((completedSubTasks / subtasks.length) * 100);
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
                        <li key={task.id} className="flex flex-col p-2 border-b">
                            <div className="flex items-center justify-between">
                                <div>{task.title}</div>
                                <div className="flex gap-2">
                                    <button
                                        className="text-blue-500"
                                        onClick={() => {
                                            const newTitle = prompt("Editar tarefa:", task.title);
                                            if (newTitle) {
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
                                        Apagar
                                    </button>
                                    <button
                                        className="text-green-500"
                                        onClick={() => {
                                            const subTaskName = prompt("Adicionar subtarefa:");
                                            if (subTaskName) {
                                                handleAddSubTask(task.id, subTaskName);
                                            }
                                        }}
                                    >
                                        + Subtarefa
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2">
                                <div className="w-full bg-gray-300 rounded h-4">
                                    <div
                                        className="bg-green-500 h-4 rounded"
                                        style={{
                                            width: `${calculateSubTaskCompletionPercentage(task.subtasks)}%`,
                                        }}
                                    ></div>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {calculateSubTaskCompletionPercentage(task.subtasks)}% concluído
                                </p>
                            </div>
                            <ul className="mt-2">
                                {task.subtasks.map((subTask) => (
                                    <li key={subTask.id} className="flex items-center justify-between">
                                        <div>
                                            <input
                                                type="checkbox"
                                                checked={subTask.completed}
                                                onChange={() => handleToggleSubTask(task.id, subTask.id)}
                                                className="mr-2"
                                            />
                                            {subTask.name}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className="text-blue-500"
                                                onClick={() => {
                                                    const newName = prompt("Editar subtarefa:", subTask.name);
                                                    if (newName) {
                                                        handleEditSubTask(task.id, subTask.id, newName);
                                                    }
                                                }}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="text-red-500"
                                                onClick={() => handleDeleteSubTask(task.id, subTask.id)}
                                            >
                                                Apagar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}