var slideIndex;
// KHai bào hàm hiển thị slide
function showSlides() {
  var i;
  var slides = document.querySelectorAll('.mySlides')
  var dots = document.querySelectorAll('.dot')
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none"
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].classList.remove('active_slide')
  }

  slides[slideIndex].style.display = "block"
  dots[slideIndex].classList.add('active_slide')
  //chuyển đến slide tiếp theo
  slideIndex++;
  //nếu đang ở slide cuối cùng thì chuyển về slide đầu
  if (slideIndex > 4) {
    slideIndex = 0
  }
  //tự động chuyển đổi slide sau 3s
  setTimeout(showSlides, 3000)
}
//mặc định hiển thị slide đầu tiên 
showSlides(slideIndex = 0)

function currentSlide(n) {
  showSlides(slideIndex = n)
}