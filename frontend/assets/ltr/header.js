export function loadHeader() {
  document.addEventListener("DOMContentLoaded", () => {
    // ✅ Update username in header from localStorage
    const userName = localStorage.getItem("userName");
    const userWidget = document.querySelector(".header-widget span");

    if (userName) {
      userWidget.textContent = userName;
      userWidget.closest("a").setAttribute("href", "#"); // Prevent login redirection
      userWidget.closest("a").addEventListener("click", showLogoutModal);
    }

    function showLogoutModal() {
      const modal = document.createElement("div");
      modal.innerHTML = `
        <div class="modal fade show" id="logout-modal" style="display:flex; background:rgba(0,0,0,0.5); position:fixed; inset:0; align-items:center; justify-content:center;">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-5 text-center shadow-lg rounded-lg" style="background: #fff; border-radius: 12px; position:relative; width: 350px;">
              <button class="close-btn" id="close-modal" style="position:absolute; top:10px; right:10px; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
              <div class="modal-body">
                <p style="font-size: 1rem; font-weight: bold; color: black;">You are logged out, ${userName}</p>
                <button class="btn btn-success mt-3" id="logout-button">Logout</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    
      // Logout functionality
      document.getElementById("logout-button").addEventListener("click", () => {
        localStorage.removeItem("userName"); // Remove user data
        localStorage.removeItem("userId"); // Remove userID
        location.reload(); // Refresh the page
      });
    
      // Close modal functionality
      document.getElementById("close-modal").addEventListener("click", () => {
        modal.style.display = "none"; // Hide the modal instead of removing
      });
    
      // Close modal on outside click
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
      });
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
      console.log("pass"); 
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      console.log("pass"); 

      const totalItems = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      const totalPrice = cartItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);

      // Update cart count and total price
      document.querySelector(".header-cart sup").textContent = totalItems;
      document.querySelector(
        ".header-cart small"
      ).textContent = `₹${totalPrice}`;

      
      
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

               <a class='header-logo' href='index.htm'>
                        <img src="images/logo.png" alt="logo">
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