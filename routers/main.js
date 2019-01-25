let express = require('express');

let router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('main/index');  //由于已经在app.js配置了模板的使用，所以这里无需考虑路径问题了
    //res.send('首页')
})

module.exports = router