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
dbRef.child("product").get().then((snapshot) => {
    if (snapshot.exists()) {
        const list = snapshot.val()
        list.forEach(data => {
            let root = document.querySelector('.root')
            let card = document.createElement('div');
            let gia = parseInt(data.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            card.setAttribute('class', 'list-info')
            card.innerHTML = `  <div class="product-name">
                                <div>
                                    <img src="${data.url}" class="product-img" alt="loi">
                                </div>
                                <div class="product-info">
                                    <p class="product-info-name">${data.name}</p>
                                    <p class="product-info-quantity">Số lượng: ${data.soluong}</p>
                                </div>
                            </div>
                            <div class="product-properti">
                                <div class="product-price">${gia}</div>
                                <div class="product-delete">
                                    <i class="fa-solid fa-pen-to-square" onclick="update(${data.id})"></i>
                                    <i class="fa-solid fa-trash" onclick="confirmDelete(${data.id})"></i>
                                </div>
                            </div>
                         `
            let modal = document.querySelector('.js-modal')
            let modalContainer = document.querySelector('.js-modal-Container')
            let modalClose = document.querySelector('.modal-close')
            let allInfo = modal.querySelector('.modal-main')

            let info = data.info.split('. ')
            let resInfo = info.join('.</li><li>')
            resInfo = '<li>' + resInfo + '</li>'

            card.onclick = (event) => {
                const target = event.target;
                allInfo.innerHTML = `
                            <div class="modal-body">
                                <div class="img-product">
                                    <img src="${data.url}" alt="">
                                </div>
                                <div class="allInfo-product">
                                    <div>
                                        <div class="name-product"> ${data.name} </div>
                                        <div class="price-product"> ${gia} </div>
                                        <div class="info-product"> ${resInfo} </div>
                                        <div class="modal-des-text">${data.describe}</div>
                                    </div>
                                </div>
                            </div>
                         `
                if (target.classList.contains('fa-solid')) {
                    event.stopPropagation();
                  } else {
                    modal.classList.add('open')
                  }
            }

            //hàm đóng
            function hideInfoProduct() {
                modal.classList.remove('open')
            }

            //click button close
            modalClose.addEventListener('click', hideInfoProduct)

            modal.addEventListener('click', hideInfoProduct)

            modalContainer.addEventListener('click', function (event) {
                event.stopPropagation()
            })
            root.appendChild(card)
        });
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});

function form_info(product) {
    let shows = document.querySelectorAll('.home-product-add-cart')
    let modal = document.querySelector('.js-modal')
    let modalContainer = document.querySelector('.js-modal-Container')
    let modalClose = document.querySelector('.modal-close')
    let allInfo = modal.querySelector('.modal-main')

    let info = product.info.split('. ')
    let resInfo = info.join('.</li><li>')
    resInfo = '<li>' + resInfo + '</li>'
    allInfo.innerHTML = `
        <div class="modal-body">
                    <div class="img-product">
                        <img src="${product.url}" alt="">
                    </div>
                    <div class="allInfo-product">
                        <div>
                            <div class="name-product">
                                ${product.name}
                            </div>
                            <div class="price-product">
                                ${gia}
                            </div>
                            <div class="info-product">
                                ${resInfo}
                            </div>
                        </div>
                        <div class="addToCart">
                            <button>Thêm vào giỏ hàng</button>
                        </div>
                    </div>
                </div>
                <div class="modal-des">
                    <div class="modal-title">
                        Đặc điểm nổi bật
                    </div>
                    <div class="modal-des-text">
                        ${product.describe}
                    </div>
                </div>
    `

    //hàm mở   
    function showInfoProduct() {
        modal.classList.add('open')
    }

    //hàm đóng
    function hideInfoProduct() {
        modal.classList.remove('open')
    }

    for (const show of shows) {
        show.addEventListener('click', showInfoProduct)
    }

    //click button close
    modalClose.addEventListener('click', hideInfoProduct)

    modal.addEventListener('click', hideInfoProduct)

    modalContainer.addEventListener('click', function (event) {
        event.stopPropagation()
    })
}

// thêm sản phẩm
function add() {
    const name = document.getElementById('name').value
    const describe = document.getElementById('describe').value
    const price = parseInt(document.getElementById('price').value)
    const quantity = parseInt(document.getElementById('quantity').value)
    const type = document.getElementById('type').value
    const info = document.getElementById('info').value
    const imageInput = document.getElementById('imageInput').files[0]
    const storageRef = firebase.storage().ref("images/" + imageInput.name);
    // const storageRef = firebase.storage().ref("images/" + IdRandom());
    const task = storageRef.put(imageInput)
    task.then(function (snapshot) {
        //lấy url của ảnh vừa lưu
        snapshot.ref.getDownloadURL().then(function (downloadURL) {
            const url = downloadURL
            // tạo id
            firebase.database().ref('product').limitToLast(1).once('value')
                .then(function (snapshot) {
                    snapshot.forEach(function (childSnapshot) {
                        var count = parseInt(childSnapshot.key) + 1;
                        console.log(count)
                        //lưu vào database
                        database.ref('product/' + count).set({
                            name: name,
                            describe: describe,
                            id: count,
                            luotXem: 0,
                            daMua: 0,
                            price: price,
                            soluong: quantity,
                            type: type,
                            info: info,
                            url: url,
                            createAt: firebase.database.ServerValue.TIMESTAMP
                        })
                        alert('Thêm thành công sản phẩm.')
                    });
                });
        });
    });
}

const form = document.getElementById('form-update')
//hàm mở   
function showForm() {
    form.classList.add('open')
}

//hàm đóng
function hideForm() {
    form.classList.remove('open')
}

// sửa sản phẩm
function update(id) {
    dbRef.child("product").child(id).get().then((snapshot) => {
        const data = snapshot.val()
        form.innerHTML = `
                                        <div class="form-container">
                                        <h1>UPDATE</h1>
                                        <i class="fa-solid fa-xmark"></i>
                                        <input placeholder="Name" value="${data.name}" type="text" id="name-update"/>
                                        <input placeholder="Describe" value="${data.describe}" type="text" id="describe-update"/>
                                        <input placeholder="Price" value="${data.price}" type="number" id="price-update"/>
                                        <input placeholder="Quantity" value="${data.soluong}" type="number" id="quantity-update"/>
                                        <input placeholder="Info" value="${data.info}" type="text" id="info-update"/>
                                        <select id="type-update" name="type">
                                            <option value="livingRoom">Living Room</option>
                                            <option value="bedRoom">Bed Room</option>
                                            <option value="kitchen">Kitchen</option>
                                            <option value="workingRoom">Working Room</option>
                                            <option value="outDoor">Outdoor</option>
                                            <option value="children">Children Room</option>
                                        </select>
                                        <input type="file" id="image-update" accept=".jpg, .png">
                                        <button id="save"> Save </button>
                                        </div>
                                    `
        showForm()
        let btnClose = form.querySelector('.fa-xmark')
        btnClose.addEventListener('click', hideForm)
        let btnUpdate = form.querySelector('#save')
        btnUpdate.onclick = () => {
            const name = document.querySelector('#name-update').value
            const describe = document.querySelector('#describe-update').value
            const price = parseInt(document.querySelector('#price-update').value)
            const quantity = parseInt(document.querySelector('#quantity-update').value)
            const type = document.querySelector('#type-update').value
            const info = document.querySelector('#info-update').value
            const imageInput = document.getElementById('image-update').files[0]
            //check xem thay đổi ảnh hay không. nếu có thì lấy ảnh mới ngược lại giữ ảnh cũ.
            if (imageInput) {
                const storageRef = firebase.storage().ref("images/" + imageInput.name);
                const task = storageRef.put(imageInput)
                task.then(function (snapshot) {
                    //lấy url của ảnh vừa lưu
                    snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        const url = downloadURL
                        var updates = {
                            name: name,
                            describe: describe,
                            price: price,
                            soluong: quantity,
                            type: type,
                            info: info,
                            url: url
                        }
                        database.ref('product/' + id).update(updates)
                        hideForm()
                        alert('Đã thay đổi thông tin sản phẩm')

                    });
                });

            }
            else {
                var updates = {
                    name: name,
                    describe: describe,
                    price: price,
                    soluong: quantity,
                    type: type,
                    info: info,
                }
                database.ref('product/' + id).update(updates)
                hideForm()
                alert('Đã thay đổi thông tin sản phẩm')
            }
        }
    }).catch((error) => {
        console.error(error);
    });
}

