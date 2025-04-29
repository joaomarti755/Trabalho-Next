


export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white p-4">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; {new Date().getFullYear()} Minha Aplicação. Todos os direitos reservados.</p>
                <ul className="flex justify-center space-x-4 mt-2">
                    <li><a href="/privacy" className="hover:underline">Política de Privacidade</a></li>
                    <li><a href="/terms" className="hover:underline">Termos de Uso</a></li>
                    <li><a href="/contact" className="hover:underline">Contato</a></li>
                </ul>
            </div>
        </footer>
    );
}