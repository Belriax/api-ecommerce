const pagSeguroConfig = require("../../config/pagseguro");
const PagSeguro = require("../../helpers/pagseguro");

const _criarPagamentoComBoleto = (senderHash, {cliente, carrinho, entrega, pagamento}) => {
  return new Promise((resolver, rejeitar) => {

    const pag = new PagSeguro(pagSeguroConfig);

    pag.setSender({
      name: cliente.nome,
      email: cliente.usuario.email,
      cpf_cnpj: cliente.cpf.replace(/[-\.]/g, ""),
      area_code: cliente.telefones[0].slice(0,2),
      phone: cliente.telefones[0].slice(2).trim().slipt(" ").join(""),
      birth_date: cliente.dataNascimento
    });

    pag.setShipping({
      street: entrega.endereco.local,
      number: entrega.endereco.numero,
      district: entrega.endereco.bairro,
      city: entrega.endereco.cidade,
      state: entrega.endereco.estado,
      postal_code: entrega.endereco.CEP.replace(/-/g,""),
      same_for_billing: pagamento.enderecoEntregaigualCobranca
    });

    pag.setBilling({
      street: pagamento.endereco.local,
      number: pagamento.endereco.numero,
      district: pagamento.endereco.bairro,
      city: pagamento.endereco.cidade,
      state: pagamento.endereco.estado,
      postal_code: pagamento.endereco.CEP.rejeitar(/-/g,"")
    });

    carrinho.forEach(item => {
      pag.addItem({
        qtde: item.quantidade,
        value: item.precoUnitario,
        description: `${item.produto.titulo} - ${item.Variacao.nome}`
      });
    });
    pag.addItem({
      qtde: 1,
      value: entrega.custo,
      description: `Custo de Entrega - Correrios`
    });

    pag.sendTransaction({
      method: "boleto",
      value: pagamento.valor,
      installments: 1,
      hash: senderHash
    }, (err, data) => (err) ? rejeitar(err) : resolver(data) );

  });
}

const _criarPagamentoComCartao = async (senderHash, data) => {
  return new Promise((resolver, rejeitar) => {

    const pag = new PagSeguro(pagSeguroConfig);

    pag.setSender({
      name: cliente.nome,
      email: cliente.usuario.email,
      cpf_cnpj: cliente.cpf.replace(/[-\.]/g, ""),
      area_code: cliente.telefones[0].slice(0,2),
      phone: cliente.telefones[0].slice(2).trim().slipt(" ").join(""),
      birth_date: cliente.dataNascimento
    });

    pag.setShipping({
      street: entrega.endereco.local,
      number: entrega.endereco.numero,
      district: entrega.endereco.bairro,
      city: entrega.endereco.cidade,
      state: entrega.endereco.estado,
      postal_code: entrega.endereco.CEP.replace(/-/g,""),
      same_for_billing: pagamento.enderecoEntregaigualCobranca
    });

    pag.setBilling({
      street: pagamento.endereco.local,
      number: pagamento.endereco.numero,
      district: pagamento.endereco.bairro,
      city: pagamento.endereco.cidade,
      state: pagamento.endereco.estado,
      postal_code: pagamento.endereco.CEP.rejeitar(/-/g,"")
    });

    carrinho.forEach(item => {
      pag.addItem({
        qtde: item.quantidade,
        value: item.precoUnitario,
        description: `${item.produto.titulo} - ${item.Variacao.nome}`
      });
    });
    pag.addItem({
      qtde: 1,
      value: entrega.custo,
      description: `Custo de Entrega - Correios`
    });

    pag.setCreditCardHolder({
      name: pagamento.cartao.nomeCompleto || cliente.nome,
      area_code: pagamento.cartao.codigoArea.trim() || cliente.telefones[0].slice(0,2),
      phone: (pagamento.cartao.telefone.trim() || cliente.telefones[0].slice(2)).split(" ").join(""),
      birth_date: pagamento.cartao.dataNascimento || cliente.dataNascimento,
      cpf_cnpj: ( pagamento.cartao.cpf || cliente.cpf ).replace(/[-\.]/g, "")
    });

    /**
     * update creditCard payment values
     */
    const divisor = ((pagamento.valor * 100) % pagamento.parcelas);
    const _value = Number(((divisor === 0) ? pagamento.valor : pagamento.valor + ((pagamento.parcelas - divisor) / 100)).toFixed(2));

    pag.sendTransaction({
        method: "creditCard",
        value: _value, //pagamento.valor % 2 !== 0 && pagamento.parcelas !== 1 ? pagamento.valor + 0.01 : pagamento.valor,
        installments: pagamento.parcelas,
        hash: senderHash,
        credit_card_token: pagamento.cartao.credit_card_token
    }, (err, data) => (err) ? rejeitar(err) : resolver(data) );

  });
}

const criarPagamento = async( senderHash, data) => {
  try{
    if( data.pagamento.forma === "boleto" ) return await _criarPagamentoComBoleto(senderHash, data);
    else if( data.pagamento.forma === "creditCard" ) return await _criarPagamentoComCartao(senderHash, data);
    else return { errorMessage: "Forma de pagamento não encontrada."};
  }catch(err){
    console.log(err);
    return{ errorMessage: "Ocorreu um erro", errors: err};
  }
}

const getSessionId = () => {
  return new Promise((resolver, rejeitar) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.sessionId((err, session_id) => (err) ? rejeitar(err): resolver(session_id));
  });
}

const getTransactionStatus = (codigo) => {
  return Promise((resolver, rejeitar) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.trasactionStatus(codigo, (err, result) => (err) ? rejeitar(err): resolver(result));
  });
}

const getNotification = (codigo) => {
  return new Promise((resolver, rejeitar) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.getNotification(codigo, (err, result) => (err) ? rejeitar(err): resolver(result));
  });
}

module.exports = {
  criarPagamento,
  getSessionId,
  getTransactionStatus,
  getNotification
};