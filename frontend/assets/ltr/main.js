// Wishlist Button Toggle
$(document).on("click", ".wish", function () {
    $(this).toggleClass("active");
});

// Add to Cart Button Toggle
$(document).on("click", ".product-add", function () {
    var productAdd = $(this).next(".product-action");
    $(this).hide();
    productAdd.css("display", "flex");
});

// Increment Quantity
$(document).on("click", ".action-plus", function () {
    var inputField = $(this).closest('.product-action').children('.action-input');
    var actionMinus = $(this).closest('.product-action').children('.action-minus');

    let value = parseInt(inputField.val(), 10);
    inputField.val(value + 1);

    if (value >= 1) {
        actionMinus.removeAttr("disabled");
    }
});

// Decrement Quantity
$(document).on("click", ".action-minus", function () {
    var inputField = $(this).closest('.product-action').children('.action-input');
    var productAdd = $(this).closest('.product-card').find('.product-add'); // Select the "Add to Cart" button
    var productAction = $(this).closest('.product-action');

    let value = parseInt(inputField.val(), 10);
    
    if (value > 1) {
        inputField.val(value - 1);
    } else {
        // When quantity is 0, hide action buttons and show "Add to Cart"
        productAction.hide();
        productAdd.show();
        inputField.val(1); // Reset input field to 1
    }
});