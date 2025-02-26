export function loadHeader() {
  document.addEventListener("DOMContentLoaded", () => {
    // ✅ Update username in header from localStorage
    const userName = localStorage.getItem("userName");
    const userWidget = document.querySelector(".header-widget span");

    if (userName) {
      userWidget.textContent = userName;
    }


    // ✅ Cart Sidebar Toggle
    const cartButtons = document.querySelectorAll(".header-cart, .cart-btn");
    const cartSidebar = document.querySelector(".cart-sidebar");
    const cartCloseButton = document.querySelector(".cart-close");
    const backdrop = document.querySelector(".backdrop");

    cartButtons.forEach((button) => {
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
      console.log("Updating cart...");

      // ✅ Get updated cart from localStorage
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      const totalItems = cartItems.length;

      // ✅ Select elements safely
      const cartCountElement = document.querySelector(".header-cart sup");


      // ✅ Update cart count and total price if elements exist
      if (cartCountElement) {
        cartCountElement.textContent = totalItems;
      } else {
        console.warn("⚠️ Cart count element not found!");
      }

    }
    // ✅ Listen for "cartUpdated" event to update the UI immediately
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

               <a class='header-logo' href='index.htm'>
                        <img src="images/logo.png" alt="logo">
                    </a>

                <form class="header-form">
                    <input type="text" placeholder="Search anything...">
                    <button><i class="fas fa-search"></i></button>
                </form>

                <div class="header-widget-group">
                    <button class="header-widget header-cart" title="Cartlist">
                        <i class="fas fa-shopping-basket"></i>
                        <sup>0</sup> <!-- Updated dynamically -->
                        
                    </button>

                    <a class='header-widget' href='profile.html' title='My Account'>
                    <img src="images/user.png" alt="user">
                    <span>join</span>
                </a>
                </div>
            </div>
        </div>
    </header>
    `;
}

