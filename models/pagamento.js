const mongoose = require("mongoose"),
  mongoosePaginate = require("mongoose-paginate-v2"),
  Schema = mongoose.Schema;

  const PagamentoSchema = Schema({
    valor: { type: Number, required: true },
    forma: { type: String, required: true },
    parcelas: { type: Number, default: 1 },
    endereco: {
      type: {
        local: { type: String, required: true },
        numero: { type: String, required: true },
        complemento: { type: String },
        bairro: { type: String, required: true },
        cidade: { type: String, required: true },
        estado: { type: String, required: true },
        CEP: { type: String, required: true },
      },
      required: true
    },
    cartao: {
      type: {
        nomeCompleto: { type: String, required: true },
        codigoArea: { type: String, required: true },
        telefone: { type: String, required: true },
        dataNascimento: { type: String, required: true },
        credit_card_token: { type: String, required: true },
        cpf: { type: String, required: true },
      }
    },
    enderecoEntregaIgualCobranca: { type: Boolean, default: true },
    status: { type: String, required: true },
    pedido: { type: Schema.Types.ObjectId, ref: "Pedido", required: true },
    loja: { type: Schema.Types.ObjectId, ref: "Loja", required: true },
    payload: { type: Array },
    pagSeguroCode: { type: String }
  }, { timestamps: true });

  PagamentoSchema.plugin(mongoosePaginate);

  module.exports = mongoose.model("Pagamento", PagamentoSchema);