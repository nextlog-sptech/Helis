var express = require('express');
var router = express.Router();

var funcionarioController = require('../controllers/funcionarioController');

router.get('/', function (req, res) {
    funcionarioController.listar(req, res);
});

router.post('/', function (req, res) {
    funcionarioController.cadastrar(req, res);
});

router.put('/:id', function (req, res) {
    funcionarioController.editar(req, res);
});

router.delete('/:id', function (req, res) {
    funcionarioController.excluir(req, res);
});

module.exports = router;
