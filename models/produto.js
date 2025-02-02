const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

const ProdutoSchema = Schema({
  titulo: { type: String, required: true },
  disponibilidade: {type: Boolean, default: true },
  descricao: { type: String, required: true },
  fotos: { type: Array, default: [] },
  preco: { type: Number, required: true },
  promocao: { type: Number },
  sku: { type: String, required: true },
  //relacionamentos dos models
  categoria: { type: Schema.Types.ObjectId, ref: "Categoria" },
  loja: { type: Schema.Types.ObjectId, ref: "Loja" },
  avaliacoes: { type: [{ type: Schema.Types.ObjectId, ref: "Avaliacoes"}] },
  variacoes: { type: [{ type: Schema.Types.ObjectId, ref: "Variacoes" }] }
}, { timestamps: true });

ProdutoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Produto", ProdutoSchema);