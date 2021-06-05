const express = require('express')
const router = express.Router()

const {requireSignIn, isAuth, isAdmin} = require('../../../user/controllers/auth')
const {userById, addOrderToUserHistory} = require('../../../user/controllers')
const {create, listOrders, getStatusValues, orderById, updateOrderStatus} = require('../controllers/order')
const {decreaseQuantity} = require('../controllers')


router.post('/order/create/',
    addOrderToUserHistory,
    decreaseQuantity,
    create
)
router.get('/order/list/:userId',
    requireSignIn,
    isAuth,
    isAdmin,
    listOrders
)
router.get('/order/status-values/:userId',
    requireSignIn,
    isAuth,
    isAdmin,
    getStatusValues
)
router.put('/order/:orderId/status/:userId',
    requireSignIn,
    isAuth,
    isAdmin,
    updateOrderStatus
)

router.param('userId', userById)
router.param('orderId', orderById)

module.exports = router
