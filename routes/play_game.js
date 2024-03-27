const { Router } = require('express');
const path = require('path');

const router = Router();

//router has prefix /play, so this is /play/
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/play/play.html'));
});



module.exports = router;