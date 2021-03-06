const express = require('express')
const router = express.Router()
const {requireSignIn, isAuth, isAdmin} = require('../../user/controllers/auth')
const {userSignupValidator} = require('../../../utils/validator')
const {userById} = require('../controllers')
const {
    verificationTokenByHex,
    create,
    remove,
    verify,
    resend,
    read
} = require('../controllers/verificationToken')


router.post(
    '/verification-token/create/:userId',
    requireSignIn,
    isAuth,
    create
)
router.put(
    '/resend-verification-token/:userId',
    requireSignIn,
    isAuth,
    resend
)

// router.get('/verification-token/by/id/:token', read)


router.get(
    '/verification-token/verify/:token',
    requireSignIn,
    // isAuth,
    verify
)

router.delete('/verification-token/:token/:userId',
    requireSignIn,
    isAuth,
    remove
)

router.param('userId', userById)
router.param('token', verificationTokenByHex)

module.exports = router

