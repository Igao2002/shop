import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

//Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzey6ZdjGcg-99Ow-vlrUoHzAZTc90x5I",
    authDomain: "store-ebf17.firebaseapp.com",
    projectId: "store-ebf17",
    databaseURL: "https://store-ebf17-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "store-ebf17.appspot.com",
    messagingSenderId: "683553641271",
    appId: "1:683553641271:web:93e7004b35f31c10ee80b2"
};

const app = initializeApp(firebaseConfig)

const db = getDatabase(app)

document.getElementById('btn-login').addEventListener('click', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    authenticate(username, password)
});

function login(user) {
    localStorage.setItem('user', JSON.stringify(user));
    window.location.href = 'index.html';
}

function authenticate(username, password) {
    const dbRef = ref(db);
    get(child(dbRef, 'user/' + username)).then((snapshot) => {
        if (snapshot.exists()) {
            if (password === snapshot.val().password) {
                login(snapshot.val())
            }
            else {
                alert('Mật khẩu không đúng!');
            }
        }
        else {
            alert('Tài khoản không tồn tại!');
        }
    })
}

function Validation(name, password1, password2) {
    const nameRegex = /[a-zA-Z\s]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;

    if (!nameRegex.test(name)) {
        alert('Tên không hợp lệ. Tên chỉ được chứa ký tự chữ cái!');
        return false;
    }
    if (password1 !== password2) {
        alert('Mật khẩu không trùng khớp');
        return false;
    }
    if (!passwordRegex.test(password1)) {
        alert('Mật khẩu phải có độ dài trên 8 ký tự và chứa chữ thường, chữ hoa, số.');
        return false;
    }
    return true
}

document.getElementById('btn-register').addEventListener('click', function (event) {
    event.preventDefault();
    const name = document.querySelector('.input-fullname').value
    const user = document.querySelector('.input-user').value
    const password = document.querySelector('.input-password1').value
    const cf = document.querySelector('.input-password2').value

    if (Validation(name, password, cf)) {
        const dbRef = ref(db);
        get(child(dbRef, "user/" + user)).then((snapshot) => {
            if (snapshot.exists()) {
                alert("Account already exists!")
            }
            else {
                set(ref(db, "user/" + user),
                    {
                        name: name,
                        user: user,
                        password: password
                    })
                    .then(() => {
                        alert("Thanh Cong")
                        const login_form = document.querySelector('.login-form')
                        const register_form = document.querySelector('.register-form')
                        login_form.style.display = 'block'
                        register_form.style.display = 'none'
                    })
            }
        })
    }
});