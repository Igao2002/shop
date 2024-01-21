const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    document.querySelector('.login').style.display = 'none'
    document.querySelector('.logout').style.display = 'block'
    document.querySelector('.user').style.display = 'block';
    document.getElementById('usernameDisplay').textContent = user.name;
    if (user.url) {
        document.getElementById('avatarUser').src = user.url;
    }
    else {
        document.getElementById('avatarUser').src = "./assets/img/user.png";
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}