export function loadCartSidebar(userId) {
  let cartItems = [];

  async function fetchCart() {
    try {
      console.log(`🛒 Fetching cart for user: ${userId}`);

      const response = await fetch(
        `http://localhost:5000/api/cart/user/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch cart data");

      cartItems = (await response.json()) || []; // Ensure cartItems is an array
      console.log("✅ Cart data:", cartItems);

      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      updateCartUI();
      updateCartHeader();
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
    }
  }

  function checkLoginBeforeCheckout() {
    const isLoggedIn = localStorage.getItem("userId"); // Assume token indicates login
  
    if (isLoggedIn) {
      // ✅ User is logged in, redirect to checkout
      window.location.href = "checkout.html";
    } else {
      // 🚫 User not logged in, show alert and redirect to login page
      const alertContainer = document.createElement("div");
      alertContainer.className = "alert alert-warning alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3";
      alertContainer.style.zIndex = "1050";
      alertContainer.role = "alert";
      alertContainer.innerHTML = `
        <strong>Warning!</strong> You must log in before proceeding to checkout.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      document.body.appendChild(alertContainer);
  
      setTimeout(() => {
        alertContainer.remove();
        window.location.href = "login.html"; // Redirect to login page
      }, 3000);
    }
  }
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.querySelector(".cart-checkout-btn");
    checkoutButton.addEventListener("click", (event) => {
      if (!checkLoginBeforeCheckout()) {
        event.preventDefault(); // Prevent navigation if not logged in
      }
    });
  });
  

  async function updateQuantity(productId, newQuantity) {
    try {
      console.log(
        `🔹 Updating ProductID: ${productId}, New Quantity: ${newQuantity}`
      );

      const response = await fetch("http://localhost:5000/api/cart/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity: newQuantity }),
      });

      if (!response.ok) throw new Error("Failed to update quantity");

      console.log("response h ", response);

      const updatedCart = await response.json();
      console.log("✅ Updated Cart from API:", updatedCart);

      cartItems = updatedCart.items;
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      updateCartUI();
      //   updateCartHeader();
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
      fetchCart(); // Reload the cart if update fails
    }
  }

  async function removeItem(productId) {
    try {
      console.log(`🗑️ Removing ProductID: ${productId}`);

      const response = await fetch(
        `http://localhost:5000/api/cart/remove/${userId}/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to remove item");

      await fetchCart(); // Reload cart after item removal
    } catch (error) {
      console.error("❌ Error removing item:", error);
    }
  }

  function updateCartUI() {
    const cartList = document.querySelector(".cart-list");
    const totalItemsSpan = document.querySelector(".cart-total span");
    const totalPriceSpan = document.querySelector(".checkout-price");

    if (!cartList) {
      console.error("❌ Cart list element not found!");
      return;
    }

    cartList.innerHTML = cartItems.length
      ? cartItems
        .map(
          (item) => `
                <li class="cart-item" data-id="${item.productId}">
                    <div class="cart-media">
                        <a href="#"><img src="${item.image}" alt="${item.name
            }"></a>
                        <button class="cart-delete"><i class="far fa-trash-alt"></i></button>
                    </div>
                    <div class="cart-info-group">
                        <div class="cart-info">
                            <h6><a href="#">${item.name}</a></h6>
                            <p>Unit Price - ₹${item.price.toFixed(2)}</p>
                        </div>
                        <div class="cart-action-group">
                            <div class="product-action">
                                <button class="action-minus"><i class="icofont-minus"></i></button>
                                <input class="quantity" type="text" value="${item.quantity
            }" readonly>
                                <button class="action-plus"><i class="icofont-plus"></i></button>
                            </div>
                            <h6 class="item-total">₹${(
              item.price * item.quantity
            ).toFixed(2)}</h6>
                        </div>
                    </div>
                </li>
            `
        )
        .join("")
      : `<p class="empty-cart">Your cart is empty!</p>`;

    totalItemsSpan.textContent = `Total items (${cartItems.length})`;
    totalPriceSpan.textContent = `₹${cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2)}`;

    addEventListeners(); // Reattach event listeners
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateCartUI(); // Ensure the cart is rendered

    document
      .querySelector(".cart-list")
      .addEventListener("click", function (event) {
        if (event.target.closest(".action-plus")) {
          const cartItem = event.target.closest(".cart-item"); // Find the cart item element
          const itemId = cartItem.dataset.id; // Get product ID
          const item = cartItems.find((item) => item.productId == itemId); // Find item in array

          if (item) {
            console.log(
              `✅ Plus clicked for: ${item.name}, Current Quantity: ${item.quantity}`
            );
            let newQuantity = item.quantity + 1;
            updateQuantity(itemId, newQuantity);
          } else {
            console.error("❌ Item not found in cart!");
          }
        }
      });
    document
      .querySelector(".cart-list")
      .addEventListener("click", function (event) {
        if (event.target.closest(".action-minus")) {
          const cartItem = event.target.closest(".cart-item"); // Find the cart item element
          const itemId = cartItem.dataset.id; // Get product ID
          const item = cartItems.find((item) => item.productId == itemId); // Find item in array

          if (item) {
            let newQuantity = Math.max(1, item.quantity - 1);
            updateQuantity(itemId, newQuantity);
          } else {
            console.error("❌ Item not found in cart!");
          }
        }
      });
      document.querySelector(".checkout").addEventListener("click", () => {
        localStorage.removeItem("checkoutProduct");
        console.log("✅ checkoutProduct removed from local storage");
      });
      

  });

  function updateCartHeader() {
    const totalItems = cartItems.length;
    const totalPrice = cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
    localStorage.setItem("total", totalPrice);
    const cartCount = document.querySelector(".header-cart sup");
    const cartTotal = document.querySelector(".header-cart small");
    // console.log(totalItems);

    if (cartCount && cartTotal) {
      cartCount.textContent = totalItems;
      cartTotal.textContent = `₹${totalPrice}`;
    }
    console.log("Cart Items Before Update:", cartItems);
  }

  function addEventListeners() {
    document.querySelectorAll(".cart-delete").forEach((button) => {
      button.addEventListener("click", function () {
        const cartItem = this.closest(".cart-item");
        if (!cartItem) return;

        const itemId = cartItem.dataset.id;
        removeItem(itemId);
      });
    });

    document
      .querySelector(".cart-close")
      .addEventListener("click", function () {
        document.querySelector(".cart-sidebar").classList.remove("open");
      });
  }



  fetchCart();

  return `
        <aside class="cart-sidebar">
            <div class="cart-header">
                <div class="cart-total">
                    <i class="fas fa-shopping-basket"></i>
                    <span>Total items (0)</span>
                </div>
                <button class="cart-close"><i class="icofont-close"></i></button>
            </div>
            <ul class="cart-list"></ul>
            <div class="cart-footer">
                <button class="coupon-btn">Do you have a coupon code?</button>
                <form class="coupon-form">
                    <input type="text" placeholder="Enter your coupon code">
                    <button type="submit"><span>Apply</span></button>
                </form>
                <a class='checkout cart-checkout-btn' href='checkout.html' >
                    <span class="checkout-label">Proceed to Checkout</span>
                    <span class="checkout-price">₹0.00</span>
                </a>
            </div>
        </aside>
    `;
}

