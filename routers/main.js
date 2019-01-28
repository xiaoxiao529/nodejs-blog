let express = require('express');

let router = express.Router();

router.get('/',(req,res,next)=>{
    res.render('main/index',{  //第二个参数表示传递给模板的数据，在模板里面可以使用userCookie这个变量
        userCookie : req.userCookie
    });  //由于已经在app.js配置了模板的使用，所以这里无需考虑路径问题了
    //res.send('首页')

})



module.exports = router