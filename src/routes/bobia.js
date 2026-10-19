const express = require("express");
const router = express.Router();
const bobiaController = require("../controllers/bobiaController");

router.post("/perguntar", bobiaController.perguntar);

module.exports = router;
