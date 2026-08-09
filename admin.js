const productForm = document.getElementById("productForm");

if (productForm) {
    productForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const product = {
            name: document.getElementById("productName").value.trim(),
            category: document.getElementById("productCategory").value,
            image: document.getElementById("productImage").value.trim(),
            description: document.getElementById("productDescription").value.trim(),
            affiliateLink: document.getElementById("affiliateLink").value.trim()
        };

        if (!product.name || !product.category || !product.description || !product.affiliateLink) {
            alert("Please fill all required fields.");
            return;
        }

        let products = JSON.parse(localStorage.getItem("sengolProducts")) || [];

        product.id = Date.now();

        products.push(product);

        localStorage.setItem("sengolProducts", JSON.stringify(products));

        alert("Product saved successfully!");

        productForm.reset();
    });
}
