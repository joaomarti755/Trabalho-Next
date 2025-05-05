import React from 'react';
import Nav from './nav';
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">Nossa Aplicação</Link>
                <Nav />
            </div>
        </header>
    );
}