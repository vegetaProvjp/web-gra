var typeCategory = document.getElementById("hidden").innerText;;
console.log(typeCategory);
$('#paging').pagination({
    dataSource: `/product/category/api/${typeCategory}?page=1`,
    locator: 'data',
    totalNumberLocator: function(response) {
        return response.totalProduct
    },
    pageSize: 4,
    afterPageOnClick: function(e, pageNumber) {
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
        url: `/product/category/api/${typeCategory}?page=` +page

    })
    .then(rs => {
        for(var i = 0; i <rs.data.length; i++) {
            let element = rs.data[i]
            var item = $(`			
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
            $('#content').append(item)
        }
    })
    .catch(err => {
        console.log(err)
    })
}
loadPage(1)