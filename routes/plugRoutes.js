const express = require('express');
const router = express.Router();
const plugController = require('../controllers/plugController');

//  Plugs management
router.get('/', plugController.getAllPlugs);
router.post('/', plugController.addPlug);
router.put('/:id', plugController.updatePlug);
router.delete('/:id', plugController.deletePlug);

//  Control actions
router.get('/:id/on', plugController.turnOnPlug);
router.get('/:id/off', plugController.turnOffPlug);
router.get('/:id/status', plugController.getPlugStatus);

// api/plugs/:id/status

//  Connect plug to user
router.post('/connect', plugController.connectPlugToUser);

module.exports = router;