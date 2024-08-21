const express = require('express')
const router = express.Router()
const authController = require('../controller/authController')

// const userController = require('../controller/userController')

// router.post('/signup',userController.postSignup)
// router.post('/login',userController.postLogin)

router.post('/signup',authController.postSignup)
router.post('/login',authController.postLogin)

module.exports = router;
