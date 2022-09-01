const userinfo = require('./userinfo');
const Account = require('../app/models/Account')
const Category = require('../app/models/Category')
const mongoose = require('mongoose');
const Product = require('../app/models/products')
const FuzzySearch = require('fuzzy-search');
const fetch = require('node-fetch')
const xlsx = require('xlsx');
const path = require('path');

const exportExcel = (data, workSheetColumnNames, workSheetName, filePath) => {
    const workBook = xlsx.utils.book_new();
    const workSheetData = [
        workSheetColumnNames,
        ... data
    ];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filePath));
}

const exportUsersToExcel = (users, workSheetColumnNames, workSheetName, filePath) => {
    const data = users.map(user => {
        return [user.id, user.name, user.age];
    });
    exportExcel(data, workSheetColumnNames, workSheetName, filePath);
}
const getUser = async (req) => {
    try {
        let userID = userinfo(req);
        const rs = await Account.findOne({ _id: userID })
        return rs
    } catch (error) {
        console.log(error)
    }
}
const getProduct = async (req) => {
    try {
        return await Product.find({})
    } catch (error) {
        console.log(error)
    }
}
//tim kiem
const searchProduct = async (req) => {
    try {
        let userID = userinfo(req);
        let category = req.body.category;
        let userQuery = {
            user: { $ne: mongoose.Types.ObjectId(userID) },
        }
        let productQuery = {};
        let categoryQuery = {};

        if (category && category !== "") {
            categoryQuery = {
                "category.title": category
            }
        }
        let cate = Category.find({ slug: category })
        let rs = await Product.aggregate()
            .lookup({
                from: "category",
                localField: "category",
                foreignField: "_id",
                as: "category"
            })
            .match(categoryQuery)
            .sort({ "name": 1 })
        return rs;
    } catch (error) {
        console.log(error)
    }
}
const sortAZ = function (product){
    // let rs = await Product.aggregate()
    //     .sort({ "name_english": 1 })
    // return rs;
    let rs = product.sort((a, b) => {
        var name1 = a.name;
        var name2 = b.name;

        if (name1.localeCompare(name2) < 0)
            return -1;
        else if (name1.localeCompare(name2) > 0)
            return 1;
        else if (name1.localeCompare(name2) == 0)
            return 0;
    })
    return rs
}
const sortZA = function (product) {

    let rs = product.sort((a, b) => {
        var name1 = a.name;
        var name2 = b.name;

        if (name1.localeCompare(name2) > 0)
            return -1;
        else if (name1.localeCompare(name2) < 0)
            return 1;
        else if (name1.localeCompare(name2) == 0)
            return 0;
    })
    return rs
}
const sortPriceAsc = function (product) {
    // let rs = await Product.aggregate()
    //     .sort({ price: 1 })
    //     .collation({ locale: "en_US", numericOrdering: true })
    // return rs;
    let rs = product.sort((a, b) => {
        var price1 = a.price;
        var price2 = b.price;

        if (price1.localeCompare(price2) < 0)
            return -1;
        else if (price1.localeCompare(price2) > 0)
            return 1;
        else if (price1.localeCompare(price2) == 0)
            return 0;
    })
    return rs
}
const sortPriceDesc = async (req) => {
    // let rs = await Product.aggregate()
    //     .sort({ price: -1 })
    //     .collation({ locale: "en_US", numericOrdering: true })
    // return rs;

}

const sortPriceDesc2 = function (product) {
    let rs = product.sort((a, b) => {
        var price1 = a.price;
        var price2 = b.price;

        if (price1.localeCompare(price2) > 0)
            return -1;
        else if (price1.localeCompare(price2) < 0)
            return 1;
        else if (price1.localeCompare(price2) == 0)
            return 0;
    })
    return rs
}
const getCategory = async (req) => {
    try {
        let cat = await Category.find({})
        return cat
    } catch (error) {
        console.log(error)
    }
}

const getApiTest = async () => {
    fetch('http://localhost:9000/product/api-search-product/áo-polo-nam')
    .then((response) => response.json())
    .then(data => {
        return data
    })
    
}
const escapeRegex = text => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}
module.exports = { getUser, searchProduct, sortAZ, sortZA, sortPriceAsc, sortPriceDesc, sortPriceDesc2, getCategory, escapeRegex, removeVietnameseTones, getApiTest, exportUsersToExcel };