 /* =========================================================
   SENGOL SHOPPING — ADMIN.JS
   Product Management System
========================================================= */

const STORAGE_KEY = "sengolShoppingProducts";

let editId = null;


/* =========================================================
   ELEMENTS
========================================================= */

const productForm = document.getElementById("productForm");

const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productDiscount = document.getElementById("productDiscount");
const productImage = document.getElementById("productImage");
const productDescription = document.getElementById("productDescription");
const affiliateLink = document.getElementById("affiliateLink");
const productRating = document.getElementById("productRating");

const isTrending = document.getElementById("isTrending");
const isFeatured = document.getElementById("isFeatured");

const productList = document.getElementById("productList");
const searchProducts = document.getElementById("searchProducts");

const clearBtn = document.getElementById("clearBtn");
const cancelBtn = document.getElementById("cancelBtn");

const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");

const imagePreview = document.getElementById("imagePreview");
const previewImage = document.getElementById("previewImage");


/* =========================================================
   GET PRODUCTS
========================================================= */

function getProducts() {

    try {

        return JSON.parse(
            localStorage.getItem(STORAGE_KEY)
        ) || [];

    } catch (error) {

        console.error("Product data error:", error);

        return [];

    }

}


/* =========================================================
   SAVE PRODUCTS
========================================================= */

function saveProducts(products) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(products)
    );

}


/* =========================================================
   RESET FORM
========================================================= */

function resetForm() {

    if (!productForm) return;

    productForm.reset();

    editId = null;

    if (formTitle) {
        formTitle.textContent = "Add Product";
    }

    if (submitBtn) {
        submitBtn.textContent = "Add Product";
    }

    if (cancelBtn) {
        cancelBtn.style.display = "none";
    }

    if (imagePreview) {
        imagePreview.style.display = "none";
    }

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

if (productImage) {

    productImage.addEventListener(
        "input",
        function () {

            const url = productImage.value.trim();

            if (!url) {

                if (imagePreview) {
                    imagePreview.style.display = "none";
                }

                return;

            }

            if (previewImage) {

                previewImage.src = url;

                previewImage.onload = function () {

                    imagePreview.style.display = "block";

                };

                previewImage.onerror = function () {

                    imagePreview.style.display = "none";

                };

            }

        }
    );

}


/* =========================================================
   ADD / UPDATE PRODUCT
========================================================= */

if (productForm) {

    productForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                productName.value.trim();

            const category =
                productCategory.value;

            const description =
                productDescription.value.trim();

            const link =
                affiliateLink.value.trim();


            if (
                !name ||
                !category ||
                !description ||
                !link
            ) {

                alert(
                    "Please fill all required fields."
                );

                return;

            }


            const products =
                getProducts();


            const product = {

                id:
                    editId ||
                    Date.now().toString(),

                name:
                    name,

                category:
                    category,

                price:
                    productPrice.value.trim(),

                discount:
                    productDiscount.value.trim(),

                image:
                    productImage.value.trim(),

                description:
                    description,

                affiliateLink:
                    link,

                rating:
                    productRating.value || "5",

                trending:
                    isTrending.checked,

                featured:
                    isFeatured.checked,

                updatedAt:
                    new Date().toISOString()

            };


            /* UPDATE */

            if (editId) {

                const index =
                    products.findIndex(
                        item => item.id === editId
                    );


                if (index !== -1) {

                    products[index] =
                        product;

                }


                alert(
                    "Product updated successfully!"
                );


            }


            /* ADD */

            else {

                products.unshift(product);

                alert(
                    "Product added successfully!"
                );

            }


            saveProducts(products);

            resetForm();

            renderProducts();

            updateStats();

        }
    );

}


/* =========================================================
   RENDER PRODUCT LIST
========================================================= */

