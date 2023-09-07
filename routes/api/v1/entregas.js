const router = require("express").Router();

const EntregaController = require("../../../controllers/EntregaController");

const { LojaValidation } = require("../../../controllers/validations/lojaValidation");
const Validation = require("express-validation")
const { EntregaValidation } = require("../../../controllers/validations/entregaValidation");
const auth = require("../../auth");

const entregaController = new EntregaController();

router.get("/:id", auth.required, Validation(EntregaValidation.show), entregaController.show);
router.put("/:id", auth.required, LojaValidation.admin, Validation(EntregaValidation.update), entregaController.update);
router.post("/calcular", Validation(EntregaValidation.calcular), entregaController.calcular);

module.exports = router;