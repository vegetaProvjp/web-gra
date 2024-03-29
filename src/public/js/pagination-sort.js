$('#paging').pagination({
    dataSource: '/product/page?page=1',
    locator: 'data',
    totalNumberLocator: function (response) {
        return response.totalProduct
    },
    pageSize: 16,
    afterPageOnClick: function (e, pageNumber) {
        loadPage(pageNumber)
    },
    afterPageOnClick: function (event, pageNumber) {
        loadPage(pageNumber);
    },
    afterNextOnClick: function (event, pageNumber) {
        loadPage(pageNumber);
    },
    afterPreviousOnClick: function (event, pageNumber) {
        loadPage(pageNumber);
    },

})

function loadPage(page) {
    $('#content').html('')
    $.ajax({
        url: '/product/page?page=' + page

    })
        .then(rs => {
            for (var i = 0; i < rs.data.length; i++) {
                let element = rs.data[i]
                var item1 = $(`			
                        <div class="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item women">
                            <!-- Block2 -->
                            <div class="block2">
                                <div class="block2-pic hov-img0 label-new" data-label="New">
                                    <img src="${element.image[0].url}" alt="IMG-PRODUCT">

                                </div>

                                <div class="block2-txt flex-w flex-t p-t-14">
                                    <div class="block2-txt-child1 flex-col-l ">
                                        <a href="/product/${element.slug}"
                                            class="stext-104 cl2 hov-cl1 trans-04 js-name-b2 p-b-6">
                                            ${element.name}
                                        </a>

                                        <span class="stext-105 cl1">
                                            ${element.price}
                                        </span>
                                    </div>

                                    <div class="block2-txt-child2 flex-r p-t-3">
                                        <a href="#" class="btn-addwish-b2 dis-block pos-relative js-addwish-b2">
                                            <img class="icon-heart1 dis-block trans-04" src="/images/icons/icon-heart-01.png"
                                                alt="ICON">
                                            <img class="icon-heart2 dis-block trans-04 ab-t-l"
                                                src="/images/icons/icon-heart-02.png" alt="ICON">
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>`)
                var item2 = (`<h1 class="text-center text-success" style="padding:150px 0">Không tìm thấy sản phẩm phù hợp</h1>
                `)
                $('#content').append(item)
            }
        })
        .catch(err => {
            console.log(err)
        })
}
loadPage(1)