
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, child, get, set, update, query, orderByChild, limitToLast } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

import { toast } from "./toast.js"

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

//initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const listCart = []
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const keyLocalStorageListSP = "DACHSACHSP"
const keyLocalStorageItemCart = "DANHSACHITEMCART"

const gioHang = $('.header__cart')

//lưu dữ liệu vào Storage
const setDataStorage = (key, value) => {
    localStorage.setItem(key, value)
}

//------------------- render ------------------
const renderCard = (place, card) => {
    let root = document.getElementById(place)
    root.appendChild(card)
}

//------------------- tạo card sản phẩm ---------------
const createCard = (product) => {
    let card = document.createElement('div');
    let gia = product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    card.setAttribute("class", 'flex__column-2-4');
    card.innerHTML = `
        <div class="home-product-item">
            <div class="home-product-item__img home-product-add-cart"
                style="background-image: url(${product.url})">
            </div>
            <div class="home-product-item__properties">
                <h4 class="home-product-item__name">${product.name}</h4>
                <div class="home-product-item__infor">
                    <div class="home-product-item__price">${gia}</div>
                    <div class="home-product-item__quantity">Số lương còn lại: ${product.soluong}</div>
                </div>
                <div id="addBtn" title="Thêm vào giỏ hàng" class="home-product-item__add-cart">
                    <i class="fa-solid fa-cart-plus"></i>
                </div>
            </div>
        </div>`

    const iconAdd = card.querySelector('.home-product-item__add-cart i');
    iconAdd.onclick = () => {
        handleAddCart(product.id)
    }

    let shows = document.querySelectorAll('.home-product-add-cart')
    let modal = document.querySelector('.js-modal')
    let modalContainer = document.querySelector('.js-modal-Container')
    let modalClose = document.querySelector('.modal-close')
    let allInfo = modal.querySelector('.modal-main')

    let info = product.info.split('. ')
    let resInfo = info.join('.</li><li>')
    resInfo = '<li>' + resInfo + '</li>'

    card.onclick = () => {
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
                    <div class="modal-right">
                        <div class="modal-right-2">
                            <i class="fa-sharp fa-solid fa-truck-fast"></i>
                            <span>Miễn phí vận chuyển</span>
                        </div>
                        <ul>
                            <li>Miễn phí vận chuyển tại HCM</li>
                            <li>Miễn phí vận chuyển tại HN</li>
                            <li>Miễn phí vận chuyển toàn quốc</li>
                        </ul>
                        <div class="modal-right-3">
                            <i class="fa-regular fa-credit-card"></i>
                            <span>Phương thức thanh toán</span>
                        </div>
                        <ul>
                            <li>Thanh toán khi nhận hàng (COD)</li>
                            <li>Đảm bảo chất lượng</li>
                            <li>An tâm mua sắm</li>
                        </ul>
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

        const updateLuotXem = {
            luotXem: product.luotXem + 1
        }
        update(ref(database, 'product/' + product.id), updateLuotXem);

        const btnAdd = allInfo.querySelector('.addToCart button');
        btnAdd.onclick = () => {
            console.log(product.id)
            handleAddCart(product.id)
        }
    }

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

    return card
}

//------------------------------- render sản phẩm theo thể loại --------------------------------------
get(child(ref(database), `product`)).then((snapshot) => {
    if (snapshot.exists()) {
        const listsData = snapshot.val()
        const list = []
        listsData.forEach(data => {
            // console.log(data)
            list.push(data)
            localStorage.setItem(keyLocalStorageListSP, JSON.stringify(list));
            renderCard("all", createCard(data))
            if (data.type.includes('livingRoom')) {
                renderCard("lr", createCard(data))
            } if (data.type.includes('bedRoom')) {
                renderCard("br", createCard(data))
            } if (data.type.includes('kitchen')) {
                renderCard("kc", createCard(data))
            } if (data.type.includes('workingRoom')) {
                renderCard("wr", createCard(data))
            } if (data.type.includes('outDoor')) {
                renderCard("od", createCard(data))
            } if (data.type.includes('children')) {
                renderCard("cd", createCard(data))
            }
        });
    } else {
        console.log("No data available");
    }
}).catch((error) => {
    console.error(error);
});


const db = getDatabase();

// render 4 product nổi bật nhất. (dựa trên số lượt xem sản phẩm)
const mostViewedProduct = query(ref(db, 'product'), orderByChild('luotXem'), limitToLast(4));
get(mostViewedProduct, "value").then((snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    renderCard("gr", createCard(childData))
  });
});

// render 4 product nổi bật nhất. (dựa trên số lượt mua sản phẩm)
const bestSellerProduct = query(ref(db, 'product'), orderByChild('daMua'), limitToLast(4));
get(bestSellerProduct, "value").then((snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    renderCard("bs", createCard(childData))
  });
});

