"use client";

import { useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            // Login do usuário no Firebase Authentication
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Login realizado com sucesso!");
            router.push("/task");
        } catch (err: any) {
            console.error("Erro ao fazer login:", err);

            // Mapeia os códigos de erro do Firebase para mensagens amigáveis
            let errorMessage = "Erro ao fazer login. Tente novamente.";
            if (err.code === "auth/user-not-found") {
                errorMessage = "Usuário não encontrado. Verifique o email e tente novamente.";
            } else if (err.code === "auth/wrong-password") {
                errorMessage = "Senha incorreta. Tente novamente.";
            } else if (err.code === "auth/invalid-email") {
                errorMessage = "Email inválido. Verifique o formato do email.";
            }

            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleGitHubLogin = async () => {
        try {
            await signInWithPopup(auth, githubProvider);
            toast.success("Login com GitHub realizado com sucesso!");
            router.push("/task");
        } catch (error: any) {
            console.error("Erro ao fazer login com GitHub:", error);
            toast.error("Erro ao fazer login com GitHub. Tente novamente.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success("Login com Google realizado com sucesso!");
            router.push("/task");
        } catch (error: any) {
            console.error("Erro ao fazer login com Google:", error);
            toast.error("Erro ao fazer login com Google. Tente novamente.");
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
            <ToastContainer />
            <div className="border rounded-lg shadow-lg p-6 w-full max-w-sm bg-gray-800 text-white">
                <h1 className="text-2xl font-bold">Login</h1>
                <form className="mt-4" onSubmit={handleSubmit}>
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
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transform transition-transform duration-200 hover:scale-105"
                    >
                        Entrar
                    </button>
                </form>
                <div className="mt-4">
                    <button
                        onClick={handleGitHubLogin}
                        className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transform transition-transform duration-200 hover:scale-105 mb-2"
                    >
                        Entrar com GitHub
                    </button>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transform transition-transform duration-200 hover:scale-105"
                    >
                        Entrar com Google
                    </button>
                </div>
                <p className="mt-4 text-sm text-white">
                    Não possuo uma conta!{" "}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Criar uma Conta
                    </Link>
                </p>
            </div>
        </div>
    );
}