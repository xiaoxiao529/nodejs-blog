let express = require('express');

let router = express.Router(); // 引入router

let User = require('../models/User')

let Category = require('../models/Category');

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

    /*
    * 从数据库中读取所有的用户数据
    *
    * limit(Number) : 限制获取的数据条数
    *
    * skip(2) : 忽略数据的条数
    *
    * 每页显示2条
    * 1 : 1-2 skip:0 -> (当前页-1) * limit
    * 2 : 3-4 skip:2
    * */


    var page = Number(req.query.page || 1) ;  //当前页，通过query查询url来获取
    var limit = 2;  //每页显示2条
    //找出所有的数据，在这个基础上使用skip、limit进行限制性输出
    var pages = 0;  //总页数

    User.count().then(function (count) {  //count参数获取到了数据总条数

        pages = Math.ceil(count/limit);  //3.5表示有4页
        page = Math.min(page,pages);  //当前页不能超过总页数
        page = Math.max(page,1);  //当前页数不能小于1
        var skip = (page-1)*limit;  //根据当前页，确定跳过skip条数据不展示，保证每到新的一页只显示最新的limit条数据，展示过的数据跳过不展示
        User.find().skip(skip).limit(limit).then(function (data) {

            res.render('admin/user_index.html',{
                userCookie:req.userCookie,
                userInfoList:data,
                page:page,
                pages:pages,
                limit:limit,
                count:count

            })

        })
    })

})

/*
* 分类首页
* */
router.get('/category_index',function (req,res) {
    var limit = 2;
    var page = Number( req.query.page || 1 );  //当前页



    Category.count().then(function (count) {
        var pages = Math.ceil(count/limit);  //总页数
        page = Math.min(page,pages);
        page = Math.max(1,page);
        var skip = (page-1)*limit;  //每次跳几条数据不显示呢，根据当前页来定
        Category.find().skip(skip).limit(limit).then(function (categoryInfoList) {
            res.render('admin/category_index.html',{
                userCookie:req.userCookie,
                categoryInfoList:categoryInfoList,
                limit:limit,
                page:page,
                pages:pages,
                count:count
            })
        })
    })




})

/*
* 分类的添加
* */
router.get('/category_add',function (req,res) {
    res.render('admin/category_add.html',{
        userCookie:req.userCookie
    })
})


/*
* 分类的保存
* */
router.post('/category_add',function (req,res) {  //提交保存还是在当前页，点击按钮发现路由还是/category_add，就会走下面的逻辑
    //所以，form表单的action可以不用写了，因为还是在当前页
    let categoryName = req.body.categoryName || '';

    if(categoryName == ''){
        res.render('admin/error',{
            message:'分类名称不可为空',
            userCookie:req.userCookie
        });
        return;
    }


    //没找到就要存
    Category.findOne({
        categoryName:categoryName
    }).then((data)=>{

        //分类存在
        if(data){
            res.render('admin/error',{
                message:'分类已经存在',
                userCookie:req.userCookie
            });
            //return Promise.reject();  //这里保证不走到下面的保存成功promise

        }else{
            //保存到数据库
            new Category({
                categoryName:categoryName
            }).save((err,doc)=>{
                if(err){
                    console.log(err)
                    return;
                }else{
                    res.render('admin/success',{
                        message:'分类保存成功',
                        userCookie:req.userCookie
                    })
                }
            });

        }
    })
})

/*
* 分类的修改，点击修改链接到修改分类页面,get方式，点击a链接会第一次跳到/category_edit页面，a链接默认是get请求
* */

router.get('/category_edit',function (req,res) {
    var id = req.query.id || '';
    Category.findOne({
        _id:id  //数据库里的是_id
    }).then(function (data) {
        if(!data){
            res.render('admin/error',{
                message:'分类不存在',
                userCookie:req.userCookie
            })
        }else{
            res.render('admin/category_edit',{
                userCookie:req.userCookie,
                categoryName:data.categoryName
            })
        }
    })

})

/*
* 具体进行修改的过程及保存，post方法，因为要通过表单提交，保存还是在/category_edit页面执行，因为这个页面里面的form表单的提交方式是post，
* 所以会走这个router，form表单不需要加action了
* */
router.post('/category_edit',function (req,res) {

    var id = req.query.id || '';
    var categoryName = req.body.categoryName || '';

    Category.findOne({
        _id:id
    }).then(function (category) {
        if(!category){
            res.render('admin/error',{
                userCookie:req.userCookie,
                message:'分类不存在'
            })
            return;
        }else{
            if(categoryName == category.categoryName){  //没改也是提示保存成功
                res.render('admin/success',{
                    userCookie:req.userCookie,
                    message:'分类修改成功'
                })
                return Promise.reject();
            }else{
                return Category.findOne({
                    //_id:id,
                    _id: {$ne: id},
                    categoryName:categoryName
                })
            }

        }
    }).then(function (sameCategory) {
        if(sameCategory){
            res.render('admin/error',{
                userCookie:req.userCookie,
                message:'数据库中已经存在同名分类'
            })
            return Promise.reject();
        }else{
            Category.update({_id:id},{categoryName:categoryName},function (error) {
                if(error){
                    console.log(err)
                }else{
                    res.render('admin/success',{
                        userCookie:req.userCookie,
                        message:'修改成功'
                    })
                }
            })
        }
    }).catch(function (err) {
        console.log(err)
    })

})

module.exports = router;