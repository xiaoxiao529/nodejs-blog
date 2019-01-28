let express = require('express');

let app = express();

let router = express.Router(); // 引入router

//加载模型类，对用户名进行增删改查
let User = require('../models/User');

//默认response返回给前端的信息
let responseData = null;

//console.log('外面');

router.use(function(req,res,next){    //所有的请求都会走这个中间件，即这个设置全局通用
    //console.log('里面')
    responseData = {
        code:0,
        msg:''
    }
    next();
})

/*
* 用户注册
*   注册逻辑
*
*   1.用户名不能为空
*   2.密码不能为空
*   3.两次输入密码必须一致
*
*   1.用户是否已经被注册了
*       数据库查询
*
* */
router.post('/user/register',(req,res,next)=>{

    let username = req.body.username;
    let password = req.body.password;
    let repassword = req.body.repassword;

    //用户名不能为空
    if(username == ''){
        responseData.code = 1;
        responseData.mag = '用户名不能为空';
        res.json(responseData);  //将responseData对象转为json格式，返回给前端
        return;
    }

    //密码不能为空
    if(password == ''){
        responseData.code = 2;
        responseData.msg = '密码不能为空';
        res.json(responseData);
        return;
    }

    //两次密码不一致
    if(password != repassword){
        responseData.code = 3;
        responseData.msg = '两次密码不一致';
        res.json(responseData);
        return;
    }

    //用户名是否已经被注册了，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
    User.findOne({
        username:username
    }).then(( userInfo )=>{

        //表示数据库中有该记录
        if(userInfo){
            responseData.code = 4;
            responseData.msg = '用户名已经存在';
            res.json(responseData);
            return;
        }

        //否则，表示注册成功，保存用户信息到数据库
        new User({  //User是一个Model，只有先实例化了才能使用save方法
            username:username,
            password:password
        }).save((err,doc)=>{
            if(err){
                console.log("error :" + error);
            }else{
                //注册成功
                responseData.code = 0 ;
                responseData.msg = '注册成功';
                responseData.username = username;
                res.json(responseData);
                return;
            }
        })
    })


})

router.post('/user/login',function(req,res,next){
    let username = req.body.username;
    let password = req.body.password;

    if(username == '' || password == ''){
        responseData.code = 1;
        responseData.msg = '用户名或密码不能为空！';
        res.json(responseData);
        return;
    }

    //查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
    User.find({  //这里用的是find，不是findOne
        username:username,
        password: password
    },function(err,doc){
        if(err){
            console.log(err)
            return;
        }else{
            if(!doc.length){  //如果数据库没匹配到(即用户名密码查找失败)，doc返回的是空数组，Boolean([])返回的是true
                responseData.code = 2;
                responseData.msg = '用户名或者密码错误';
                res.json(responseData);
                return;
            }
            responseData.msg = '登录成功';
            responseData.userInfo = {
                _id : doc[0]._id,
                username : doc[0].username
            }
            //存cookie  登录的时候(请求的时候)存进来
            req.cookies.set('userCookie',JSON.stringify({
                _id : doc[0]._id,
                username : doc[0].username
            }));
            res.json(responseData);
            return;
        }

    })
})

//退出接口
router.get('/user/logout',function (req,res) {
    req.cookies.set('userCookie',null);
    res.json(responseData);
})

module.exports = router;