// render 8 product mới nhất. (dựa trên ngày đăng sản phẩm)
const newestProduct = query(ref(db, 'product'), orderByChild('creatAt'), limitToLast(8));
get(newestProduct, "value").then((snapshot) => {
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    renderCard("np", createCard(childData))
  });
});


setDataStorage(keyLocalStorageItemCart, JSON.stringify(listCart))

//-------------------------------  lấy dữ liệu từ Storage -------------------------------
const getDataStorage = (key) => {
    return JSON.parse(localStorage.getItem(key))
}
const datas = getDataStorage(keyLocalStorageListSP)


const numberCart = () => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    const number = datasItemCart.length
    if (number === 0) {
        $(".header__cart-notice").style.display = "none";
    } else {
        $(".header__cart-notice").innerText = number;
        $(".header__cart-notice").style.display = "block";

    }
}

//------------------------------- xóa khỏi giỏ hàng -----------------------------------------
function confirmDeleteFromCart(id) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        handleRemoveCart(id);
    }
}

const handleRemoveCart = (id) => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    const listCartNew = datasItemCart.filter((data) => {
        return data.id !== id
    })
    setDataStorage(keyLocalStorageItemCart, JSON.stringify(listCartNew))
    renderItemCart()
    toast({
        title: "Thành công!",
        message: "Xóa thành công",
        type: "success",
        duration: 2000
    });
    numberCart()
}

//------------------------------- tăng số lượng sp trong giỏ hàng -----------------------------
const handleIncrement = (id) => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    datasItemCart.map(data => {
        if (data.id === id) {
            if (data.soLuongMua < data.soluong) {
                data.soLuongMua = data.soLuongMua + 1
                toast({
                    title: "Thành công!",
                    message: "Tăng thành công!",
                    type: "success",
                    duration: 2000
                });
            }
            else {
                toast({
                    title: "Thất bại!",
                    message: "Số lượng không đủ!",
                    type: "error",
                    duration: 2000
                });
            }
        }
    })
    setDataStorage(keyLocalStorageItemCart, JSON.stringify(datasItemCart))
    renderItemCart()
}

//-------------------------------  giảm số lượng sp trong giỏ hàng ---------------------------------
const handleDecrement = (id) => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    datasItemCart.map(data => {
        if (data.id === id && data.soLuongMua !== 1) {
            data.soLuongMua = data.soLuongMua - 1
        }
    })
    setDataStorage(keyLocalStorageItemCart, JSON.stringify(datasItemCart))
    renderItemCart()
}

//-------------------------------  tổng tiền ------------------------------------------
const totalMoney = () => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    const sum = datasItemCart.reduce((total, data) => {
        return total + data.price * data.soLuongMua
    }, 0)
    let totalMoney = sum.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    total_money.innerText = "Total: " + totalMoney
}

//-------------------------------  hiển thị giỏ hàng ----------------------------
const renderItemCart = () => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    if (datasItemCart.length == 0) {
        nocart.style.display = "block"
        list_cart.style.display = "none"
        btnBuy.style.display = "none"
    }
    const listDataCart = datasItemCart.map(data => {
        let price = data.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        let totalMoney = (data.soLuongMua * data.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        return `<div class='list-info'>
                    <div class="product-name">
                        <div>
                            <img src="${data.url}" class="product-img" alt="loi">
                        </div>
                        <div class="product-info">
                            <p class="product-info-name">${data.name}</p>
                            <p class="product-info-quantity">Số lượng còn lại: ${data.soluong}</p>
                        </div>
                    </div>
                    <div class="product-properti">
                        <div class="product-quantity">
                            <span class="action-decrement">-</span>
                            <span class="quantity-buy">${data.soLuongMua}</span>
                            <span class="action-increment">+</span>
                        </div>
                        <div class="product-price">${price}</div>
                        <div class="product-total">${totalMoney}</div>
                        <div class="product-clear-cart">
                            <i class="fa-regular fa-circle-xmark"></i>
                        </div>
                    </div>
                </div>    
                `
    })
    list_cart_body.innerHTML = listDataCart.join('')
    let decre = $$('.action-decrement')
    let incre = $$('.action-increment')
    let clear = $$('.product-clear-cart')
    incre.forEach(function (item, index) {
        item.onclick = () => {
            handleIncrement(datasItemCart[index].id)
        }
    })
    decre.forEach(function (item, index) {
        item.onclick = () => {
            handleDecrement(datasItemCart[index].id)
        }
    })
    clear.forEach(function (item, index) {
        item.onclick = () => {
            confirmDeleteFromCart(datasItemCart[index].id)
        }
    })
    totalMoney()
}

