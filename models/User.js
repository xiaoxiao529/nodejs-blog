//这里面是对用户表进行操作的模型

//

let mongoose = require('mongoose');

let userScheam = require('../schemas/user');

module.exports = mongoose.model('User',userScheam);  //User是给这个模型起的名字，后面是要操作的那个表的表名

