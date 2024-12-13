document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId'); // ID do usuário logado
    const form = document.getElementById('form-login');

    // Se o userId não existir, redireciona para a página inicial
    if (!userId) {
        window.location.href = '../index.html';
        return;
    }

    // Carregar dados do usuário
    try {
        const response = await fetch(`http://localhost:3000/usuario/${userId}`);
        if (!response.ok) throw new Error('Erro ao carregar os dados do usuário.');

        const user = await response.json();

        // Preencher os campos do formulário
        document.getElementById('nome').value = user.nome;
        document.getElementById('email').value = user.email;
        document.getElementById('senha').value = user.senha;
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar os dados do usuário. Tente novamente mais tarde.');
    }

    // Atualizar dados do usuário
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita o comportamento padrão do formulário

        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        try {
            const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });

            if (!response.ok) throw new Error('Erro ao atualizar os dados.');

            const result = await response.json();
            alert(result.message);
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar os dados. Tente novamente.');
        }
    });

    // Botão para excluir conta
    document.getElementById('excluirConta').addEventListener('click', async (event) => {
        event.preventDefault(); // Impede o comportamento padrão do link

        if (!userId) {
            alert('Usuário não autenticado.');
            return;
        }

        // Confirmar exclusão
        const confirmacao = confirm('Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.');
        if (!confirmacao) return;

        try {
            const response = await fetch(`http://localhost:3000/usuario/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Erro ao excluir a conta.');
            }

            const result = await response.json();
            alert(result.message);

            // Limpar dados do localStorage e redirecionar para a página inicial
            localStorage.clear();
            window.location.href = '../index.html';
        } catch (error) {
            console.error(error);
            alert('Erro ao excluir a conta. Tente novamente.');
        }
    });
});
