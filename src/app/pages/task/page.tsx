"use client";

import { useAuth } from "../../lib/firebaseauth";

export default function TaskPage() {
    const { user, loading } = useAuth();

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
        <>
        </>
    );
}