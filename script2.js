document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".project-slider");
    const pages = document.querySelectorAll(".project-page");

    let currentIndex = 0;
    let isScrolling = false;

  // 确保 slider 宽度等于单个页面宽度的总和
  function updateSliderWidth() {
    slider.style.width = `${pages.length * 100}vw`;
    pages.forEach(page => {
        page.style.width = "100vw"; // 确保每个页面占满整个视口
    });
}

function updateSlider() {
    const offset = -currentIndex * window.innerWidth;
    slider.style.transform = `translateX(${offset}px)`;
    slider.style.transition = "transform 0.5s ease-in-out";
}

document.addEventListener("wheel", function (event) {
    event.preventDefault();
    if (isScrolling) return;
    isScrolling = true;
    setTimeout(() => { isScrolling = false; }, 500);

    if (event.deltaY > 0) {
        currentIndex = Math.min(currentIndex + 1, pages.length - 1);
    } else {
        currentIndex = Math.max(currentIndex - 1, 0);
    }
    updateSlider();
});

window.addEventListener("resize", function () {
    updateSliderWidth();
    updateSlider();
});

document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight") {
        currentIndex = Math.min(currentIndex + 1, pages.length - 1);
    } else if (event.key === "ArrowLeft") {
        currentIndex = Math.max(currentIndex - 1, 0);
    }
    updateSlider();
});

updateSliderWidth(); // 初始化时确保 slider 宽度正确
updateSlider();

    // 窗口调整时，重新计算滚动位置
    window.addEventListener("resize", updateSlider);

    // 初始化滚动位置
    updateSlider();

    // 窗口调整时，重新计算滚动位置
    window.addEventListener("resize", updateSlider);

    // 初始化滚动位置
    updateSlider();

    // 让点击 project-item 时跳转到对应的页面
    document.querySelectorAll(".project-item").forEach(item => {
        item.addEventListener("click", function () {
            const url = item.getAttribute("data-url");
            if (url) {
                window.location.href = url; // 跳转到项目详情页
            } else {
                console.error("Error: data-url is missing on", item);
            }
        });
    });

    // 处理 dropdown-menu 由 click 触发
    let activeDropdown = null; // 追踪当前打开的菜单
    document.querySelectorAll("nav ul li").forEach(item => {
        const dropdown = item.querySelector(".dropdown-menu");

        if (!dropdown) return;

        item.addEventListener("click", function (event) {
            event.stopPropagation(); // 阻止事件冒泡，避免触发 document 关闭事件

            // 检查当前菜单是否已打开
            const isOpen = dropdown.classList.contains("show");

            // 先关闭所有下拉菜单
            document.querySelectorAll(".dropdown-menu").forEach(menu => {
                menu.classList.remove("show");
                menu.style.opacity = "0";
                menu.style.visibility = "hidden";
                menu.style.transform = "translateY(10px)";
            });

            // 如果当前菜单原本是关闭的，则打开它
            if (!isOpen) {
                dropdown.classList.add("show");
                dropdown.style.opacity = "1";
                dropdown.style.visibility = "visible";
                dropdown.style.transform = "translateY(0)";
                activeDropdown = dropdown; // 记录当前打开的菜单
            } else {
                activeDropdown = null;
            }
        });
    });

    // 点击页面其他地方时，关闭所有 dropdown-menu
    document.addEventListener("click", function () {
        if (activeDropdown) {
            activeDropdown.classList.remove("show");
            activeDropdown.style.opacity = "0";
            activeDropdown.style.visibility = "hidden";
            activeDropdown.style.transform = "translateY(10px)";
            activeDropdown = null;
        }
    });

    // 监听窗口缩放，自动刷新页面（防止频繁刷新）
    let lastWidth = window.innerWidth;
    let lastHeight = window.innerHeight;
    let resizeTimer;

    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {
            let widthChange = Math.abs(window.innerWidth - lastWidth);
            let heightChange = Math.abs(window.innerHeight - lastHeight);

            if (widthChange > 50 || heightChange > 50) { // 仅当变化超过 50px 才刷新
                location.reload();
            }

            lastWidth = window.innerWidth;
            lastHeight = window.innerHeight;
        }, 300);
    });
});
