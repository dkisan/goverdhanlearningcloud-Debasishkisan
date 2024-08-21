const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')

router.get('/getalluser', userController.getAllUsers)
router.get('/getuser', userController.getSingleUser)
router.get('/getchat/:recipientemail', userController.getChats)
router.post('/sendmsg', userController.postSendChat)
router.post('/updateuser', userController.postUpdateUser)
router.delete('/deleteuser', userController.deleteUser)

module.exports = router;
