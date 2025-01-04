const mongoose = require("mongoose");

const LojaSchema = mongoose.Schema({
  nome: { type: String, required : true},
  cnpj:{ type: String, required: true, unique: true},
  email: { type: String },
  telefones: { 
    type:[{type: String}]
  },
  endereco: {
    type: { 
      local: { type: String, required: true }, 
      numero: { type: String, required: true },
      complemento: { type: String },
      bairro: { type: String, required: true },
      cidade: {type: String, required: true },
      CEP: { type: String, required: true }
    },
    required: true
  }
}, {timestamps: true});

// LojaSchema.plugin(uniqueValidator, { message: "Já está sendo utilizado!"});
LojaSchema.pre("save", async function(next) {
  const existeLoja = await mongoose.models.Loja.findOne({cnpj: this.cnpj});
  if(existeLoja) {
    const error = new Error("CNPJ já está sendo utilizado!");
    error.name = "ValidationError";
    return next(error);
  }
  next();
})

module.exports = mongoose.model("Loja", LojaSchema);