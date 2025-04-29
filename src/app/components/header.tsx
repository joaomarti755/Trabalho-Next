import React from 'react';
import Nav from './nav';

export default function Header() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Minha Aplicação</h1>
                <Nav />
            </div>
        </header>
    );
}