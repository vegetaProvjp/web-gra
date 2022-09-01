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
  
  $.fn.dataTable.ext.order.intl("vi");
  $.fn.DataTable.ext.type.search["string"] = function (data) {
    return accents_supr(data);
  };
  
  $(document).ready(function() {
    var dataTable = $('#example').dataTable();
    $("#example_filter input[type=search]").keyup(function () {
        var table = $("#example").DataTable({
          language: {
            url: "https://cdn.datatables.net/plug-ins/1.12.1/i18n/vi.json",
          },
        });
        table
          .search($.fn.DataTable.ext.type.search.string(accents_supr(this.value)))
          .draw();
      });
} );
  