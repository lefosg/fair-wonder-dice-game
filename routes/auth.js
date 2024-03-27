const { Router } = require('express');
const path = require('path');

const router = Router();

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth/login.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/auth/register.html'));
});



module.exports = router;