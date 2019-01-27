/*
* 应用程序的启动（入口）文件
* */

//加载express模块
let express = require("express");

//加载swig模板处理模块
let swig = require('swig');

//加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');

//加载cookies模块
let cookies = require('cookies');

//创建app应用 =>等价于 原生NodeJS Http.createServer();
let app = express();

app.use('/public',express.static(__dirname+'/public')); // /public/js/index.js 前面加上/public就可以访问下面的静态文件

//bodyparser设置
app.use( bodyParser.urlencoded({extended: true}) );

//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件存放的目录，第一个参数必须是views，第二个参数是目录
var path = require('path');
app.set('views', path.join(__dirname, 'views'));
//app.set('views', './views');
//注册所使用的模板引擎，第一个参数必须是 view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称（第一个参数）是一致的
app.set('view engine', 'html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

//定义cookies中间件  只要用户访问本网站，都会走这个中间件，执行后面的回调函数
app.use(function (req,res,next) {
    req.cookies = new cookies(req,res);  //得到对象req.cookies，这个对象下面有set和get方法

    //在这个中间件里面取客户端的cookie，定义全局变量，用于存cookies
    req.userCookie = {};
    if(req.cookies.get('userCookie')){
        req.userCookie = JSON.parse(req.cookies.get('userCookie'));
    }
    //console.log(typeof req.cookies.get('userCookie'))  //string
    next();
});


// app.get('/',(req,res,next)=>{
//     //res.send('<h1>welcome</h1>')
//     res.render('main/index')
// })
// 这两种方法都可以加载对应的路由，模板文件也可以作为一个路由文件
// app.use('/',(req,res,next)=>{
//     //res.send('<h1>welcome</h1>')
//     res.render('main/index')
// })

app.use('/admin',require('./routers/admin'));  //请求admin.js，当url匹配都/admin，就会请求./router/admin这个下面的admin.js文件
app.use('/api',require('./routers/api'));  //请求api.js
app.use('/',require('./routers/main'));  //请求main.js


//加载mongoose模块
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//链接数据库
mongoose.connect('mongodb://localhost:27017/db',{useMongoClient:true},function(err){
    if(err){
        console.log('数据库连接失败')
    }else{
        console.log('数据库连接成功')
        var server = app.listen(8888, function(){
            console.log("Server is running on http://localhost:8888");
        });
    }
});

