import { db } from './app.js'; // Aapki central Firebase setup file (app.js)
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// DOM Element target karna jahan saare cards show karne hain
const productsContainer = document.getElementById("all-products-container");

// Database node target karna
const productsRef = ref(db, "products");

// FIREBASE SE REALTIME DATA FETCH KARNA
onValue(productsRef, (snapshot) => {
    productsContainer.innerHTML = ""; // Loader/Purana content clear karne ke liye

    if (snapshot.exists()) {
        const data = snapshot.val();
        
        // Loop chalana taake jitne products hain sab ka alag card bane
        Object.keys(data).forEach((key) => {
            const product = data[key];

            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            // Card HTML taiyar karna dynamically
            productCard.innerHTML = `
                <div class="img-wrapper">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                
                 ${product.desc.length > 40 ? product.desc.substring(0, 40) + "..." : product.desc}
                <h4>Rs. ${product.price}</h4>
                <button class="cart-btn" 
                        data-id="${key}" 
                        data-name="${product.name}" 
                        data-price="${product.price}" 
                        data-img="${product.img}">
                    Add To Cart <i class="fa-solid fa-cart-shopping"></i>
                </button>
            `;

            productsContainer.appendChild(productCard);
        });

        // Cards banne ke baad Add to Cart buttons ko click listeners dena
        activateCartButtons();

    } else {
        // Agar database khali ho toh yeh message show hoga
        productsContainer.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color:#64748b; font-size:18px;">No products available in store right now.</p>`;
    }
});

// LOCAL STORAGE ADD TO CART SYSTEM
function activateCartButtons() {
    const cartButtons = document.querySelectorAll(".cart-btn");

    cartButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Button ke andar se attributes data extract karna
            const id = btn.getAttribute("data-id");
            const name = btn.getAttribute("data-name");
            const price = btn.getAttribute("data-price");
            const img = btn.getAttribute("data-img");

            // Purani saved cart uthana ya empty array banana
            let cart = JSON.parse(localStorage.getItem("userCart")) || [];

            // Check karna ke product pehle se cart mein toh nahi
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1; // Quantity badhao agar pehle se mojood hai
            } else {
                // Naya item push karo cart array mein
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    img: img,
                    quantity: 1
                });
            }

            // Cart data ko browser memory (localStorage) mein wapis save karna
            localStorage.setItem("userCart", JSON.stringify(cart));
            window.updateNavbarCartCount();

            // VIP Top-Right Toast Notification
            Swal.fire({
                icon: 'success',
                title: 'Added to Cart!',
                text: `${name} has been added successfully.`,
                showConfirmButton: false,
                timer: 1500,
                toast: true,
                position: 'top-end',
                iconColor: '#00bcd4',
                background: '#ffffff'
            });
        });
    });

}

// index.js aur products.js dono ke bilkul end mein paste kar dein

function updateNavbarCartCount() {
    const cartCountBadge = document.getElementById("cart-count");
    if (cartCountBadge) {
        let cart = JSON.parse(localStorage.getItem("userCart")) || [];
        let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountBadge.innerText = totalItems;
    }
}

// Page load hote hi chal jaye
updateNavbarCartCount();
window.updateNavbarCartCount = updateNavbarCartCount;