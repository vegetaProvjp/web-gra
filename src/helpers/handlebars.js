const Handlebars = require('handlebars');
module.exports = {
    sum: (a, b) => a + b,
    sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : 'default'
        const icons = {
            default: 'oi oi-elevator',
            asc: 'oi oi-sort-ascending',
            desc: 'oi oi-sort-descending'
        }
        const types = {
            default: 'desc',
            asc: 'desc',
            desc: 'asc',
        }

        const icon = icons[sortType]
        const type = types[sortType]

        const href = Handlebars.escapeExpression(`?_sort&column=${field}&type=${type}`)
        const output = `<a href="${href}"><span class="${icon}"></span></a>`
        return new Handlebars.SafeString(output)
    },
    titleCase: (str) => {
        str = str.toLowerCase().split(' ')
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
        }
        return str.join(' ')
    },
    currencyVND: (str) => {
        str = parseInt(str)
        str = str.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        return str
    },
    currencyNoVND: (str) => {
        str = parseInt(str)
        str = str.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        str = str.replace('VND', '')
        return str
    },
    multiple: (a, b) => a * b,
    sub: (a, b) => a * b,
    checkNull: (str) => {
        // if (str === null || str === undefined) {
        //     return false
        // }
        // return true
        return str !== null
    },
    convert_number: (str) => {
        return Number(str)
    },
    computeSale: (str, a) => {
        str = Number(str)
        var rs = str * (100 - a) / 100
        rs = rs.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        return rs
    },
    check_difNull: (str) => {
        // if (str === null || str === undefined) {
        //     return false
        // }
        // return true
        return str === null
    },
    check_pay: (str) => {
        if ((str == 0) || (str == null) || (str == undefined)) {
            return 'Thanh toán sau khi nhận hàng'
        }
        else {
            return 'Paypal'
        }
    },
    check_pay_en: (str) => {
        if ((str == 0) || (str == null) || (str == undefined)) {
            return 'COD'
        }
        else {
            return 'Paid via paypal'
        }
    },
    check_quantity: (str) => {
        return str !== 1
    },
    compare_zero: (str) => {
        return str !== 1
    },
    json: (str) => {
        return JSON.stringify(str)
    },
    compare0: (str) => {
        return str !== 0
    },
    checkUser: (str) => {
        if(str == 'admin' || str == 'superAdmin') return 1;
        return 0
    },
    handleDate: (str) => {
        var month = str.getUTCMonth() + 1; //months from 1-12
        var day = str.getUTCDate();
        var year = str.getUTCFullYear();
        var hour = str.getHours();
        var minute = str.getMinutes();
        if (hour < 10) { hour = "0" + hour; }
        if (minute < 10) { minute = "0" + minute; }
        var newDate = hour + ":" + minute + " " + day + "/" + month + "/" + year;
        return newDate
    },
    handleDate2: str => {
        var month = str.getUTCMonth() + 1; //months from 1-12
        var day = str.getUTCDate();
        var year = str.getUTCFullYear();
        var hour = str.getHours();
        var minute = str.getMinutes();
        if (hour < 10) { hour = "0" + hour; }
        if (minute < 10) { minute = "0" + minute; }
        var newDate = day + "/" + month + "/" + year + " " + hour + ":" + minute;
        return newDate
    },
    handleOnlyDate: str => {
        var month = str.getUTCMonth() + 1; //months from 1-12
        var day = str.getUTCDate();
        var year = str.getUTCFullYear();
        var newDate = day + "/" + month + "/" + year;
        return newDate
    },

    handleGender: str => {
        if (str == false) {
            return 'Male'
        }
        else {
            return 'Female'
        }
    },

    eq: (a, b) => {
        return a == b
    },

    checkRole: str => {
        if (str == 'superAdmin') {
            return true
        }
        else return false
    }
}