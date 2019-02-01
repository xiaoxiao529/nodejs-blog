//分类数据结构

let mongoose = require('mongoose');

let categorySchema = new mongoose.Schema({

    //分类名称
    categoryName :String

})

module.exports = categorySchema