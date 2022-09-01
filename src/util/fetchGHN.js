var fetch = require('node-fetch');
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'token': '25906f71-1ac1-11ed-ad26-3a4226f77ff0',
            'shop_id': 3171806,

        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}
// Cửa hàng ở Hà Nội
var province2G = 'Hà Nội'
var district2G = 'Quận Hà Đông' //1542
//Nơi người nhận ở
var provinceG = 'Ninh Bình'
var districtG = 'Huyện Nho Quan' //3247
var wardG = 'Xã Đồng Phong'

//Tỉnh
var fetchProvince = async (name) => {
    try {
        var data = await postData('https://online-gateway.ghn.vn/shiip/public-api/master-data/province')
        var provinceAPI = data.data
        var a
        for (var i = 0; i < provinceAPI.length; i++) {
            if (provinceAPI[i].NameExtension.includes(name)) {
                a = provinceAPI[i].ProvinceID
            }
        }
        return a
    }catch(err) {
        console.log(err)
    }
}

//Huyện
var fetchDistrict = async (district, province) => {
    return fetchProvince(province).then(async (id) => {
        var data = await postData('https://online-gateway.ghn.vn/shiip/public-api/master-data/district', { province_id: id });
        districtAPI = data.data
        for (var i = 0; i < districtAPI.length; i++) {
            if (districtAPI[i].DistrictName == district) {
                return districtAPI[i].DistrictID
            }
        }
    })
}
// fetchProvince('Hà Nội').then(a => console.log(JSON.stringify(a)))

//Xã
var fetchWard = async (ward, district) => {
    return fetchDistrict(district).then(async (id) => {
        var data = await postData('https://online-gateway.ghn.vn/shiip/public-api/master-data/ward', { district_id: id })
        wardAPI = data.data
        for (var i = 0; i < wardAPI.length; i++) {
            if (wardAPI[i].WardName == ward) {
                return wardAPI[i].WardCode
            }
        }
    })
}

var getService = async (district, province) => {
    let response = await Promise.all([
        fetchDistrict(district, province),
        fetchDistrict(district2G, province2G),
    ])
    var data = await postData('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services', {
        "shop_id": 3171806,
        "from_district": response[0],
        "to_district": response[1],
    })
    var getAPI = data.data
    var a
    for (var i = 0; i < getAPI.length; i++) {
        if (getAPI[i].short_name == "Đi bộ") {
            a = getAPI[i].service_id
        }
    }
    return a
}


//Tính Phí
var getFee = async (ward, district, province) => {

    var response = await Promise.all([
        fetchDistrict(district, province),
        fetchDistrict(district2G, province2G),
        fetchWard(ward, district),
        getService(district, province)
    ])
    var data = await postData('https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee', {
        'from_district_id': response[0],
        'to_district_id': response[1],
        'to_ward_code': response[2],
        "service_id": response[3],
        "insurance_value": 500000,
        "coupon": null,
        "height": 10,
        "length": 20,
        "weight": 1000,
        "width": 20,

    })
    return data
}

module.exports = {fetchProvince, fetchDistrict, fetchWard, getService, getFee}