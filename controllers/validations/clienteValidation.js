const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

const ClienteValidation = {
  index: {
    query:{
      offset: Joi.number(),
      limit: Joi.number()
    }
  },
  searchPedidos: {
    query: {
      offset: Joi.number(),
      limit: Joi.number()
    },
    params:{
      search: Joi.string().required()
    }
  },
  search: {
    query: {
      offset: Joi.number(),
      limit: Joi.number()
    },
    params:{
      search: Joi.string().required()
    }
  },
  showAdmin: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  showPedidosCliente: {
    params: {
      id: Joi.string().alphanum().length(24).required()
    }
  },
  updateAdmin: {
    query:{
      offset: Joi.number(),
      limit: Joi.number()
    },
    params:{
      id: Joi.string().alphanum().length(24).required()
    },
    body: {
      nome: Joi.string().optional(),
      cpf: Joi.string().length(14).optional(),
      email: Joi.string().email().optional(),
      telefones: Joi.array().items(Joi.string()).optional(),
      endereco: Joi.object({
        local: Joi.string().required(),
        numero: Joi.string().required(),
        complemento: Joi.string().allow("").optional(),
        bairro: Joi.string().required(),
        cidade: Joi.string().required(),
        estado: Joi.string().required(),
        CEP: Joi.string().required()
      }).optional(),
      dataNascimento: Joi.date().format("YYYY-MM-DD").raw().optional()
    }
  },
  show: {
    query:{
      loja: Joi.string().alphanum().length(24).required()
    }
  },
  store: {
    query:{
      loja: Joi.string().alphanum().length(24).required()
    },
    body: {
      nome: Joi.string().required(),
      password: Joi.string().required(),
      cpf: Joi.string().length(14).required(),
      email: Joi.string().email().required(),
      telefones: Joi.array().items(Joi.string()).required(),
      endereco: Joi.object({
        local: Joi.string().required(),
        numero: Joi.string().required(),
        complemento: Joi.string().allow("").optional(),
        bairro: Joi.string().required(),
        cidade: Joi.string().required(),
        estado: Joi.string().required(),
        CEP: Joi.string().required()
      }).required(),
      dataNascimento: Joi.date().format("YYYY-MM-DD").raw().optional()
    }
  },
  update: {
    query:{
      loja: Joi.string().alphanum().length(24).required()
    },
    params:{
      id: Joi.string().alphanum().length(24).required()
    },
    body: {
      nome: Joi.string().optional(),
      password: Joi.string().optional(),
      cpf: Joi.string().length(14).optional(),
      email: Joi.string().email().optional(),
      telefones: Joi.array().items(Joi.string()).optional(),
      endereco: Joi.object({
        local: Joi.string().required(),
        numero: Joi.string().required(),
        complemento: Joi.string().allow("").optional(),
        bairro: Joi.string().required(),
        cidade: Joi.string().required(),
        estado: Joi.string().required(),
        CEP: Joi.string().required()
      }).optional(),
      dataNascimento: Joi.date().format("YYYY-MM-DD").raw().optional()
    }
  }
};

module.exports = {ClienteValidation};