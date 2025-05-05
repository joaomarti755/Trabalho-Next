"use client";

import { useState } from "react";
import Link from 'next/link';
import { useAuth } from "@/app/lib/firebaseauth";
import { handleAdd } from "@/app/utils/handlecollection";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation"; // Importa o hook useRouter
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const { user, loading } = useAuth();
    const router = useRouter(); // Inicializa o hook useRouter

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (user) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
                <h1 className="text-xl font-bold">Acesso negado</h1>
                <p className="text-gray-700 mt-2">
                    Você já está logado. Caso queira registrar uma nova conta, saia primeiro.
                </p>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }
        setError("");

        try {
            await handleAdd({
                nome: username,
                email: email,
                senha: password,
            });
            toast.success("Usuário registrado com sucesso!");

            // Redireciona para a página inicial após o registro
            router.push("/");
        } catch (err) {
            console.error("Erro ao registrar o usuário:", err);
            setError("Erro ao registrar o usuário. Tente novamente.");
            toast.error("Erro ao registrar o usuário. Tente novamente.");
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
            <ToastContainer />
            <div className="border rounded-lg shadow-lg p-6 w-full max-w-sm bg-gray-800 text-white">
                <h1 className="text-2xl font-bold">Registrar</h1>
                <form className="mt-4" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="text"
                            id="username"
                            className="placeholder-white mt-1 block w-full border-2 p-2 border-gray-300 rounded-md shadow-sm transform transition-transform duration-200 hover:scale-105"
                            placeholder="Nome de Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            className="placeholder-white mt-1 block w-full border-2 p-2 border-gray-300 rounded-md shadow-sm transform transition-transform duration-200 hover:scale-105"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="password"
                            className="placeholder-white mt-1 block w-full border-2 p-2 border-gray-300 rounded-md shadow-sm transform transition-transform duration-200 hover:scale-105"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            id="confirm-password"
                            className="placeholder-white mt-1 block w-full border-2 p-2 border-gray-300 rounded-md shadow-sm transform transition-transform duration-200 hover:scale-105"
                            placeholder="Confirmar Senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transform transition-transform duration-200 hover:scale-105">Registrar</button>
                </form>
                <p className="mt-4 text-sm text-white">Já tem uma conta? <Link href="/login" className="text-blue-500 hover:underline">Faça login</Link></p>
            </div>
        </div>
    );
}