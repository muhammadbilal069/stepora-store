import { auth } from './app.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { db } from './app.js';
import { ref, onValue } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// !!! APNI REAL ADMIN UID !!!
const ADMIN_UID = "m6QZjaIbqMQ9Qo732x7bKLeOCgx2";

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const dashboardBtn = document.getElementById("dashboardBtn");
const logoutBtn = document.getElementById("logoutBtn");
// togglr btn wla work  
const mobileLoginBtn = document.getElementById("mobileLoginBtn");
const mobileSignupBtn = document.getElementById("mobileSignupBtn");
const mobileDashboardBtn = document.getElementById("mobileDashboardBtn");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");
// mag top wala kam 
const welcomeMsg = document.getElementById("welcome-msg"); // Welcome span access
const topBar = document.querySelector(".top-bar");

onAuthStateChanged(auth, (user) => {
    if (user) {
        // Jab koi bhi user login ho
        if (loginBtn) loginBtn.style.display = "none";
        if (signupBtn) signupBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";

        // Mobile buttons hide/show
        if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
        if (mobileSignupBtn) mobileSignupBtn.style.display = "none";
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = "block";

        // Top Bar Logic Start
        if (topBar) topBar.style.display = "flex";

        const userName = localStorage.getItem("userName");
        if (welcomeMsg && userName) {
            welcomeMsg.innerHTML = `<i class="fa-solid fa-user-circle"></i> Welcome, ${userName}`;
        }

        // Admin Check
        if (user.uid === ADMIN_UID) {
            if (dashboardBtn) dashboardBtn.style.display = "inline-block";
            if (mobileDashboardBtn) mobileDashboardBtn.style.display = "block";
        } else {
            if (dashboardBtn) dashboardBtn.style.display = "none";
            if (mobileDashboardBtn) mobileDashboardBtn.style.display = "none";
        }

    } else {

        // Desktop
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (signupBtn) signupBtn.style.display = "inline-block";
        if (dashboardBtn) dashboardBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "none";

        // Mobile
        if (mobileLoginBtn) mobileLoginBtn.style.display = "block";
        if (mobileSignupBtn) mobileSignupBtn.style.display = "block";
        if (mobileDashboardBtn) mobileDashboardBtn.style.display = "none";
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = "none";

        if (welcomeMsg) welcomeMsg.innerHTML = "";
        if (topBar) topBar.style.display = "none";
    }
});

// Logout Event Listener
if (logoutBtn) {
    logoutBtn.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("userCart");
        localStorage.removeItem("userName");
        signOut(auth).then(() => window.location.href = "login.html");
    });
}

// ===> PRODUCTS DISPLAY WITH ADD TO CART WORK <===
const container = document.getElementById("products-container");

if (container) {
    onValue(ref(db, "products"), (snapshot) => {
        container.innerHTML = "";
        const data = snapshot.val();
        if (data) {
            const keys = Object.keys(data).slice(0, 6);
            keys.forEach((id) => {
                const product = data[id];
                container.innerHTML += `
                    <div class="product-card">
                      <div class="img-wrapper">
                         <img src="${product.img}" width="100%">
                      </div>
                      <h3>${product.name}</h3>
                     ${product.desc.length > 40 ? product.desc.substring(0, 40) + "..." : product.desc}
                      <h4>Rs. ${product.price}</h4>
                      <button class="cart-btn" 
                            data-id="${id}" 
                            data-name="${product.name}" 
                            data-price="${product.price}" 
                            data-img="${product.img}">
                         Add To Cart <i class="fa-solid fa-cart-shopping"></i>
                      </button>
                    </div>
                `;
            });
            enableHomeCartButtons();
        } else {
            container.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color:#666;">No products available.</p>`;
        }
    });
}

function enableHomeCartButtons() {
    const homeCartButtons = document.querySelectorAll(".cart-btn");
    homeCartButtons.forEach((btn) => {
        btn.addEventListener("click", () => {

            if (!auth.currentUser) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Login Required',
                    background: '#11141a',
                    color: '#fff',
                    text: 'Please login first to add products to cart.',
                    confirmButtonColor: '#6a8d55'
                }).then(() => {
                    window.location.href = "login.html";
                });
                return;
            }

            const id = btn.getAttribute("data-id");
            const name = btn.getAttribute("data-name");
            const price = btn.getAttribute("data-price");
            const img = btn.getAttribute("data-img");

            let cart = JSON.parse(localStorage.getItem("userCart")) || [];
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ id, name, price, img, quantity: 1 });
            }

            localStorage.setItem("userCart", JSON.stringify(cart));
            window.updateNavbarCartCount();

            Swal.fire({
                icon: 'success',
                title: 'Added to Cart!',
                text: `${name} has been added.`,
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

function updateNavbarCartCount() {
    let cart = JSON.parse(localStorage.getItem("userCart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Desktop Cart
    const cartCountBadge = document.getElementById("cart-count");
    if (cartCountBadge) {
        cartCountBadge.innerText = totalItems;
    }

    // Mobile Cart
    const mobileCartBadge = document.getElementById("mobile-cart-count");
    if (mobileCartBadge) {
        mobileCartBadge.innerText = totalItems;
    }
}

updateNavbarCartCount();
window.updateNavbarCartCount = updateNavbarCartCount;



// toggle  code navbar wala
const menuToggle = document.getElementById("menuToggle");
const mobileSidebar = document.getElementById("mobileSidebar");
const closeMenu = document.getElementById("closeMenu");

menuToggle.addEventListener("click", () => {
    mobileSidebar.classList.add("active");
});

closeMenu.addEventListener("click", () => {
    mobileSidebar.classList.remove("active");
});
// toggle code yh bhe 
if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", e => {
        e.preventDefault();
        localStorage.removeItem("userCart");
        localStorage.removeItem("userName");
        signOut(auth).then(() => window.location.href = "login.html");
    });
}
