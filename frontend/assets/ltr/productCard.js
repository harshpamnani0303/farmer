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
          <a class="product-image" 
   title="Product View" 
   href="#" 
   data-name="${product.name}" 
   data-img="http://localhost:5000${product.image}" 
   data-price="${product.price}" 
   data-unit="${product.unit}" 
   data-desc="${product.description || 'No description available'}" 
   data-tags="${product.tags ? product.tags.join(',') : ''}">
   <img src="http://localhost:5000${product.image}" alt="${product.name}">
</a>

        </div>
        <div class="product-content">
          <h6 class="product-name">
            <a href="#" 
               class="product-image"
               data-bs-toggle="modal" 
               data-bs-target="#product-view"
               data-name="${product.name}" 
               data-img="http://localhost:5000${product.image}" 
               data-price="${product.price}" 
               data-unit="${product.unit}" 
               data-desc="${product.description || 'No description available'}" 
               data-tags="${product.tags ? product.tags.join(',') : ''}">
              ${product.name}
            </a>
          </h6>
          <h6 class="product-price">
            <span>₹${product.price}<small>/ ${product.category === 'Tools' ? 'piece' : product.unit}</small></span>
          </h6>

                    <button class="btn btn-inline add-to-cart " 
                        data-id="${product._id}" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        data-img="http://localhost:5000${product.image}"
                        style="width: 100%; height: 40px; padding: 0 10px; margin-top: 10px;">
                        <i class="fas fa-shopping-basket"></i> <span >Add To Cart</span>
                    </button>

                    <button class="product-add buy-now-btn my-2 " title="Buy Now" onclick="window.location.href='checkout.html'">
                        </i> <span>Buy Now</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ✅ Add to Cart Function
export async function addToCart(
  userId,
  productId,
  productName,
  productPrice,
  productImg
) {
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
        quantity: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok)
      throw new Error(data.error || "Failed to add product to cart");

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

// ✅ Event Listener for Buy Now Button
document.addEventListener("click", function (event) {
  if (event.target.closest(".buy-now-btn")) {
    // ✅ Check if user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("❌ Please log in to not buy any product");
      window.location.href = "login.html"; // Redirect to login page if not logged in
      return; // Stop further execution
    }

    const card = event.target.closest(".product-card");

    // ✅ Collect product data from existing elements
    const product = {
      id: card.querySelector(".add-to-cart").getAttribute("data-id"),
      name: card.querySelector(".add-to-cart").getAttribute("data-name"),
      price: card.querySelector(".add-to-cart").getAttribute("data-price"),
      image: card.querySelector(".add-to-cart").getAttribute("data-img"),
      unit: card.querySelector(".product-image").getAttribute("data-unit"),
      description: card.querySelector(".product-image").getAttribute("data-desc"),
      quantity: 1
    };

    // ✅ Store product data in local storage
    localStorage.setItem("checkoutProduct", JSON.stringify(product));
    console.log("✅ Checkout Product Saved:", product);

    // ✅ Redirect to checkout page
    window.location.href = "checkout.html";
  }
});
