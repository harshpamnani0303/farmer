export function loadCartSidebar(userId) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    async function fetchCart(userId) {
        try {
            console.log(`Fetching cart for user: ${userId}`);

            const response = await fetch(`http://localhost:5000/api/cart/user/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch cart data");

            cartItems = await response.json();
            console.log("✅ Cart data:", cartItems);

            localStorage.setItem("cartItems", JSON.stringify(cartItems)); // 🔥 Backend ka data save karo
            updateCartUI();
            updateCartHeader();
        } catch (error) {
            console.error("❌ Error fetching cart:", error);
        }
    }

    async function updateCart(userId, productId, quantity) {
        try {
            const response = await fetch("http://localhost:5000/api/cart/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, productId, quantity }),
            });

            if (!response.ok) throw new Error("Failed to update cart");

            const updatedCart = await response.json();
            console.log("✅ Updated Cart:", updatedCart);

            localStorage.setItem("cartItems", JSON.stringify(updatedCart)); // ✅ Updated data save karo
            updateCartUI();
            updateCartHeader();

        } catch (error) {
            console.error("❌ Error updating cart:", error);
        }
    }

    async function removeItem(userId, productId) {
        try {
            const response = await fetch(`http://localhost:5000/api/cart/remove/${userId}/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to remove item");

            await fetchCart(userId); // ✅ Remove ke baad backend se latest cart lo
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
            ? cartItems.map(item => `
                <li class="cart-item" data-id="${item.productId}">
                    <div class="cart-media">
                        <a href="#"><img src="${item.image}" alt="${item.name}"></a>
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
                                <input class="action-input" type="text" value="${item.quantity}" readonly>
                                <button class="action-plus"><i class="icofont-plus"></i></button>
                            </div>
                            <h6 class="item-total">₹${(item.price * item.quantity).toFixed(2)}</h6>
                        </div>
                    </div>
                </li>
            `).join("")
            : `<p class="empty-cart">Your cart is empty!</p>`;

        totalItemsSpan.textContent = `Total items (${cartItems.length})`;
        totalPriceSpan.textContent = `₹${cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}`;

        addEventListeners(); // ✅ Events refresh karo
    }

    function updateCartHeader() {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

        const cartCount = document.querySelector(".header-cart sup");
        const cartTotal = document.querySelector(".header-cart small");

        if (cartCount && cartTotal) {
            cartCount.textContent = totalItems;
            cartTotal.textContent = `₹${totalPrice}`;
        }
    }

    function addEventListeners() {
        document.querySelectorAll(".action-plus").forEach(button => {
            button.onclick = async function () {
                const cartItem = this.closest(".cart-item");
                if (!cartItem) return;
    
                const itemId = cartItem.dataset.id;
                const item = cartItems.find(i => String(i.productId) === String(itemId));
    
                console.log(`🔹 Plus Clicked: ProductID: ${itemId}, Current Quantity: ${item ? item.quantity : 'Not Found'}`);
    
                if (item) {
                    try {
                        const newQuantity = item.quantity + 1;
                        console.log(`🔹 Sending API Request: ${itemId}, New Quantity: ${newQuantity}`);
    
                        const response = await fetch("http://localhost:5000/api/cart/update", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId, productId: itemId, quantity: newQuantity }),
                        });
    
                        console.log("🔹 API Response:", response);
    
                        if (!response.ok) throw new Error("Failed to update quantity");
    
                        const updatedCart = await response.json();
                        console.log("✅ Updated Cart from API:", updatedCart);
    
                        cartItems = updatedCart.items;
                        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
                        updateCartUI();
                        updateCartHeader();
                    } catch (error) {
                        console.error("❌ Error updating quantity:", error);
                    }
                }
            };
        });
    
        document.querySelectorAll(".action-minus").forEach(button => {
            button.onclick = async function () {
                const cartItem = this.closest(".cart-item");
                if (!cartItem) return;
    
                const itemId = cartItem.dataset.id;
                const item = cartItems.find(i => String(i.productId) === String(itemId));
    
                console.log(`🔹 Minus Clicked: ProductID: ${itemId}, Current Quantity: ${item ? item.quantity : 'Not Found'}`);
    
                if (item && item.quantity > 1) {
                    try {
                        const newQuantity = item.quantity - 1;
                        console.log(`🔹 Sending API Request: ${itemId}, New Quantity: ${newQuantity}`);
    
                        const response = await fetch("http://localhost:5000/api/cart/update", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId, productId: itemId, quantity: newQuantity }),
                        });
    
                        console.log("🔹 API Response:", response);
    
                        if (!response.ok) throw new Error("Failed to update quantity");
    
                        const updatedCart = await response.json();
                        console.log("✅ Updated Cart from API:", updatedCart);
    
                        cartItems = updatedCart.items;
                        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    
                        updateCartUI();
                        updateCartHeader();
                    } catch (error) {
                        console.error("❌ Error updating quantity:", error);
                    }
                }
            };
        });
    }
    
    
    

    fetchCart(userId);

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
                <a class='cart-checkout-btn' href='checkout.html'>
                    <span class="checkout-label">Proceed to Checkout</span>
                    <span class="checkout-price">₹0.00</span>
                </a>
            </div>
        </aside>
    `;
}
