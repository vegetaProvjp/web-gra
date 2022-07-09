$(document).on('click', '.category-item', (e) => {
    let el = e.target;
    let category = $(el).attr('data');
    if(category !== "all") {
    $('.category').val(category);
}
    else {
    $('.category').val("")
}
$('.form-search')[0].submit();
})
