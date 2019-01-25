let express = require('express');

let router = express.Router(); // 引入router

router.get('/',(req,res,next)=>{
    res.send('admin')
})

module.exports = router;