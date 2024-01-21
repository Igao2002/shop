//đổi mật khẩu.
function check(oldPw, newPw, cfNew) {
    if (oldPw != user.password) {
        alert('Mật khẩu cũ không chính xác.')
        return false;
    }
    if (oldPw == newPw) {
        alert('Mật khẩu mới không được phép trùng với mật khẩu cũ.')
        return false;
    }
    if (newPw != cfNew) {
        alert('Mật khẩu nhập lại không trùng khớp!')
        return false;
    }
    return true;
}

const changeBtn = document.querySelector('#change')
changeBtn.onclick = function (event) {
    event.preventDefault();
    const oldPw = document.querySelector('#current-password').value;
    const newPw = document.querySelector('#new-password').value;
    const cfNew = document.querySelector('#confirm-password').value;
    if (check(oldPw, newPw, cfNew)) {
        var updates = {
            password: newPw
        }
        database.ref('user/' + user.user).update(updates)
        const dbRef = firebase.database().ref();
        dbRef.child("user").child(user.user).get().then((snapshot) => {
            localStorage.setItem('user', JSON.stringify(snapshot.val()));
        }).catch((error) => {
            console.error(error);
        });
        alert('Mật khẩu đã được thay đổi thành công.');
    }
}

//Thêm ảnh
const fileInput = document.getElementById('image-upload');
fileInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
        const selectedFile = fileInput.files[0];
        // Xử lý sự kiện click ở đây
        var storageRef = firebase.storage().ref("images/" + selectedFile.name);
        var task = storageRef.put(selectedFile)
        task.then(function (snapshot) {
            //lấy url của ảnh vừa lưu
            snapshot.ref.getDownloadURL().then(function (downloadURL) {
                var url = downloadURL
                var updates = {
                    url: url
                }
                database.ref('user/' + user.user).update(updates)
                const dbRef = firebase.database().ref();
                dbRef.child("user").child(user.user).get().then((snapshot) => {
                    localStorage.setItem('user', JSON.stringify(snapshot.val()));
                }).catch((error) => {
                    console.error(error);
                });
            });
        });
    }
});

//thêm thông tin
const showName = document.getElementById('new-name')
const showEmail = document.getElementById('new-email')
const showNumber = document.getElementById('new-number')

showName.value = user.name
if (user.email) {
    showEmail.value = user.email
} else {
    showEmail.value = ''
}
if (user.number) {
    showNumber.value = user.number
} else {
    showNumber.value = ''
}

const saveInfo = document.getElementById('changeInfo')

saveInfo.onclick = () => {
    const updates = {
        name: showName.value,
        email: showEmail.value,
        number: showNumber.value
    }
    database.ref('user/' + user.user).update(updates)
    const dbRef = firebase.database().ref();
    dbRef.child("user").child(user.user).get().then((snapshot) => {
        localStorage.setItem('user', JSON.stringify(snapshot.val()));
    }).catch((error) => {
        console.error(error);
    });
    alert('Thay đổi thông tin thành công.')
}