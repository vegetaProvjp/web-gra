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
    titleCase: (str)=> {
        str = str.toLowerCase().split(' ')
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1)
        }
        return str.join(' ')
    },
    currencyVND: (str) => {
        str = parseInt(str)
        str = str.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        return str
    }
    
}