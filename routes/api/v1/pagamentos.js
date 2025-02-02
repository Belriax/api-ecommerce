const router= require("express").Router();

const PagamentoController = require("../../../controllers/PagamentoController");

const Validation = require("express-validation");
const { LojaValidation } = require("../../../controllers/validations/lojaValidation");
const { PagamentoValidation } = require("../../../controllers/validations/pagamentoValidation");
const auth = require("../../auth");

const pagamentoController = new PagamentoController();

// TESTE
if(process.env.NODE_ENV !== "production"){
  router.get("/tokens", (req, res) => res.render("pagseguro/index"));
}

// PAGSEGURO
router.post("/notificacao", pagamentoController.verNotificacao);
router.get("/session", pagamentoController.getSessionId);

// CLIENTE
router.get("/:id", auth.required, Validation(PagamentoValidation.show), pagamentoController.show);
router.post("/pagar/:id", auth.required, Validation(PagamentoValidation.pagar), pagamentoController.pagar);

// ADMIN
router.put("/:id", auth.required, LojaValidation.admin, Validation(PagamentoValidation.update), pagamentoController.update);

module.exports = router;