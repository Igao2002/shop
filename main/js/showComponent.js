const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const keyLocalStorageListSP = "DACHSACHSP"
const keyLocalStorageItemCart = "DANHSACHITEMCART"

const home = $(".product")
const cart_info = $(".cart-info")
const list_cart_body = $(".list-cart-body")
const nocart = $(".nocart")
const btnBuy = $(".btn-buy")
const list_cart = $(".list-cart")
const total_money = $(".total-money")
const tabItem = $$(".tab-item")
const tabMenu = $$(".tab-menu")
const slide = $(".slide")
const gioHang = $('.header__cart')

const back = $('.btn-back')

back.onclick = () => {
    home.style.display = 'block'
    slide.style.display = 'block'
    cart_info.style.display = 'none'
}

//active header
tabItem.forEach((item) => {
    item.onclick = () => {
        $('.tab-item.active').classList.remove('active')
        item.classList.add("active")
    }
})

// hiển thị sản phẩm đánh giá tốt hoặc sản phẩm bán chạy.
const act1 = $('.act1')
const act2 = $('.act2')
const goodReview = $('.goodReview')
const bestSeller = $('.bestSeller')
act1.onclick = () => {
    act2.classList.remove('active1')
    act1.classList.add('active1')
    goodReview.classList.remove('hide')
    bestSeller.classList.add('hide')
}

act2.onclick = () => {
    act1.classList.remove('active1')
    act2.classList.add('active1')
    goodReview.classList.add('hide')
    bestSeller.classList.remove('hide')
}

//active menu
tabMenu.forEach((item) => {
    item.onclick = () => {
        $('.tab-menu.active2').classList.remove('active2')
        item.classList.add("active2")
    }
})

//show sản phẩm theo thể loại.
var tabs = document.querySelectorAll('.tab-menu');
// Lặp qua danh sách và thêm sự kiện click vào mỗi thẻ li
tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
        // Ẩn tất các nội dung của các tab và hiển thị nội dung ứng với tab được chọn
        hideAllTabs();
        showTab(index);
    });
});

// Ẩn tất cả các tab (danh mục)
function hideAllTabs() {
    var tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(function (content) {
        content.classList.add('hide');
    });
}

// Hiển thị tab được chọn
function showTab(index) {
    var tabContents = document.querySelectorAll('.tab-content');
    var selectedContent = tabContents[index];
    selectedContent.classList.remove('hide');
}