document.getElementById('form-login').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    // Captura os valores dos campos
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        // Faz a requisição para o backend
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao fazer login.');
        }

        const result = await response.json();

        // Salva o nome e o ID do usuário no localStorage
        localStorage.setItem('userId', result.id);
        localStorage.setItem('userName', result.nome);

        // Redireciona para a página home.html
        window.location.href = './html/home.html';
    } catch (error) {
        // Exibe mensagem de erro
        alert(`Erro: ${error.message}`);
    }
});