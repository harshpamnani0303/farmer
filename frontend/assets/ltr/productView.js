// ✅ Create Product Modal Function (ES6 Module)
export function createProductModal({ 
    name, image, price, unit, description, tags 
  }) {
    const modalElement = document.getElementById('product-view');
    const modalContent = modalElement.querySelector('.modal-content');
  
    modalContent.innerHTML = `
      <button class="modal-close icofont-close" data-bs-dismiss="modal"></button>
      <div class="row" id="product-view">
        <div class="col-md-6 col-lg-6">
          <div class="view-gallery">
            <img src="${image}" alt="${name}">
          </div>
        </div>
        <div class="col-md-6 col-lg-6">
          <div class="view-details">
            <h3 class="view-name">${name}</h3>
            <h3 class="view-price">
              <span>₹${price}<small>/${unit}</small></span>
            </h3>
            <p class="view-desc">${description}</p>
            <div class="view-list-group">
              <label class="view-list-title">tags:</label>
              <ul class="view-tag-list">
                ${tags.map(tag => `<li><a href="#">${tag}</a></li>`).join('')}
              </ul>
            </div>
            <div class="view-list-group">
              <label class="view-list-title">Share:</label>
              <ul class="view-share-list">
                <li><a href="#" class="icofont-facebook" title="Facebook"></a></li>
                <li><a href="#" class="icofont-twitter" title="Twitter"></a></li>
                <li><a href="#" class="icofont-linkedin" title="Linkedin"></a></li>
                <li><a href="#" class="icofont-instagram" title="Instagram"></a></li>
              </ul>
            </div>
            <div class="view-add-group">
              <button class="product-add" title="Add to Cart">
                <i class="fas fa-shopping-basket"></i>
                <span>add to cart</span>
              </button>
              <div class="product-action">
                <button class="action-minus" title="Quantity Minus">
                  <i class="icofont-minus"></i>
                </button>
                <input class="action-input" title="Quantity Number" type="text" name="quantity" value="1">
                <button class="action-plus" title="Quantity Plus">
                  <i class="icofont-plus"></i>
                </button>
              </div>
            </div>
            <div class="view-action-group">
              <a class="view-wish wish" href="#" title="Add Your Wishlist">
                <i class="icofont-heart"></i>
                <span>add to wish</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  
    // ✅ Show Bootstrap Modal Using JavaScript API
    const productModal = new bootstrap.Modal(modalElement);
    productModal.show();
  }
  
  // ✅ Event Listener for Product Detail View
  document.addEventListener('click', function (event) {
    const target = event.target.closest('.product-image');
    if (target) {
      createProductModal({
        name: target.dataset.name,
        image: target.dataset.img,
        price: target.dataset.price,
        unit: target.dataset.unit,
        description: target.dataset.desc,
        tags: target.dataset.tags ? target.dataset.tags.split(',') : []
      });
    }
  });
  