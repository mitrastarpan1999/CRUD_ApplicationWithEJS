const express = require('express')

const Router = express.Router();

const homeController = require('../controller/home.controller')
const userController = require('../controller/user.controller')
const upload = require('../utils/multer')
Router.get('/', homeController.home)

Router.get('/list', userController.list)
Router.get('/user/create', userController.create)
Router.post('/user/create', upload.single('image'),userController.createUser)
Router.get('/user/edit/:id', userController.edit)
Router.post('/user/edit/:id', upload.single('image'),userController.updatePage)
Router.get('/user/delete/:id',userController.recycleBin)
Router.get('/recycle',userController.recycleBinPage)
Router.get('/restore/:id',userController.restore)
Router.get('/hardDelete/:id',userController.hardDelete)
// Router.get('/view/:id',userController.view)




module.exports = Router