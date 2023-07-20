const router = require("express").Router();
const lojaValidation = require("../../../controllers/validations/lojaValidation");
const auth = require("../../auth");
const LojaController = require("../../../controllers/LojaController");

const lojaController = new LojaController();

router.get("/", lojaController.index); // testado
router.get("/:id", lojaController.show);// testado

router.post("/", auth.required, lojaController.store);// testado
router.put("/:id", auth.required, lojaValidation, lojaController.update);
router.delete("/:id", auth.required, lojaValidation, lojaController.remove);

module.exports = router;