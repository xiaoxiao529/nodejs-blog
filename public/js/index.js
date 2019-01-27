$(function(){

    let loginBox = $('#loginBox');
    let registerBox = $('#registerBox');
    let loginedBox = $('#loginedBox');
    let registerBtn = registerBox.find('button');
    let loginBtn = loginBox.find('button');

    loginBox.find('.colMint').on('click',function(){
        loginBox.hide();
        registerBox.show();
    })
    registerBox.find('.colMint').on('click',function(){
        loginBox.show();
        registerBox.hide();
    })
    registerBtn.on('click',function(){
        let username = registerBox.find("input[name='username']").val();
        let password = registerBox.find("input[name='password']").val();
        let repassword = registerBox.find("input[name='repassword']").val();
        $.ajax({
            url : '/api/user/register',  // /api/user/register 对应api.js下面的路由：user/register  http://localhost:8888/api/user/register
            type : "post",
            dataType : "json",
            data : {
                username:username,
                password:password,
                repassword:repassword
            },
            cache : false,
            async : false,
            success : function(data) {
                registerBox.find(".colWarning").html(data.msg);
                if(!data.code){
                    loginBox.show();
                    registerBox.hide();
                }
            },
            error : function(err) {
                console.log(err)
            }
        });
    })

    loginBtn.on('click',function(){
        let  username = $('#loginBox').find("input[name='username']").val();
        let password = $("#loginBox").find("input[name='password']").val();
        $.ajax({
            url : '/api/user/login',
            type : "post",
            dataType : "json",
            data : {
                username:username,
                password:password
            },
            cache : false,
            async : false,
            success : function(data) {
                console.log(data)
                loginBox.find(".colWarning").html(data.msg);

                if(!data.code){
                    //登录成功之后，不用再通过js控制登录注册等框的显示隐藏了，通过模板文件来动态渲染
                    /*setTimeout(function(){
                        loginedBox.show();
                        loginBox.hide();
                        loginedBox.find('.username').html(data.userInfo.username);
                        loginedBox.find('.welcomeInfo').html('欢迎光临我的博客！');
                    },500)*/
                    window.location.reload();
                }
            },
            error : function(err) {
                console.log(err)
            }
        });
    })

    //退出，发送一个ajax请求，告诉服务器清空cookies
    $('#logoutBtn').on('click',function () {
        $.ajax({
            type:'get',
            url:'/api/user/logout',
            success:function (data) {
                console.log(data)
                if(!data.code){
                    window.location.reload();
                }
            }
        })
    })

})