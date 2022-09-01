// $.fn.dataTable.ext.order.intl("vi");
// $.fn.DataTable.ext.type.search.string = function (data) {
//   return !data
//     ? ""
//     : typeof data === "string"
//     ? data
//         .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
//         .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
//         .replace(/ì|í|ị|ỉ|ĩ/g, "i")
//         .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
//         .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
//         .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
//         .replace(/đ/g, "d")
//         .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
//         .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
//         .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
//         .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
//         .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
//         .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
//         .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
//         .replace(/Đ/g, "D")
//     : data;
// };
// $(document).ready(function () {
//   var tabla = $("#dataTable").DataTable({
//     language: {
//       url: "https://cdn.datatables.net/plug-ins/1.12.1/i18n/vi.json",
//     },
//   });
//   jQuery('#dataTable-table_filter input').keyup( function () {
//     table
//       .search(
//         jQuery.fn.DataTable.ext.type.search.string( this.value )
//       )
//       .draw();
//   } );
// });


$(document).on('click', ".open-edit", function () {
  let nameProduct = $(this).data('name')
  let priceProduct = $(this).data('price')
  let phoneProduct = $(this).data('phone')
  let quantityProduct = $(this).data('quantity')
  let descriptionProduct = $(this).data('description')
  let saleProduct = $(this).data('sale')
  var idcategory = $(this).data('idcategory')
  $(".modal-body #nameProduct").val(nameProduct)
  $(".modal-body #priceProduct").val(priceProduct)
  $(".modal-body #phoneProduct").val(phoneProduct)
  $(".modal-body #quantityProduct").val(quantityProduct)
  $(".modal-body #descriptionProduct").val(descriptionProduct)
  $(".modal-body #saleProduct").val(saleProduct)
  $("#selectCategoryId > option").each(function () {
    if (this.value == idcategory) {
      $('.select-category option[value="' + idcategory + '"]').attr('selected', 'selected');
      return false
    }
  });

})

$(document).on('click', ".open-role", function () {
  var nameRole = $(this).data('role')
  let nameUser = $(this).data('name')
  let emailUser = $(this).data('email')
  let phoneUser = $(this).data('phone')
  let addressUser = $(this).data('address')
  $(".modal-body #selectRoleId").val(nameRole)
  $(".modal-body #nameUser").val(nameUser)
  $(".modal-body #emailUser").val(emailUser)
  $(".modal-body #phoneUser").val(phoneUser)
  $(".modal-body #addressUser").val(addressUser)
  $("#selectRoleId > option").each(function () {
    if (this.value == nameRole) {
      $('.select-category option[value="' + nameRole + '"]').attr('selected', 'selected');
      return false
    }
  });

})
function accents_supr(data) {
  return !data
    ? ""
    : typeof data === "string"
      ? data
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A")
        .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E")
        .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
        .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I")
        .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O")
        .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U")
        .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y")
        .replace(/Đ/g, "D")
      : data;
}
//sắp xếp theo tiếng việt
$.fn.dataTable.ext.order.intl("vi");

//tìm kiếm theo tiếng việt
$.fn.DataTable.ext.type.search["string"] = function (data) {
  return accents_supr(data);
};

$(document).ready(function () {
  $.fn.dataTable.moment( 'D/M/YYYY HH:mm' );
  $('#dataTable').dataTable({
    order: [[4, 'desc']],
  });
  $("#dataTable_filter input[type=search]").keyup(function () {
    var table = $("#dataTable").DataTable();
    table
      .search($.fn.DataTable.ext.type.search.string(accents_supr(this.value)))
      .draw();
  });
});