//xóa sản phẩm
function confirmDelete(id) {
    if (confirm('Bạn có chắc muốn xóa phòng này?')) {
        remove(id);
    }
}

function remove(id) {
    console.log(id)
    database.ref('product/' + id).remove()
    alert('Xóa thành công sản phẩm')
}


//active menu
const tabMenu = document.querySelectorAll('.tab')
tabMenu.forEach((item, index) => {
    item.onclick = () => {
        document.querySelector('.tab.active').classList.remove('active')
        item.classList.add("active")
        hideAllTabs();
        showTab(index);
    }
})

// Ẩn tất cả các tab (danh mục)
function hideAllTabs() {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function (content) {
        content.classList.add('hide');
    });
}

// Hiển thị tab được chọn
function showTab(index) {
    const tabContents = document.querySelectorAll('.tab-content');
    const selectedContent = tabContents[index];
    selectedContent.classList.remove('hide');
}


//------------------------------- render đơn hàng --------------------------------------
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const list_bill = $(".bill")

// click hiển thị chi tiết
const handleShowDetail = (id) => {
    const show_detail_item = $(`.show-detail-${id}`)
    const last_detail_item = $(`.list-bill-info-list-${id + 1}`)
    show_detail_item.classList.toggle("no-show-detail-order")
    if (last_detail_item) {
        last_detail_item.classList.toggle("borderTop")
    }
}

//-------------------------------- render đơn hàng ---------------------------------------
dbRef.child("order").get().then((snapshot) => {
    if (snapshot.exists()) {
        const listsData = snapshot.val()
        console.log(listsData)
        const main = $(".list-bill-info")
        if (main) {
            const item = listsData.map((data, index) => {
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
            })
            main.innerHTML = item.join("")
        }
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});