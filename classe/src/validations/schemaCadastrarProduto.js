// nome, quantidade, categoria, preco, descricao, imagem
const yup = require('./configuracoes');

const schemaCadastrarProduto = yup.object().shape({
    nome: yup.string().strict().required(),
    quantidade: yup.number().strict().required(),
    categoria: yup.string().strict(),
    preco: yup.number().strict().required(),
    descricao: yup.string().strict().required(),
    imagem: yup.string().strict()
});

module.exports = schemaCadastrarProduto;