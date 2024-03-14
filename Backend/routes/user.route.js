const express = require(`express`)

const app = express()

app.use(express.json())

const userController = require(`../controllers/user.controller`)
const { verifyPasswordMiddleware } = require('../controllers/user.controller');
const {authorization} = require(`../controllers/auth.controller`)

app.get(`/user`, authorization(["Admin", "User", "Engineer"]), userController.getUser)

app.post(`/user`, authorization(["Admin", "User", "Engineer"]), userController.addUser)

app.post(`/user/find`, authorization(["Admin", "User", "Engineer"]), userController.findUser)

app.put(`/user/:id_user`, authorization(["Admin", "User", "Engineer"]), userController.updateUser)

app.delete('/user/:id_user', authorization(["Admin", "User", "Engineer"]), userController.verifyPasswordMiddleware, userController.deleteUser);

app.post('/user/verify/:id_user', authorization(["Admin", "User", "Engineer"]), verifyPasswordMiddleware, userController.verifyPassword);

module.exports = app