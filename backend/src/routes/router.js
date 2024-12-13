import db from "../db/sqlite.js";
import { Router } from "express";

const app = Router();

app.post('/cadastrar', (req, res) => {
    const { email, senha, nome } = req.body;
    
    // Validação básica dos dados
    if (!email || !senha || !nome) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    // Query para inserir no banco
    const sql = `INSERT INTO usuario (nome, email, senha, tipo) VALUES (?, ?, ?, 'user')`;

    db.run(sql, [nome, email, senha], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao cadastrar o usuário.' });
        }
        
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso!', id: this.lastID });
    });
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
        return res.status(400).json({ error: 'Preencha todos os campos!' });
    }

    // Consulta ao banco de dados
    const sql = `SELECT id, nome FROM usuario WHERE email = ? AND senha = ?`;

    db.get(sql, [email, senha], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro no servidor.' });
        }

        if (row) {
            // Usuário encontrado
            return res.status(200).json({ id: row.id, nome: row.nome });
        } else {
            // Usuário ou senha incorretos
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
    });
});

app.get('/subtopicos/historia', (req, res) => {
    const sql = `
        SELECT subtopico.id, subtopico.nome, subtopico.descricao 
        FROM subtopico
        INNER JOIN categoria ON subtopico.id_cat = categoria.id
        WHERE categoria.tipo = 'historia'
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao buscar subtópicos.' });
        }
        res.status(200).json(rows);
    });
});

app.get('/subtopicos/geografia', (req, res) => {
    const sql = `
        SELECT subtopico.id, subtopico.nome, subtopico.descricao 
        FROM subtopico
        INNER JOIN categoria ON subtopico.id_cat = categoria.id
        WHERE categoria.tipo = 'geografia'
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao buscar subtópicos.' });
        }
        res.status(200).json(rows);
    });
});

app.get('/materiais/:subtopicoId', (req, res) => {
    const subtopicoId = req.params.subtopicoId;

    const sql = `
        SELECT materiais.titulo, materiais.texto, materiais.links_video, materiais.imagens
        FROM materiais
        WHERE materiais.id_sub = ?
    `;

    db.all(sql, [subtopicoId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao buscar materiais.' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Nenhum material encontrado para este subtópico.' });
        }

        res.status(200).json(rows);
    });
});

app.get('/subtopicos/:id', (req, res) => {
    const subtopicId = req.params.id;

    const sql = `
        SELECT subtopico.id, subtopico.nome, subtopico.descricao
        FROM subtopico
        WHERE subtopico.id = ?
    `;

    db.get(sql, [subtopicId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao buscar o subtópico.' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Subtópico não encontrado.' });
        }

        res.status(200).json(row);
    });
});

app.post('/favoritar', (req, res) => {
    const { id_user, id_mat } = req.body;

    const sql = `
        INSERT INTO favoritar (id_user, id_mat) VALUES (?, ?)
    `;

    db.run(sql, [id_user, id_mat], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao favoritar.' });
        }

        res.status(200).json({ message: 'Favorito salvo com sucesso!' });
    });
});

app.delete('/favoritar', (req, res) => {
    const { id_user, id_mat } = req.body;

    const sql = `
        DELETE FROM favoritar WHERE id_user = ? AND id_mat = ?
    `;

    db.run(sql, [id_user, id_mat], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao remover dos favoritos.' });
        }

        res.status(200).json({ message: 'Removido dos favoritos com sucesso!' });
    });
});

app.get('/favoritar/:userId/:matId', (req, res) => {
    const { userId, matId } = req.params;

    const sql = `
        SELECT * FROM favoritar WHERE id_user = ? AND id_mat = ?
    `;

    db.get(sql, [userId, matId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao verificar favorito.' });
        }

        // Se houver uma linha, significa que está favoritado
        res.status(200).json({ favoritado: !!row });
    });
});

app.get('/usuario/:id', (req, res) => {
    const userId = req.params.id;

    const sql = `
        SELECT id, nome, email, senha
        FROM usuario
        WHERE id = ?
    `;

    db.get(sql, [userId], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao buscar os dados do usuário.' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.status(200).json(row);
    });
});

app.put('/usuario/:id', (req, res) => {
    const userId = req.params.id;
    const { nome, email, senha } = req.body;

    const sql = `
        UPDATE usuario
        SET nome = ?, email = ?, senha = ?
        WHERE id = ?
    `;

    db.run(sql, [nome, email, senha, userId], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao atualizar os dados do usuário.' });
        }

        res.status(200).json({ message: 'Dados atualizados com sucesso!' });
    });
});

app.delete('/usuario/:id', (req, res) => {
    const userId = req.params.id;

    // Excluir os favoritos e o usuário
    const sqlFavoritos = `DELETE FROM favoritar WHERE id_user = ?`;
    const sqlUsuario = `DELETE FROM usuario WHERE id = ?`;

    db.run(sqlFavoritos, [userId], function (err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao excluir favoritos do usuário.' });
        }

        db.run(sqlUsuario, [userId], function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Erro ao excluir o usuário.' });
            }

            res.status(200).json({ message: 'Conta excluída com sucesso!' });
        });
    });
});

app.get('/favoritos/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `
        SELECT subtopico.id, subtopico.nome, subtopico.descricao
        FROM favoritar
        INNER JOIN materiais ON favoritar.id_mat = materiais.id
        INNER JOIN subtopico ON materiais.id_sub = subtopico.id
        WHERE favoritar.id_user = ?
    `;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Erro ao buscar favoritos.' });
        }

        res.status(200).json(rows);
    });
});



export default app;