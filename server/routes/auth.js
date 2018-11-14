/* Dependencies */
var users = require('../controllers/users.server.controller.js'),
    express = require('express'),
    app = require('../config/app')
    router = express.Router();


router.route('/login')
    .post(users.loginUser);

router.route('/register')
    .post(users.registerUser);

router.route('/logout')
    .get(users.logoutUser);
