// Captura o ID do subtópico da URL
const params = new URLSearchParams(window.location.search);
const subtopicId = params.get('id');

// Variáveis globais
const userId = localStorage.getItem('userId'); // ID do usuário logado

// Função para alternar entre favoritar e desfavoritar
const toggleFavoritar = async () => {
    const favoritarButton = document.getElementById('btn-favoritar');
    const isFavoritado = favoritarButton.classList.contains('btn-favoritado');

    try {
        // Alternar entre favoritar e desfavoritar
        const response = await fetch('http://localhost:3000/favoritar', {
            method: isFavoritado ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id_user: userId, id_mat: subtopicId })
        });

        if (!response.ok) {
            throw new Error(isFavoritado ? 'Erro ao desfavoritar.' : 'Erro ao favoritar.');
        }

        // Atualizar estilo e texto do botão
        if (isFavoritado) {
            favoritarButton.classList.remove('btn-favoritado');
            favoritarButton.textContent = 'Favoritar';
        } else {
            favoritarButton.classList.add('btn-favoritado');
            favoritarButton.textContent = 'Desfavoritar';
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao atualizar o estado do favorito. Tente novamente.');
    }
};

// Função para carregar informações do subtópico e verificar favoritos
document.addEventListener('DOMContentLoaded', async () => {
    const favoritarButton = document.getElementById('btn-favoritar');

    try {
        // Verificar se o conteúdo já está favoritado
        const favoritadoResponse = await fetch(`http://localhost:3000/favoritar/${userId}/${subtopicId}`);
        if (!favoritadoResponse.ok) throw new Error('Erro ao verificar favorito.');
        const { favoritado } = await favoritadoResponse.json();

        // Atualizar estilo e texto do botão de favorito
        if (favoritado) {
            favoritarButton.classList.add('btn-favoritado');
            favoritarButton.textContent = 'Desfavoritar';
        } else {
            favoritarButton.textContent = 'Favoritar';
        }

        // Carregar informações do subtópico
        const subtopicResponse = await fetch(`http://localhost:3000/subtopicos/${subtopicId}`);
        if (!subtopicResponse.ok) throw new Error('Erro ao carregar subtópico.');
        const subtopic = await subtopicResponse.json();

        document.getElementById('subtopic-title').textContent = subtopic.nome;
        document.getElementById('subtopic-description').textContent = subtopic.descricao;

        // Carregar materiais
        const materialsResponse = await fetch(`http://localhost:3000/materiais/${subtopicId}`);
        if (!materialsResponse.ok) throw new Error('Erro ao carregar materiais.');
        const materials = await materialsResponse.json();

        const materialsContainer = document.getElementById('materials-container');
        materialsContainer.innerHTML = ''; // Limpar conteúdo anterior

        materials.forEach(material => {
            const materialDiv = document.createElement('div');
            materialDiv.classList.add('material');
            materialDiv.innerHTML = `
                <h3>${material.titulo}</h3>
                <p>${material.texto}</p>
                <h4>Vídeos:</h4>
                <p>${material.links_video || 'Nenhum vídeo disponível.'}</p>
                <h4>Imagens:</h4>
                <p>${material.imagens ? `<img src="${material.imagens}" alt="${material.titulo}" />` : 'Ainda não temos imagens deste conteúdo.'}</p>
            `;
            materialsContainer.appendChild(materialDiv);
        });

        // Adicionar evento de clique no botão favoritar
        favoritarButton.addEventListener('click', toggleFavoritar);

    } catch (error) {
        console.error(error);
        document.getElementById('materials-container').innerHTML = '<p>Erro ao carregar os materiais. Tente novamente mais tarde.</p>';
    }
});
