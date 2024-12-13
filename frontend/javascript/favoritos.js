document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId'); // ID do usuário logado
    const favoritesList = document.getElementById('favorites-list');

    // Se o userId não existir, redireciona para a página inicial
    if (!userId) {
        window.location.href = '../index.html';
        return;
    }

    try {
        // Fazer a requisição para obter os favoritos do usuário
        const response = await fetch(`http://localhost:3000/favoritos/${userId}`);
        if (!response.ok) throw new Error('Erro ao carregar favoritos.');

        const favoritos = await response.json();

        // Limpar o container antes de adicionar os favoritos
        favoritesList.innerHTML = '';

        // Adicionar os favoritos à lista
        if (favoritos.length > 0) {
            favoritos.forEach(favorito => {
                const favoriteCard = document.createElement('div');
                favoriteCard.classList.add('favorite-card');
                favoriteCard.innerHTML = `
                    <h3>${favorito.nome}</h3>
                    <p>${favorito.descricao}</p>
                    <button class="btn-card" onclick="location.href='./subtopico.html?id=${favorito.id}'">Ver Conteúdo</button>
                `;

                favoritesList.appendChild(favoriteCard);
            });
        } else {
            favoritesList.innerHTML = '<p>Você ainda não favoritou nenhum subtópico.</p>';
        }
    } catch (error) {
        console.error(error);
        favoritesList.innerHTML = '<p>Erro ao carregar favoritos. Tente novamente mais tarde.</p>';
    }
});
