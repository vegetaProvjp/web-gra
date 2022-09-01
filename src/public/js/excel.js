let myData = [];

function getData() {
	$.ajax({
		url: 'http://localhost:9000/admin/api/orders',
		dataType: 'json',
		success: function (data) {
			console.log('getData', data);
			showData(data);
		},
	});
}

function showData(data) {

	// console.log(data);
	myData = data.map((d) => {
		var product = ''
		var obj = d.cart.items
		for (var id in obj) {
			product += `Sản phẩm: ${obj[id].item.name} - giá: ${obj[id]['price']}, số lượng:${obj[id]['qty']}
			<br></br>`
		}
		var date = new Date(d.createdAt)
		var month = date.getUTCMonth() + 1;
		var day = date.getUTCDate();
		var year = date.getUTCFullYear();
		var hour = date.getHours();
		var minute = date.getMinutes();
		if (hour < 10) { hour = "0" + hour; }
		if (minute < 10) { minute = "0" + minute; }
		var newDate = day + "/" + month + "/" + year + " " + hour + ":" + minute;
		console.log(newDate)
		return {
			_id: d?._id,
			name: d?.name,
			address: d?.address,
			phone: d?.phone,
			product: product,
			totalPrice: d?.cart?.totalPrice,
			status: d?.status,
			createdAt: newDate,
		};
	});
	console.log('myData', myData);
	let html =
		'<tr><td>ID đơn hàng</td><td>Tên người mua</td><td>Địa chỉ</td><td>Số điện thoại</td><td>Sản phẩm đã mua</td><td>Tổng số tiền</td><td>Trạng thái</td><td>Ngày mua</td></tr>';
	$.each(myData, function (key, value) {
		html += '<tr>';
		html += '<td>' + value?._id + '</td>';
		html += '<td>' + value?.name + '</td>';
		html += '<td>' + value?.address + '</td>';
		html += '<td>' + value?.phone + '</td>';
		html += '<td>' + value?.product + '</td>';
		html += '<td>' + value?.totalPrice + '</td>';
		html += '<td>' + value?.status + '</td>';
		html += '<td>' + value?.createdAt + '</td>';
		html += '</tr>';
		html += value?.product || 0
	});
	// console.log('html', html);
	$('table tbody').html(html);
}

function exportToExcel(fileName, sheetName, table) {
	getData()
	if (myData.length === 0) {
		console.error('Chưa có data');
		return;
	}
	console.log('exportToExcel', myData);

	let wb;
	if (table && table !== '') {
		wb = XLSX.utils.table_to_book($('#' + table)[0]);
	} else {
		const ws = XLSX.utils.json_to_sheet(myData);
		// ws["!cols"] = wscols;
		// console.log('ws', ws);
		wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, sheetName);
	}
	console.log('wb', wb);
	XLSX.writeFile(wb, `${fileName}.xlsx`);
}
