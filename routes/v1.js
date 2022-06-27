const express = require('express')
const productController = require('../controllers/productcontroller')
const router = express.Router()
const userController = require('../controllers/userController')
const {protect , admin} = require('../middelware/Athu')
//user route
router.post('/register' , userController.Signup)
router.post('/login' , userController.Login)
router.get('/profile' , protect,  userController.Profile)
router.put('/profile' , protect,  userController.UpdateProfile)

// products route 
router.get('/' , productController.Getallproducts)
router.get('/:id' , productController.SingleProduct)

module.exports = router 