"use client";

import Link from 'next/link';
import { useAuth } from "../lib/firebaseauth";
import { logout } from "../lib/firebaseauth";
import { useRouter } from "next/navigation"; // Importa o hook useRouter

export default function Nav() {
    const { user } = useAuth();
    const router = useRouter(); // Inicializa o hook useRouter

    const handleLogout = async () => {
        await logout(); // Realiza o logout
        router.push("/"); // Redireciona para a tela de início
    };

    return (
        <nav className='flex flex-row mt-4 gap-5'>
            <Link
                href="/"
                className="text-white hover:text-black hover:bg-white hover:scale-110 transition-transform duration-300 ease-in-out px-4 py-2 rounded-md">
                Inicio
            </Link>
            {!user && (
                <>
                    <Link
                        href="/register"
                        className="text-white hover:text-black hover:bg-white hover:scale-110 transition-transform duration-300 ease-in-out px-4 py-2 rounded-md">
                        Registrar
                    </Link>
                    <Link
                        href="/login"
                        className="text-white hover:text-black hover:bg-white hover:scale-110 transition-transform duration-300 ease-in-out px-4 py-2 rounded-md">
                        Login
                    </Link>
                </>
            )}
            {user && (
                <>
                    <Link
                        href="/task"
                        className="text-white hover:text-black hover:bg-white hover:scale-110 transition-transform duration-300 ease-in-out px-4 py-2 rounded-md">
                        Tarefas
                    </Link>
                    <button
                        onClick={handleLogout} // Chama a função handleLogout
                        className="text-white hover:text-black hover:bg-white hover:scale-110 transition-transform duration-300 ease-in-out px-4 py-2 rounded-md">
                        Logout
                    </button>
                </>
            )}
        </nav>
    );
}