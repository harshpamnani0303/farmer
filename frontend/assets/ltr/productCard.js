export async function fetchProducts() {
    try {
        const response = await fetch("http://localhost:5000/api/products");
        const products = await response.json();

        console.log("✅ API Response:", products);
        return products;
    } catch (error) {
        console.error("❌ Error fetching products:", error);
        return [];
    }
}

export function loadProductCard(product) {
    return `
        <div class="col-lg-2 col-md-4 col-sm-6 mb-3">
            <div class="product-card">
                <div class="product-media">
                    <div class="product-label">
                        ${product.discount > 0 ? `<label class="label-text off">-${product.discount}%</label>` : ""}
                    </div>
                    <button class="product-wish wish"><i class="fas fa-heart"></i></button>
                    <a class="product-image" title="Product View" href="#" data-bs-toggle="modal" data-bs-target="#product-view">
                        <img src="images/product/02.jpg" alt="${product.name}">
                    </a>
                </div>
                <div class="product-content">
                    <div class="product-rating">
                        ${Array(5).fill(0).map((_, i) =>
                            i < product.rating.average
                                ? `<i class="active icofont-star"></i>`
                                : `<i class="icofont-star"></i>`
                        ).join("")} (${product.rating.count})
                    </div>
                    <h6 class="product-name">
                        <a class="product-image" title="Product View" href="#" data-bs-toggle="modal" data-bs-target="#product-view">
                            ${product.name}
                        </a>
                    </h6>
                    <h6 class="product-price">
                        <span>₹${product.price}<small>/ ${product.unit}</small></span>
                    </h6>

                    <button class="product-add add-to-cart" 
                        data-id="${product._id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        data-img="images/product/02.jpg">
                        <i class="fas fa-shopping-basket"></i> <span>Add To Cart</span>
                    </button>

                    <button class="product-add buy-now-btn my-2" title="Buy Now" onclick="window.location.href='orderlist.html'">
                        </i> <span>Buy Now</span>
                    </button>

                    <div class="product-action">
                        <button class="action-minus" title="Quantity Minus"><i class="icofont-minus"></i></button>
                        <input class="action-input" title="Quantity Number" type="text" name="quantity" value="1">
                        <button class="action-plus" title="Quantity Plus"><i class="icofont-plus"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ✅ Add to Cart Function
export async function addToCart(userId, productId, productName, productPrice, productImg) {
    try {
        const response = await fetch("http://localhost:5000/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId,
                productId,
                name: productName,
                image: productImg,
                price: productPrice,
                quantity: 1
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to add product to cart");

        console.log("✅ Added to Cart (Backend):", data);
        alert("✅ Product added to cart successfully! 🛒");
        location.reload();
    } catch (error) {
        console.error("❌ Error adding to cart:", error);
        alert("❌ Failed to add product to cart.");
    }
}




// ✅ Event Listener for Add to Cart Button
document.addEventListener("click", function (event) {
    if (event.target.closest(".add-to-cart")) {
        const button = event.target.closest(".add-to-cart");
        const productId = button.getAttribute("data-id");
        const productName = button.getAttribute("data-name");
        const productPrice = parseFloat(button.getAttribute("data-price"));
        const productImg = button.getAttribute("data-img");

        const userId = localStorage.getItem("userId"); // ✅ Get logged-in user ID
        if (!userId) {
            alert("❌ Please log in to add items to the cart.");
            return;
        }

        addToCart(userId, productId, productName, productPrice, productImg);
    }
});
