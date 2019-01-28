let express = require('express');

let router = express.Router(); // 引入router

let user = require('../models/User.js')

router.use((req,res,next)=>{
    if(!req.userCookie.isAdmin){  //!false就是true
        res.send('抱歉，只有管理员才可以登录管理后台！');
        return;
    }
    next()
})

/*首页*/
router.get('/',(req,res,next)=>{
    //res.send('admin')
    res.render('admin/index',{
        userCookie:req.userCookie
    })
})


/*
* 用户管理
* */
router.get('/user',function (req,res,next) {
    user.find().then(function (data) {
        console.log(data)
    })
    res.render('admin/user_index.html',{
        userCookie:req.userCookie,
    })
})

module.exports = router;