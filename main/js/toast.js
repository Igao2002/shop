//thông báo
export const toast = ({ title = "", message = "", type = "", duration = "" }) => {
    const $ = document.querySelector.bind(document);
    // const $$ = document.querySelectorAll.bind(document);

    const main = $("#toast")
    if (main) {
        const toast = document.createElement("div")
        const autoRemove = setTimeout(function () {
            main.removeChild(toast)
        }, duration + 1000)

        toast.onclick = function (e) {
            if (e.target.closest(".toast__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemove);
            }
        }

        const icons = {
            success: "fas fa-check-circle",
            info: "fas fa-info-circle",
            warning: "fas fa-exclamation-circle",
            error: "fas fa-exclamation-circle"
        };

        const delay = (duration / 1000).toFixed(2);
        let icon = icons[type];
        toast.classList.add("toast", `toast--${type}`)
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;
        toast.innerHTML = `
                        <div class="toast__icon">
                            <i class="${icon}"></i>
                        </div>
                        <div class="toast__body">
                            <h3 class="toast__title">${title}</h3>
                            <p class="toast__msg">${message}</p>
                        </div>
                        <div class="toast__close">
                            <i class="fas fa-times"></i>
                        </div>
                    `;
        main.appendChild(toast);
    }
}