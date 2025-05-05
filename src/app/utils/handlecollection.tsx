import { db } from "@/app/lib/firebase";
import { auth } from "@/app/lib/firebase";

import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

type FormData = {
    nome: string,
    email: string,
    senha: string,
};

const COLLECTION_NAME = "usuarios";

export const handleAdd = async (data: FormData) => {
    try {
        // Cria o usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.senha);
        console.log("Usuário registrado com sucesso no Firebase Authentication:", userCredential.user);

        // Salva os dados do usuário na coleção "usuarios" no Firestore
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            nome: data.nome,
            email: data.email,
            senha: data.senha, // Salva a senha no Firestore (não recomendado em produção)
        });
        console.log("Usuário salvo no Firestore com ID:", docRef.id);

        // Retorna o ID do usuário criado no Firestore
        return docRef.id;
    } catch (e) {
        console.error("Erro ao registrar o usuário: ", e);
        return null;
    }
};