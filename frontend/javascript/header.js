document.getElementById('btn-perfil').addEventListener('click', () => {
    // Redireciona para a página de perfil
    window.location.href = './perfil.html';
});

document.getElementById('btn-sair').addEventListener('click', () => {
    // Limpa o localStorage e redireciona para a página de login
    localStorage.clear();
    window.location.href = '../index.html';
});

document.getElementById('btn-favoritos').addEventListener('click', () => {
    // redireciona para a página de login
    window.location.href = './favoritos.html';
});

// Exibir o nome do usuário armazenado no localStorage
document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('user-name').textContent = userName;
    }
});
