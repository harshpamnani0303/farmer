// Event listener to store the selected category in localStorage
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (event) => {
        const link = event.target.closest(".category-link");
        if (link) {
            localStorage.setItem("selectedCategory", link.dataset.category);
        }
    });
});

// Function to load the navbar
export const loadNavbar = () => `
    <nav class="navbar-part">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="navbar-content">
                        <ul class="navbar-list">
                            <li class="navbar-item dropdown">
                                <a class="navbar-link" href="index.html">Home</a>
                            </li>
                            <li class="navbar-item dropdown">
                                <a class="navbar-link" href="about.html">About Us</a>
                            </li>
                            <li class="navbar-item dropdown">
                                <a class="navbar-link" href="contact.html">Contact</a>
                            </li>
                            <li class="navbar-item dropdown">
                                <a class="navbar-link category-link" href="productlist.html" data-category="Vegetables">Vegetables</a>
                            </li>
                            <li class="navbar-item dropdown">
                                <a class="navbar-link category-link" href="productlist.html" data-category="Fruits">Fruits</a>
                            </li>
                            <li class="navbar-item dropdown">
                                <a class="navbar-link category-link" href="productlist.html" data-category="Tools">Tools</a>
                            </li>
                            <li class="navbar-item dropdown">
                                <a class="navbar-link category-link" href="productlist.html" data-category="Seeds">Seeds</a>
                            </li>
                            <li class="navbar-item dropdown">
                                <a class="navbar-link" href="blog.html">Blogs</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
`;