//-------------------------------  Them vao gio hang ----------------------
function handleAddCart(id) {
    const listCart = getDataStorage(keyLocalStorageItemCart)
    if (listCart.length === 0) {
        const itemCart = datas.filter((data) => data.id === id)
        console.log(itemCart)
        itemCart[0].soLuongMua = 1
        listCart.unshift(...itemCart)
    } else {
        let isFind = false
        listCart.map(data => {
            if (data.id === id) {
                data.soLuongMua = data.soLuongMua + 1,
                    isFind = true
            }
        })
        if (!isFind) {
            const itemCart = datas.filter((data) => data.id === id)
            itemCart[0].soLuongMua = 1
            listCart.unshift(...itemCart)
        }
    }
    setDataStorage(keyLocalStorageItemCart, JSON.stringify(listCart))

    toast({
        title: "Thành công!",
        message: "Thêm vào giỏ hàng thành công",
        type: "success",
        duration: 2000
    });
    numberCart()
}




//------------------------------- hover vào icon giỏ hàng -------------------
gioHang.onmouseover = () => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    $(".header__cart-list").style.display = "block";
    if (datasItemCart.length === 0) {
        $(".list-cart-item").style.display = "none";
        $(".no-cart").style.display = "block";
    } else {
        $(".no-cart").style.display = "none";
        $(".list-cart-item").style.display = "block";
    }
    const main = $(".header__cart-list-item")
    if (main) {
        const item = datasItemCart.map((data, index) => {
            let gia = data.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
            return `
            <li class="header__cart-item">
            <div class="header__cart-item-img">
                <img src="${data.url}" class="product-img" alt="loi">
            </div>
            <div class="header__cart-item-info">
                <p class="header__cart-item-info-name">${data.name}</p>
                <p class="header__cart-item-info-price">${gia}</p>
            </div>
        </li>`

        })
        main.innerHTML = item.join("")
    }
}

gioHang.onmouseout = () => {
    $(".header__cart-list").style.display = "none";
}

//-------------------------------  mở tab cart ---------------------------------
gioHang.onclick = () => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    home.style.display = "none"
    // list_bill.style.display = "none"
    cart_info.style.display = "block"
    slide.style.display = "none"
    if (datasItemCart.length > 0) {
        nocart.style.display = "none"
        list_cart_body.style.display = "block"
        btnBuy.style.display = "block"
        list_cart.style.display = "block"
    } else {
        list_cart.style.display = "none"
    }
    renderItemCart()
    // Chuyển đến đầu trang
    document.documentElement.scrollTop = 0;
}

numberCart()
getProvince()
getDistrict()
getWard()


const buy = document.querySelector('.btn-confirm')
const inputProvince = $("#province")
const inputWard = $("#ward")
const inputDistrict = $("#district")
const input_surname = $(".input-surname")
const input_name = $(".input-name")
const input_email = $(".input-email")
const input_phone = $(".input-phone")
const input_address = $(".input-address")
const text_note = $("#modal-buy-note")

//------------------------------- xóa giỏ hàng -----------------------------------------
const removeCart = (id) => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    const listCartNew = datasItemCart.filter((data) => {
        return data.id !== id
    })
    setDataStorage(keyLocalStorageItemCart, JSON.stringify(listCartNew))
    renderItemCart()
    numberCart()
}

// lưu đơn hàng
buy.onclick = () => {
    const datasItemCart = getDataStorage(keyLocalStorageItemCart)
    const time = new Date()
    get(child(ref(database), `order`)).then((snapshot) => {
        if (snapshot.exists()) {
            const listsData = snapshot.val()
            console.log(listsData.length)
            var count = listsData.length;

            //lưu vào database
            const data = {
                "id": count,
                "user": user.user,
                "fullname": input_surname.value + " " + input_name.value,
                "phone": input_phone.value,
                "email": input_email.value,
                "address": input_address.value + ", " + JSON.parse(inputWard.value)[1] + ", " + JSON.parse(inputDistrict.value)[1] + ", " + JSON.parse(inputProvince.value)[1],
                "order": {
                    "time": time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear(),
                    "note": text_note.value,
                    "itemNumbers": datasItemCart.length,
                    "totalPrice": datasItemCart.reduce((total, data) => {
                        return total + data.price * data.soLuongMua
                    }, 0),
                    "totalQuantity": datasItemCart.reduce((total, data) => {
                        return total + data.soLuongMua
                    }, 0),
                    "listCart": datasItemCart
                }
            }
            // lưu đơn hàng vào firebase
            set(ref(database, 'order/' + count), data);
            // trừ số lượng còn lại của sản phẩm
            datasItemCart.forEach((data) => {
                const id = data.id
                get(child(ref(database), `product/` + id)).then((snapshot) => { 
                    const dataProduct = snapshot.val()
                    const dataItem = {
                        soluong: dataProduct.soluong - data.soLuongMua,
                        daMua: dataProduct.daMua + data.soLuongMua,
                    }
                    update(ref(database, 'product/' + id), dataItem);
                })
                removeCart(id)
            })
            handleCloseModal()
            toast({
                title: "Thành công!",
                message: "Đặt hàng thành công!",
                type: "success",
                duration: 2000
            });
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        // console.error(error);
    });
}

