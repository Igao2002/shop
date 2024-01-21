// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCzey6ZdjGcg-99Ow-vlrUoHzAZTc90x5I",
    authDomain: "store-ebf17.firebaseapp.com",
    projectId: "store-ebf17",
    databaseURL: "https://store-ebf17-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "store-ebf17.appspot.com",
    messagingSenderId: "683553641271",
    appId: "1:683553641271:web:93e7004b35f31c10ee80b2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Set database variable
var database = firebase.database()

const dbRef = firebase.database().ref();

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const user = JSON.parse(localStorage.getItem('user'));

if (user) {
    document.querySelector('.login').style.display = 'none'
    document.querySelector('.logout').style.display = 'block'
    document.querySelector('.user').style.display = 'block';
    document.getElementById('usernameDisplay').textContent = user.name;
    document.getElementById('username').textContent = user.user;
    document.getElementById('name').textContent = user.name;
    document.getElementById('name1').textContent = user.name;
    if (user.url) {
        document.getElementById('avatarUser').src = user.url;
        document.getElementById('avatar').src = user.url;
        document.getElementById('setAvatar').src = user.url;
    }
    else {
        document.getElementById('avatar').src = "./assets/img/user.png";
        document.getElementById('setAvatar').src = "./assets/img/user.png";
        document.getElementById('avatarUser').src = "./assets/img/user.png";
    }
    if (user.email) {
        document.getElementById('email').textContent = user.email;
    }
    if (user.number) {
        document.getElementById('number').textContent = user.number;
    }
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

const option1 = $('.option1')
const option2 = $('.option2')
const option3 = $('.option3')
const option4 = $('.option4')


const info = $('.information')
const changePw = $('.changePw')
const changeInfo = $('.changeInfo')
const bill = $('.bill')

option1.onclick = () => {
    info.classList.remove('hide')
    changePw.classList.add('hide')
    changeInfo.classList.add('hide')
    bill.classList.add('hide')
}

option2.onclick = () => {
    info.classList.add('hide')
    changePw.classList.remove('hide')
    changeInfo.classList.add('hide')
    bill.classList.add('hide')
}

option3.onclick = () => {
    info.classList.add('hide')
    changePw.classList.add('hide')
    changeInfo.classList.remove('hide')
    bill.classList.add('hide')
}

option4.onclick = () => {
    info.classList.add('hide')
    changePw.classList.add('hide')
    changeInfo.classList.add('hide')
    bill.classList.remove('hide')
}

// click hiển thị chi tiết
const handleShowDetail = (id) => {
    const show_detail_item = $(`.show-detail-${id}`)
    const last_detail_item = $(`.list-bill-info-list-${id + 1}`)
    show_detail_item.classList.toggle("no-show-detail-order")
    if (last_detail_item) {
        last_detail_item.classList.toggle("borderTop")
    }
}

//render đơn hàng
dbRef.child("order").get().then((snapshot) => {
    if (snapshot.exists()) {
        const listsData = snapshot.val()
        console.log(listsData)
        const main = $(".list-bill-info")
        if (main) {
            const item = listsData.map((data, index) => {
                if(data.user === user.user){
                    const listItemCart = data.order.listCart.map((data) => {
                        let gia = (data.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                        let totalMoney = (data.price * data.soLuongMua).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    
                        return `<div class="list-detail-order">
                        <div class="detail-product-name">
                            <div>
                                <img src="${data.url}" class="detail-product-img" alt="loi">
                            </div>
                            <div class="detail-product-info">
                                <p class="detail-product-info-name">${data.name}</p>
                                <p class="detail-product-info-price">${gia}</p>
                            </div>
                        </div>
                        <div class="detail-product-quantity">x${data.soLuongMua}</div>
                        <div class="detail-product-total">Tổng: ${totalMoney}</div>
                    </div>`
                    }).join("")
    
                    const totalMoney = (data.order.totalPrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                    return `<div class="list-bill-info-list-${index}">
                    <div class="list-bill-info-list">
                    <div class="bill-info-code">
                        <span>#${data.id}</span>
                        <div class="bill-info-detail" onclick="handleShowDetail(${index})">
                            Chi tiết
                            <div class="detail-icon">
                                <i class="fa-solid fa-angle-down"></i>
                            </div>
                        </div>
                    </div>
                    <span class="bill-info">${data.fullname}</span>
                    <span class="bill-info">${data.order.time}</span>
                    <span class="bill-info">${data.order.itemNumbers}</span>
                    <span class="bill-info">${totalMoney}</span>
                </div>
                <div class="show-detail show-detail-${index} no-show-detail-order">
                    <div class="delivery-address">
                        <h5 class="title-delivery">Thông tin đơn hàng</h5>
                        <p>+, Tên: ${data.fullname}</p>
                        <p>+, SĐT: ${data.phone}, Email: ${data.email}</p>
                        <p>+, Địa chỉ: ${data.address}</p>
                        <p>+, Lời nhắn: ${data.order.note}</p>
                        <p>+, Thời gian đặt hàng: ${data.order.time}</p>
                    </div>
                    <div class="detail-order">${listItemCart}</div>
                </div>
                </div>`
                }
            })
            main.innerHTML = item.join("")
        }
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});