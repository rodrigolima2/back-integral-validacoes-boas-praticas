const yup = require('./configuracoes');

const schemaCadastrarUsuario = yup.object().shape({
    nome: yup.string().strict().required(),
    nome_loja: yup.string().strict().required(),
    email: yup.string().strict().required(),
    senha: yup.string().strict().required()
});

module.exports = schemaCadastrarUsuario;