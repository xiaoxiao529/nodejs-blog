//创建用户的表结构

let mongoose = require('mongoose');

var userSchema = new mongoose.Schema({

    //用户名
    username:String,

    //密码
    password:String

})

module.exports = userSchema;