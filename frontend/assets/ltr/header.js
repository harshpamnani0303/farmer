export function loadHeader() {
    document.addEventListener("DOMContentLoaded", () => {
        // ✅ Update username in header from localStorage
        const userName = localStorage.getItem("userName");
        const userWidget = document.querySelector(".header-widget span");
        if (userName) userWidget.textContent = userName;

        // ✅ Cart Sidebar Toggle
        const cartButtons = document.querySelectorAll(".header-cart, .cart-btn");
        const cartSidebar = document.querySelector(".cart-sidebar");
        const cartCloseButton = document.querySelector(".cart-close");
        const backdrop = document.querySelector(".backdrop");

        cartButtons.forEach(button => {
            button.addEventListener("click", () => {
                document.body.style.overflow = "hidden";
                cartSidebar?.classList.add("active");
                backdrop?.classList.add("visible");
            });
        });

        cartCloseButton?.addEventListener("click", () => {
            document.body.style.overflow = "inherit";
            cartSidebar?.classList.remove("active");
            backdrop?.classList.remove("visible");
        });

        // ✅ Update cart details in header
        function updateCartHeader() {
            const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

            // Update cart count and total price
            document.querySelector(".header-cart sup").textContent = totalItems;
            document.querySelector(".header-cart small").textContent = `₹${totalPrice}`;
        }

        // ✅ Listen for cart updates
        document.addEventListener("cartUpdated", updateCartHeader);

        // Initial cart update
        updateCartHeader();
    });

    return `
        <header class="header-part">
        <div class="container">
            <div class="header-content">
                <div class="header-media-group">
                    <button class="header-user"><img src="images/user.png" alt="user"></button>
                    <a href='index.html'><img src="images/logo.png" alt="logo"></a>
                    <button class="header-src"><i class="fas fa-search"></i></button>
                </div>

                <a class='header-logo' href='index.html'>
                    <h2>Logo</h2>
                </a>

                <a class='header-widget' href='login.html' title='My Account'>
                    <img src="images/user.png" alt="user">
                    <span>join</span>
                </a>
            
                <form class="header-form">
                    <input type="text" placeholder="Search anything...">
                    <button><i class="fas fa-search"></i></button>
                </form>

                <div class="header-widget-group">
                    <a class='header-widget' href='wishlist.html' title='Wishlist'>
                        <i class="fas fa-heart"></i>
                        <sup>0</sup>
                    </a>
                    <button class="header-widget header-cart" title="Cartlist">
                        <i class="fas fa-shopping-basket"></i>
                        <sup>0</sup> <!-- Updated dynamically -->
                        <span>total price <small>₹0.00</small></span> <!-- Updated dynamically -->
                    </button>
                </div>
            </div>
        </div>
    </header>
    `;
}
