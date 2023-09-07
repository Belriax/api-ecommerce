const mongoose = require("mongoose");
const { criarPagamento, getSessionId, getTransactionStatus, getNotification } = require("./integration/pagseguro");

const Pagamento = mongoose.model("Pagamento");

const Pedido = mongoose.model("Pedido");
const Produto = mongoose.model("Produto");
const Variacao = mongoose.model("Variacao");
const RegistroPedido = mongoose.model("RegistroPedido");

class PagamentoController {
  // CLIENTES
  async show(req, res, next){
    try {
      const pagamento = await Pagamento.findOne({_id: req.params.id, loja: req.query.loja });
      if(!pagamento) return res.status(400).send({error: "Pagamento não existe"});

      const registros = await RegistroPedido.find({ pedido: pagamento.pedido, tipo: "pagamento" });

      const situacao = (pagamento.pagSeguroCode) ? await getTransactionStatus(pagamento.pagSeguroCode) : null;

      if(
        situacao && 
        (
          registros.length === 0 ||
          !registros[registros.length-1].payload ||
          !registros[registros.length-1].payload.code ||
          registros[registros.length-1].payload.code !== situacao.code
        )
      ){
        const registroPedido = new RegistroPedido({
          pedido: pagamento.pedido,
          tipo: "pagamento",
          situacao: situacao.status || "Situacao",
          payload: situacao
        });
        pagamento.status = situacao.status;
        await pagamento.save();
        await RegistroPedido.save();
        registros.push(registroPedido);
      }

      return res.send({ pagamento, registros, situacao });
    } catch (err) {
      next(err)
    }
  }

  async pagar(req, res, next){
    const { senderHash} = req.body;

    try {
      const pagamento = await Pagamento.findOne({_id: req.params.id, loja: req.query.loja });
      if(!pagamento) return res.status(400).send({error: "Pagamento não existe"});

      const pedido = await Pedido.findById(pagamento.pedido).populate([
        {path: "cliente", populate: "usuario"},
        {path: "entrega"},
        {path: "cliente"}
      ]);
      pedido.carrinho = await Promise.all(pedido.carrinho.map(async (item) => {
        item.produto = await Produto.findById(item.produto);
        item.variacao = await Variacao.findById(item.variacao);
        return item;
      }));

      const payload = await criarPagamento(senderHash, pedido);
      pagamento.payload = (pagamento.payload) ? pagamento.payload.concat([payload]) : [payload];
      if(payload.code) pagamento.pagSeguroCode = payload.code;
      await pagamento.save();

      return res.send({ pagamento, payload });

    } catch (err) {
      next(err)
    }
  }

  // ADMIN
  async update(req, res, next){
    const { status } = req.body;
    const { loja } = req.query;
    try {
      const pagamento = await Pagamento.findOne({_id: req.params.id, loja});
      if(!pagamento) return res.status(400).send({error: "Pagamento não existe"});

      if(status) pagamento.status = status;

      const registroPedido = new RegistroPedido({
        pedido: pagamento.pedido,
        tipo: "pagamento",
        situacao: status
      });
      await registroPedido.save();
      // Enviar email de aviso para o cliente - aviso de atualização de pagamento

      await pagamento.save();
      return res.send({ pagamento });
    } catch (err) {
      next(err)
    }
  }

  // PAGSEGURO
  async getSessionId(req, res, next){
    try {
      const sessionId = await getSessionId();
      return res.send({sessionId});
    } catch (err) {
      next(err)
    }
  }

  async verNotificacao(req, res, next){
    try {
      const { notificationCode, notificationType } = req.body;
      if(notificationType !== "transaction") return res.send({ success: true });

      const result = await getNotification(notificationCode);

      const pagamento = await Pagamento.findOne({ pagSeguroCode: result.code });
      if(!pagamento) return res.status(400).send({error: "Pagamento não existe"});

      const registros = await RegistroPedido.find({ pedido: pagamento.pedido, tipo: "pagamento" });

      const situacao = (pagamento.pagSeguroCode) ? await getTransactionStatus(pagamento.pagSeguroCode) : null;

      if(
        situacao && 
        (
          registros.length === 0 ||
          !registros[registros.length-1].payload ||
          !registros[registros.length-1].payload.code ||
          registros[registros.length-1].payload.code !== situacao.code
        )
      ){
        const registroPedido = new RegistroPedido({
          pedido: pagamento.pedido,
          tipo: "pagamento",
          situacao: situacao.status || "Situacao",
          payload: situacao
        });
        pagamento.status = situacao.status;
        await pagamento.save();
        await RegistroPedido.save();
      }

      return res.send({ success: true });

    } catch (err) {
      next(err)
    }
  }
}

module.exports = PagamentoController;