 /* =========================================================
   SENGOL SHOPPING — SCRIPT.JS
========================================================= */


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.querySelector(".menu-btn");

const menu =
    document.querySelector(".menu");


if (menuButton && menu) {

    menuButton.addEventListener(
        "click",
        function () {

            menu.classList.toggle(
                "menu-open"
            );

            const isOpen =
                menu.classList.contains(
                    "menu-open"
                );

            menuButton.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    /* Close menu after clicking a link */

    const menuLinks =
        menu.querySelectorAll("a");


    menuLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                menu.classList.remove(
                    "menu-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });

}


/* =========================================================
   PRODUCT STORAGE
========================================================= */

const PRODUCT_STORAGE_KEY =
    "sengolShoppingProducts";


function getWebsiteProducts() {

    try {

        return JSON.parse(
            localStorage.getItem(
                PRODUCT_STORAGE_KEY
            )
        ) || [];

    } catch (error) {

        console.error(
            "Unable to load products:",
            error
        );

        return [];

    }

}


/* =========================================================
   PRODUCT CARD CREATOR
========================================================= */

function createProductCard(product) {

    const article =
        document.createElement("article");

    article.className =
        "product-card";


    const image =
        product.image ||
        "https://via.placeholder.com/600x400?text=Sengol+Shopping";


    const priceHTML =
        product.price
            ? `<p class="product-price">₹${escapeHTML(product.price)}</p>`
            : "";


    const discountHTML =
        product.discount
            ? `<span class="product-discount">
                ${escapeHTML(product.discount)}
               </span>`
            : "";


    const rating =
        product.rating || "5";


    article.innerHTML = `

        <div class="product-image">

            <img
                src="${escapeHTML(image)}"
                alt="${escapeHTML(product.name)}"
                onerror="
                    this.src='https://via.placeholder.com/600x400?text=Sengol+Shopping'
                "
            >

        </div>


        <div class="product-info">

            <p class="product-category">
                ${escapeHTML(product.category || "Other")}
            </p>

            <h3>
                ${escapeHTML(product.name)}
            </h3>

            ${priceHTML}

            ${discountHTML}

            <p class="product-rating">
                Rating: ${escapeHTML(rating)} / 5
            </p>

            <p>
                ${escapeHTML(product.description || "")}
            </p>


            <a
                href="${escapeHTML(product.affiliateLink || product.link || "#")}"
                class="product-btn"
                target="_blank"
                rel="noopener noreferrer nofollow"
            >
                Shop Now →
            </a>

        </div>

    `;


    return article;

}


/* =========================================================
   LOAD TRENDING PRODUCTS
========================================================= */

function loadTrendingProducts() {

    const container =
        document.querySelector(
            "#trending .product-grid"
        );


    if (!container) return;


    const products =
        getWebsiteProducts();


    const trending =
        products.filter(
            product =>
                product.trending === true
        );


    if (trending.length === 0) {

        return;

    }


    container.innerHTML = "";


    trending.forEach(function (product) {

        container.appendChild(
            createProductCard(product)
        );

    });

}


/* =========================================================
   LOAD FEATURED PRODUCTS
========================================================= */

function loadFeaturedProducts() {

    const container =
        document.querySelector(
            "#featured .featured-box"
        );


    if (!container) return;


    const products =
        getWebsiteProducts();


    const featured =
        products.filter(
            product =>
                product.featured === true
        );


    if (featured.length === 0) {

        return;

    }


    container.innerHTML = "";


    featured.forEach(function (product) {

        container.appendChild(
            createProductCard(product)
        );

    });

}


/* =========================================================
   CATEGORY LINKS
========================================================= */

function setupCategoryLinks() {

    const categoryCards =
        document.querySelectorAll(
            ".category-card"
        );


    categoryCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function (event) {

                const categoryName =
                    card.querySelector("h3");


                if (!categoryName) return;


                const category =
                    categoryName.textContent
                        .replace(
                            "Sengol ",
                            ""
                        )
                        .trim();


                const products =
                    getWebsiteProducts();


                const matching =
                    products.filter(
                        product =>
                            product.category
                            .toLowerCase() ===
                            category.toLowerCase()
                    );


                if (matching.length > 0) {

                    event.preventDefault();


                    const trending =
                        document.getElementById(
                            "trending"
                        );


                    if (trending) {

                        trending.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

                }

            }
        );

    });

}


/* =========================================================
   FAQ
========================================================= */

function setupFAQ() {

    const details =
        document.querySelectorAll(
            ".faq details"
        );


    details.forEach(function (item) {

        item.addEventListener(
            "toggle",
            function () {

                if (!item.open) return;


                details.forEach(
                    function (other) {

                        if (
                            other !== item &&
                            other.open
                        ) {

                            other.open = false;

                        }

                    }
                );

            }
        );

    });

}


/* =========================================================
   SMOOTH INTERNAL LINKS
========================================================= */

function setupSmoothLinks() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const targetID =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetID ||
                    targetID === "#"
                ) {

                    return;

                }


                const target =
                    document.querySelector(
                        targetID
                    );


                if (!target) return;


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

    return String(value || "")

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIALIZE WEBSITE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTrendingProducts();

        loadFeaturedProducts();

        setupCategoryLinks();

        setupFAQ();

        setupSmoothLinks();

    }
);
