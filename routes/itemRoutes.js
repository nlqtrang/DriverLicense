const express = require('express');

function createItemRouter(itemController) {
    const router = express.Router();

    router.get('/', itemController.getAllItems);
    router.get('/:id', itemController.getItemById);
    router.post('/', itemController.createItem);
    router.put('/:id', itemController.updateItem);
    router.delete('/:id', itemController.deleteItem);

    return router;
}

module.exports = createItemRouter;
