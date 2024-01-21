// Mảng lưu tỉnh - huyện - xã
let listProvince = []
let listDistrict = []
let listWard = []

const form_message = $$(".form-message")
const value_form = $$(".value-form")
const inputProvince = $("#province")
const inputWard = $("#ward")
const inputDistrict = $("#district")
const input_surname = $(".input-surname")
const message_surname = $(".message-surname")
const input_name = $(".input-name")
const message_name = $(".message-name")
const input_email = $(".input-email")
const message_email = $(".message-email")
const input_phone = $(".input-phone")
const message_phone = $(".message-phone")
const input_address = $(".input-address")
const message_address = $(".message-address")
const text_note = $("#modal-note")
const modal_buy = $('.modal-buy')


const handleOpenModal = () => {
    modal_buy.style.display = "flex"
}

const handleCloseModal = () => {
    modal_buy.style.display = "none"

    form_message.forEach((item) => {
        item.innerText = ""
    })

    value_form.forEach((item) => {
        item.value = ""
    })

    text_note.value = ""
    getProvince()
    getDistrict()
    getWard()
}

// lấy danh sách huyện từ id tỉnh
const handleDistrictByID = async () => {
    const idProvince = JSON.parse(inputProvince.value)[0]
    const value = "district-" + idProvince + "-id"
    const listDistrictNew = listDistrict.filter(data => { return data.includes(value) })
    listDistrictNew.unshift('<option value="[0]" class="option-district-default">-- Chọn Huyện/Quận --</option>')
    if (idProvince === 0) {
        inputDistrict.innerHTML = listDistrict.join("")
        inputWard.innerHTML = listWard.join("")
    } else {
        inputDistrict.innerHTML = listDistrictNew.join("")
        inputWard.innerHTML = listWard.join("")
    }
  }
  
  // lấy danh sánh xã từ id huyện
  const handleWardByID = async () => {
    const idDistrict = JSON.parse(inputDistrict.value)[0]
    const value = "ward-" + idDistrict + "-id"
    const listWardNew = listWard.filter(data => { return data.includes(value) })
    listWardNew.unshift('<option value="[0]" class="option-ward-default">-- Chọn Phường/Xã --</option>')
    if (idDistrict === 0) {
        inputWard.innerHTML = listWard.join("")
    } else {
        inputWard.innerHTML = listWardNew.join("")
    }
  }
  
  // lấy tất cả tỉnh
  const getProvince = async () => {
    const res = await fetch("https://provinces.open-api.vn/api/p/")
    const datas = await res.json()
    listProvince = datas.map(data => {
        return `<option value='[${data.code}, "${data.name}"]' class="option-province">${data.name}</option>`
    })
    listProvince.unshift('<option value="[0]" class="option-province-default">-- Chọn Tỉnh/Thành phố --</option>')
    inputProvince.innerHTML = listProvince.join("")
  }
  
  // lấy tất cả huyện
  const getDistrict = async () => {
    const res = await fetch("https://provinces.open-api.vn/api/d/")
    const datas = await res.json()
    listDistrict = datas.map(data => {
        return `<option value='[${data.code}, "${data.name}"]' class="district-${data.province_code}-id">${data.name}</option>`
    })
    listDistrict.unshift('<option value="[0]" class="option-district-default">-- Chọn Huyện/Quận --</option>')
    inputDistrict.innerHTML = listDistrict.join("")
  }
  
  //lấy tất cả xã
  const getWard = async () => {
    const res = await fetch("https://provinces.open-api.vn/api/w/")
    const datas = await res.json()
    listWard = datas.map(data => {
        return `<option value='[${data.code}, "${data.name}"]' class="ward-${data.district_code}-id">${data.name}</option>`
    })
    listWard.unshift('<option value="[0]" class="option-ward-default">-- Chọn Phường/Xã --</option>')
    inputWard.innerHTML = listWard.join("")
  }
  
  // khi chưa chọn tỉnh
  const handleNoProvince = () => {
    const valueInputProvince = JSON.parse($("#province").value)[0]
    if (valueInputProvince === 0) {
        inputDistrict.innerHTML = '<option value="[0]" class="option-district-default">-- Chọn Huyện/Quận --</option>'
        inputDistrict.title = "Vui lòng chọn Tỉnh/Thành phố"
        inputWard.innerHTML = '<option value="[0]" class="option-ward-default">-- Chọn Phường/Xã --</option>'
        inputWard.title = "Vui lòng chọn Tỉnh/Thành phố"
    }
  }
  
  // khi chưa chọn huyện
  const handleNoDistrict = () => {
    const valueInputDistrict = JSON.parse($("#district").value)[0]
    if (valueInputDistrict === 0) {
        inputWard.title = "Vui lòng chọn Huyện/Quận"
        inputWard.innerHTML = '<option value="[0]" class="option-ward-default">-- Chọn Phường/Xã --</option>'
    }
  }
  
  // xóa title
  const handleCloseTitle = () => {
    const valueInputProvince = JSON.parse($("#province").value)[0]
    if (valueInputProvince !== 0) {
        inputDistrict.removeAttribute("title")
        inputWard.removeAttribute("title")
    }
  }
  
  // ramdom id
  const IdRamdom = () => {
    const random = () => {
        return Math.random().toString(36).slice(-6)
    }
    return random
  }
  
  // validate các trường
  const validateSurname = () => {
    const value_input_surname = input_surname.value
    const regName = /^[a-z A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/
    if (value_input_surname.length !== 0) {
        if (!regName.test(value_input_surname)) {
            message_surname.innerText = "Họ không hợp lệ"
        } else {
            message_surname.innerText = ""
        }
    } else {
        message_surname.innerText = "Vui lòng nhập Họ"
    }
  }
  
  const validateName = () => {
    const value_input_name = input_name.value
    const regName = /^[a-z A-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/
    if (value_input_name.length !== 0) {
        if (!regName.test(value_input_name)) {
            message_name.innerText = "Tên không hợp lệ"
        } else {
            message_name.innerText = ""
        }
    } else {
        message_name.innerText = "Vui lòng nhập Tên"
    }
  }
  
  const validateEmail = () => {
    const value_input_email = input_email.value
    const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (value_input_email.length !== 0) {
        if (!regEmail.test(value_input_email)) {
            message_email.innerText = "Email không hợp lệ"
        } else {
            message_email.innerText = ""
        }
    } else {
        message_email.innerText = "Vui lòng nhập Email"
    }
  }
  
  const validatePhone = () => {
    const value_input_phone = input_phone.value
    const regPhone = /^[0-9]{10}$/
    if (value_input_phone.length !== 0) {
        if (!regPhone.test(value_input_phone)) {
            message_phone.innerText = "Số điện thoại không hợp lệ"
        } else {
            message_phone.innerText = ""
        }
    } else {
        message_phone.innerText = "Vui lòng nhập Số điện thoại"
    }
  }
  
  const validateAddress = () => {
    const value_input_address = input_address.value
    if (value_input_address === "") {
        message_address.innerText = "Vui lòng nhập Số nhà"
    } else {
        message_address.innerText = ""
    }
  }