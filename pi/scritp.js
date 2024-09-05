// Importando as funções necessárias do Firebase SDK
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-storage.js';

// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCCZugVOYWykO-Il8k01zTYExCiLrF4HQ8",
    authDomain: "projetopi4-d8195.firebaseapp.com",
    projectId: "projetopi4-d8195",
    storageBucket: "projetopi4-d8195.appspot.com",
    messagingSenderId: "404927992166",
    appId: "1:404927992166:web:59544f80198bb9604cf8a7",
    measurementId: "G-KMQX9YP4CK"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Função para listar todas as pastas na raiz
const listFolders = async () => {
    const rootRef = ref(storage, '');

    try {
        const res = await listAll(rootRef);

        const folderSelect = document.getElementById('folder-select');
        folderSelect.innerHTML = '<option value="" disabled selected>Selecione uma pasta</option>';

        res.prefixes.forEach((folderRef) => {
            const option = document.createElement('option');
            option.value = folderRef.fullPath;
            option.innerText = folderRef.name;
            folderSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao listar pastas: ", error);
    }
};

// Função para listar e exibir arquivos da pasta selecionada
const listFiles = async (folderPath) => {
    const listRef = ref(storage, folderPath);

    try {
        const res = await listAll(listRef);

        document.getElementById('file-container').innerHTML = '';

        res.items.forEach(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            displayFile(itemRef.name, url);
        });
    } catch (error) {
        console.error("Erro ao listar arquivos: ", error);
    }
};

// Função para exibir o arquivo no HTML
const displayFile = (fileName, url) => {
    const fileContainer = document.createElement('div');

    if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.jpeg')) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = fileName;
        fileContainer.appendChild(img);
    } else if (fileName.endsWith('.mp4') || fileName.endsWith('.avi') || fileName.endsWith('.mov')) {
        const video = document.createElement('video');
        video.src = url;
        video.controls = true;
        fileContainer.appendChild(video);
    } else if (fileName.endsWith('.txt')) {
        const link = document.createElement('a');
        link.href = url;
        link.innerText = fileName;
        link.className = 'text-file';
        link.target = '_blank';

        const popup = document.createElement('div');
        popup.className = 'popup';

        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                popup.innerText = xhr.responseText;
            } else {
                console.error("Erro ao carregar o arquivo de texto: ", xhr.statusText);
                popup.innerText = `Erro ao carregar o arquivo de texto: ${xhr.statusText}`;
            }
        };

        fileContainer.appendChild(link);
    }

    document.getElementById('file-container').appendChild(fileContainer);
};

// Função para fazer upload de arquivo
const uploadFile = async (file) => {
    const folderSelect = document.getElementById('folder-select');
    const selectedFolder = folderSelect.value;

    if (!selectedFolder) {
        alert("Por favor, selecione uma pasta primeiro.");
        return;
    }

    const uniqueName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${selectedFolder}/${uniqueName}`);

    try {
        await uploadBytes(storageRef, file);
        alert("Upload realizado com sucesso!");
        listFiles(selectedFolder);
    } catch (error) {
        console.error("Erro ao fazer upload: ", error);
        alert("Erro ao fazer upload: " + error.message);
    }
};

// Configurar o botão de upload
const uploadBtn = document.getElementById('upload-btn');
uploadBtn.addEventListener('click', () => {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (file) {
        uploadFile(file);
    } else {
        alert("Por favor, selecione um arquivo para fazer upload.");
    }
});

// Inicializar a lista de pastas ao carregar a página
document.addEventListener('DOMContentLoaded', listFolders);

// Atualizar arquivos quando a pasta selecionada mudar
document.getElementById('folder-select').addEventListener('change', (event) => {
    const folderPath = event.target.value;
    listFiles(folderPath);
});
