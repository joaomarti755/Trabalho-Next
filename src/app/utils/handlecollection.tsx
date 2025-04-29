import { db } from "@/app/lib/firebase";
import { auth } from "@/app/lib/firebase";

import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
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
        console.log("Usuário registrado com sucesso:", userCredential.user);

        // Retorna o ID do usuário criado
        return userCredential.user.uid;
    } catch (e) {
        console.error("Erro ao registrar o usuário: ", e);
        return null;
    }
};

export const handleSelectAll = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return data;
    } catch (e) {
        console.error("Erro ao buscar os documentos: ", e);
        return null;
    }
};

export const handleDelete = async (id: string) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        console.log("Documento excluído com o ID: ", id);
        return true;
    } catch (e) {
        console.error("Erro ao excluir o documento: ", e);
        return false;
    }
};

export const handleUpdate = async (id: string, data: FormData) => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, data);
        console.log("Documento atualizado com o ID: ", id);
        return true;
    } catch (e) {
        console.error("Erro ao atualizar o documento: ", e);
        return false;
    }
};