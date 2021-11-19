const conexao = require('../conexao');
const schemaCadastrarProduto = require('../validations/schemaCadastrarProduto');

const listarProdutos = async (req, res) => {
    const idUsuario = req.usuario.id;
    const { categoria } = req.query;

    try {
        if (categoria) {
            const query = 'select * from produtos where usuario_id = $1 and categoria ilike $2';
            const { rows: produtos } = await conexao.query(query, [idUsuario, categoria]);

            return res.status(200).json(produtos);
        }

        const query = 'select * from produtos where usuario_id = $1';
        const { rows: produtos } = await conexao.query(query, [idUsuario]);

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const detalharProduto = async (req, res) => {
    const idUsuario = req.usuario.id;
    const idProduto = req.params.id;

    try {
        const query = 'select * from produtos where id = $1';
        const { rows: produtos, rowCount } = await conexao.query(query, [idProduto]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: `Não existe produto cadastrado com o ID ${idProduto}` });
        }

        if (produtos[0].usuario_id !== idUsuario) {
            return res.status(401).json({ mensagem: 'O usuário logado não tem permissão para acessar este produto.' });
        }

        return res.status(200).json(produtos[0]);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const cadastrarProduto = async (req, res) => {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const idUsuario = req.usuario.id;

    if (quantidade < 1) {
        return res.status(400).json({ mensagem: 'A quantidade deve ser maior que zero.' });
    }

    try {
        await schemaCadastrarProduto.validate(req.body);

        const query = 'insert into produtos(usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values($1, $2, $3, $4, $5, $6, $7)';
        const produto = await conexao.query(query, [idUsuario, nome, quantidade, categoria, preco, descricao, imagem]);

        if (produto.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível cadastrar o produto.' });
        }

        res.status(200).json();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const atualizarProduto = async (req, res) => {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
    const idUsuario = req.usuario.id;
    const idProduto = req.params.id;

    if (quantidade < 1) {
        return res.status(400).json({ mensagem: 'A quantidade deve ser maior que zero.' });
    }

    try {
        await schemaCadastrarProduto.validate(req.body);

        const query1 = 'select * from produtos where id = $1';
        const { rows: produtos, rowCount } = await conexao.query(query1, [idProduto]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: `Não existe produto cadastrado com o ID ${idProduto}` });
        }

        if (produtos[0].usuario_id !== idUsuario) {
            return res.status(401).json({ mensagem: 'O usuário logado não tem permissão para acessar este produto.' });
        }

        const query2 = 'update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7';
        const produto = await conexao.query(query2, [nome, quantidade, categoria, preco, descricao, imagem, idProduto]);

        if (produto.rowCount === 0) {
            return res.status(400).json({ mensagem: 'Não foi possível atualizar o produto.' });
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const deletarProduto = async (req, res) => {
    const idUsuario = req.usuario.id;
    const idProduto = req.params.id;

    try {
        const query1 = 'select * from produtos where id = $1';
        const { rows: produtos, rowCount } = await conexao.query(query1, [idProduto]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: `Não existe produto cadastrado com o ID ${idProduto}` });
        }

        if (produtos[0].usuario_id !== idUsuario) {
            return res.status(401).json({ mensagem: 'O usuário logado não tem permissão para acessar este produto.' });
        }

        const query2 = 'delete from produtos where id = $1';
        const produto = await conexao.query(query2, [idProduto]);

        if (produto.rowCount === 0) {
            return res.status(401).json({ mensagem: 'Não foi possível excluir o produto.' });
        }

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
    listarProdutos,
    detalharProduto,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto
};