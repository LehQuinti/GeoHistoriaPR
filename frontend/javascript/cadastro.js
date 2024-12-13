document.getElementById('form-login').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    // Capturar os valores dos campos
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const nome = document.getElementById('nome').value;

    try {
        // Fazer a requisição para o backend
        const response = await fetch('http://localhost:3000/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha, nome })
        });

        // Verificar se a resposta foi bem-sucedida
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao se conectar ao servidor.');
        }

        const result = await response.json();

        // Exibir mensagem de sucesso
        console.log(result.message);
        console.log('Redirecionando para a página de login...');
        // Redirecionar para a página de login
        window.location.href = '../index.html';
    } catch (error) {
        // Tratar erros e exibir mensagem para o usuário
        alert(`Erro: ${error.message}`);
    }
});