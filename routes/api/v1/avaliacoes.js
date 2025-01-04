const router = require("express").Router();

const AvaliacaoController = require("../../../controllers/AvaliacaoController");

const { LojaValidation } = require("../../../controllers/validations/lojaValidation");
const Validation = require("express-validation");
const { AvaliacaoValidation } = require("../../../controllers/validations/avaliacaoValidation");
const auth = require("../../auth");

const avaliacaoController = new AvaliacaoController();

// CLIENTES/VISITANTE
router.get("/", Validation(AvaliacaoValidation.index), avaliacaoController.index);
router.get("/:id", Validation(AvaliacaoValidation.show), avaliacaoController.show);
router.post("/", auth.required, Validation(AvaliacaoValidation.store), avaliacaoController.store);

// ADMIN
router.delete("/:id", auth.required, LojaValidation.admin, Validation(AvaliacaoValidation.remove), avaliacaoController.remove);

module.exports = router;