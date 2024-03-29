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

// const exportOrdersToExcel = async (orders, workSheetColumnNames, workSheetName, filePath) => {
//     var orders = await Orders.find({})
//     orders = JSON.parse(order)
//     const data = orders.map(order => {
//         return [order._id, order.address, order.name];
//     });
//     exportExcel(data, workSheetColumnNames, workSheetName, filePath);
// }

module.exports = exportUsersToExcel;