function renderProducts() {

    if (!productList) return;


    const products =
        getProducts();


    const query =
        searchProducts
            ? searchProducts.value
                .toLowerCase()
                .trim()
            : "";


    const filtered =
        products.filter(function (product) {

            return (

                product.name
                    .toLowerCase()
                    .includes(query)

                ||

                product.category
                    .toLowerCase()
                    .includes(query)

            );

        });


    if (filtered.length === 0) {

        productList.innerHTML = `
            <div class="empty">
                No products found.
            </div>
        `;

        return;

    }


    productList.innerHTML =
        filtered.map(function (product) {

            const image =
                product.image ||
                "https://via.placeholder.com/300x200?text=Sengol+Shopping";


            const price =
                product.price
                    ? "₹" + escapeHTML(product.price)
                    : "Price not set";


            return `

                <div class="product-item">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${escapeHTML(product.name)}"
                        onerror="
                            this.src='https://via.placeholder.com/300x200?text=Sengol+Shopping'
                        "
                    >


                    <div>

                        <h3>
                            ${escapeHTML(product.name)}
                        </h3>

                        <p>
                            ${escapeHTML(product.category)}
                        </p>

                        <p>
                            ${price}
                        </p>

                        <p>
                            Rating:
                            ${escapeHTML(product.rating || "5")}
                        </p>

                        <p>

                            ${
                                product.trending
                                ? "Trending"
                                : ""
                            }

                            ${
                                product.featured
                                ? " • Featured"
                                : ""
                            }

                        </p>

                    </div>


                    <div class="product-actions">

                        <button
                            class="small-btn edit-btn"
                            onclick="editProduct('${product.id}')"
                        >
                            Edit
                        </button>


                        <button
                            class="small-btn delete-btn"
                            onclick="deleteProduct('${product.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;

        }).join("");

}


/* =========================================================
   EDIT PRODUCT
========================================================= */

function editProduct(id) {

    const products =
        getProducts();


    const product =
        products.find(
            item => item.id === id
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    productName.value =
        product.name || "";

    productCategory.value =
        product.category || "";

    productPrice.value =
        product.price || "";

    productDiscount.value =
        product.discount || "";

    productImage.value =
        product.image || "";

    productDescription.value =
        product.description || "";

    affiliateLink.value =
        product.affiliateLink || "";

    productRating.value =
        product.rating || "5";

    isTrending.checked =
        Boolean(product.trending);

    isFeatured.checked =
        Boolean(product.featured);


    editId =
        product.id;


    if (formTitle) {

        formTitle.textContent =
            "Edit Product";

    }


    if (submitBtn) {

        submitBtn.textContent =
            "Update Product";

    }


    if (cancelBtn) {

        cancelBtn.style.display =
            "inline-block";

    }


    if (
        product.image &&
        previewImage &&
        imagePreview
    ) {

        previewImage.src =
            product.image;

        imagePreview.style.display =
            "block";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   DELETE PRODUCT
========================================================= */

function deleteProduct(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {

        return;

    }


    const products =
        getProducts();


    const updatedProducts =
        products.filter(
            product => product.id !== id
        );


    saveProducts(
        updatedProducts
    );


    renderProducts();

    updateStats();


    alert(
        "Product deleted successfully!"
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (searchProducts) {

    searchProducts.addEventListener(
        "input",
        function () {

            renderProducts();

        }
    );

}


/* =========================================================
   CLEAR
========================================================= */

if (clearBtn) {

    clearBtn.addEventListener(
        "click",
        function () {

            resetForm();

        }
    );

}


/* =========================================================
   CANCEL EDIT
========================================================= */

if (cancelBtn) {

    cancelBtn.addEventListener(
        "click",
        function () {

            resetForm();

        }
    );

}


/* =========================================================
   STATISTICS
========================================================= */

function updateStats() {

    const products =
        getProducts();


    const total =
        document.getElementById(
            "totalProducts"
        );


    const fashion =
        document.getElementById(
            "fashionCount"
        );


    const electronics =
        document.getElementById(
            "electronicsCount"
        );


    const featured =
        document.getElementById(
            "featuredCount"
        );


    if (total) {

        total.textContent =
            products.length;

    }


    if (fashion) {

        fashion.textContent =
            products.filter(
                product =>
                    product.category === "Fashion"
            ).length;

    }


    if (electronics) {

        electronics.textContent =
            products.filter(
                product =>
                    product.category === "Electronics"
            ).length;

    }


    if (featured) {

        featured.textContent =
            products.filter(
                product =>
                    product.featured === true
            ).length;

    }

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value || "")

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================================================
   INITIALIZE
========================================================= */

renderProducts();

updateStats();
