document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.subtopics-container');

    try {
        // Fazer requisição para obter os subtópicos
        const response = await fetch('http://localhost:3000/subtopicos/geografia');
        if (!response.ok) {
            throw new Error('Erro ao buscar subtópicos.');
        }

        const subtopicos = await response.json();

        // Criar os links dinamicamente
        subtopicos.forEach((subtopico) => {
            const button = document.createElement('a');
            button.classList.add('btn', 'subtopic-button');
            button.href = `subtopico.html?id=${subtopico.id}`; // Adiciona o ID na URL
            button.textContent = subtopico.nome;
            button.style.margin = '10px'; // Espaçamento
            container.appendChild(button);
        });
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p>Erro ao carregar subtópicos. Tente novamente mais tarde.</p>';
    }
});
