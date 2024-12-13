import sqlite3 from 'sqlite3';

// Conectar ao banco de dados
const db = new sqlite3.Database('./geohistoria.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criar as tabelas
const createTables = `
CREATE TABLE IF NOT EXISTS usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('admin', 'user'))
);

CREATE TABLE IF NOT EXISTS categoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria VARCHAR(100) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('historia', 'geografia'))
);

CREATE TABLE IF NOT EXISTS subtopico (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_cat INTEGER NOT NULL,
    nome VARCHAR(50) NOT NULL,
    descricao VARCHAR(50),
    FOREIGN KEY (id_cat) REFERENCES categoria (id)
);

CREATE TABLE IF NOT EXISTS materiais (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_sub INTEGER NOT NULL,
    titulo VARCHAR(50) NOT NULL,
    texto TEXT,
    links_video TEXT,
    imagens BLOB,
    FOREIGN KEY (id_sub) REFERENCES subtopico (id)
);

CREATE TABLE IF NOT EXISTS avaliacao (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_mat INTEGER NOT NULL,
    avaliacao TEXT,
    FOREIGN KEY (id_user) REFERENCES usuario (id),
    FOREIGN KEY (id_mat) REFERENCES materiais (id)
);

CREATE TABLE IF NOT EXISTS favoritar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER NOT NULL,
    id_mat INTEGER NOT NULL,
    FOREIGN KEY (id_user) REFERENCES usuario (id),
    FOREIGN KEY (id_mat) REFERENCES materiais (id)
);
`;

// Executar o script de criação de tabelas
db.exec(createTables, (err) => {
    if (err) {
        console.error('Erro ao criar tabelas:', err.message);
    } else {
        console.log('Tabelas criadas com sucesso.');
    }
});


export default db;