
//Hàm cập nhật mật khẩu
$(document).on('submit', '#form-password', async (e) => {
    e.preventDefault();
    let password = $('#password').val();
    let password2 = $('#password2').val();
    const data = {
        password: password,
    }
    if (password !== password2) {
        alert('Mật khẩu lặp lại không đúng')
    }
})
