document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".project-slider");
    const items = document.querySelectorAll(".project-item");

    if (items.length > 0) {
        const itemStyle = getComputedStyle(items[0]);
        const itemMargin = parseInt(itemStyle.marginRight) || 0;
        const itemWidth = items[0].offsetWidth + itemMargin;
        
        let currentIndex = 0;
        let isScrolling = false;

        // 获取 slider 父容器的宽度
        function getCenterOffset() {
            const containerWidth = slider.parentElement.offsetWidth;
            return (containerWidth - itemWidth) / 2;
        }

        slider.addEventListener("wheel", function (event) {
            event.preventDefault(); // 阻止页面默认滚动

            if (isScrolling) return;
            isScrolling = true;
            setTimeout(() => { isScrolling = false; }, 300); // 防止快速滚动

            if (event.deltaY > 0) {
                currentIndex = Math.min(currentIndex + 1, items.length - 1);
            } else {
                currentIndex = Math.max(currentIndex - 1, 0);
            }

            // 计算正确的滚动偏移
            const scrollPosition = -currentIndex * itemWidth + getCenterOffset();
            slider.style.transform = `translateX(${scrollPosition}px)`;
        });

        // 添加平滑过渡效果
        slider.style.transition = "transform 0.5s ease-in-out";

        // 初始居中
        window.addEventListener("resize", () => {
            const scrollPosition = -currentIndex * itemWidth + getCenterOffset();
            slider.style.transform = `translateX(${scrollPosition}px)`;
        });
    } else {
        console.error("Error: No .project-item elements found!");
    }

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
