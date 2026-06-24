import { auth, db } from './app.js'; 
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

// !!! APNI REAL ADMIN UID !!!
const ADMIN_UID = "m6QZjaIbqMQ9Qo732x7bKLeOCgx2"; 

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User login hai:", user.uid);
    if (user.uid !== ADMIN_UID) {
      Swal.fire({
        icon: 'error',
        title: 'Access Denied!',
        text: 'Oops! This page is only for Admin.',
        confirmButtonColor: '#6a8d55',
        background: '#11141a',
        color: '#fff'
      }).then(() => {
        window.location.href = "index.html";
      });
    }
  } else {
    window.location.href = "login.html";
  }
});

// add product Work
const addBtn = document.getElementById("addProduct");

if (addBtn) {
  addBtn.addEventListener("click", () => {
    const user = auth.currentUser;
    if (!user || user.uid !== ADMIN_UID) return;

    const name = document.getElementById("pname").value.trim();
    const desc = document.getElementById("pdesc").value.trim();
    const price = document.getElementById("pprice").value.trim();
    const img = document.getElementById("pimg").value.trim();

    if (!name || !desc || !price || !img) {
      Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'All fields are required!',
        confirmButtonColor: '#6a8d55',
        background: '#11141a',
        color: '#fff'
      });
      return;
    }

    push(ref(db, "products"), { name, desc, price, img, userId: user.uid })
    .then(() => {
      document.getElementById("pname").value = "";
      document.getElementById("pdesc").value = "";
      document.getElementById("pprice").value = "";
      document.getElementById("pimg").value = "";
      Swal.fire({
        icon: 'success',
        title: 'Product Added!',
        text: 'Your product has been added successfully.',
        showConfirmButton: false,
        timer: 2000,
        background: '#11141a',
        color: '#fff',
        iconColor: '#6a8d55'
      });
    });
  });
}

// ==========================================
// READ & EDIT/DELETE PRODUCTS TABLE
// ==========================================
const tableBody = document.getElementById("crud-table-body");

if (tableBody) {
    onValue(ref(db, "products"), (snapshot) => {
        tableBody.innerHTML = "";
        if (snapshot.exists()) {
            const data = snapshot.val();
            Object.keys(data).forEach((key) => {
                const product = data[key];
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><img src="${product.img}" width="50" height="50" style="object-fit:cover;"></td>
                    <td><strong>${product.name}</strong></td>
                    <td>Rs. ${product.price}</td>
                    <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${product.desc}</td>
                    <td>
                        <div class="action-btns">
                            <button class="btn-edit" data-id="${key}" data-name="${product.name}" data-price="${product.price}" data-desc="${product.desc}" data-img="${product.img}"><i class="fa-solid fa-edit"></i> Edit</button>
                            <button class="btn-delete" data-id="${key}"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            activateSystem();
        } else {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#a0aec0; padding: 20px;">No products found.</td></tr>`;
        }
    });
}

// ==========================================
// DELETE & EDIT SYSTEM
// ==========================================
function activateSystem() {
    // Delete Logic
    document.querySelectorAll(".btn-delete").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            Swal.fire({
                title: 'Are you sure?',
                text: "Yeh product delete ho jayega!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#ff3838',
                background: '#11141a',
                color: '#fff'
            }).then((result) => {
                if (result.isConfirmed) {
                    remove(ref(db, `products/${id}`));
                }
            });
        });
    });

    // Edit Logic
    document.querySelectorAll(".btn-edit").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            Swal.fire({
                title: 'Edit Product',
                html: `<input id="edit-name" class="swal2-input" value="${btn.getAttribute('data-name')}">
                       <input id="edit-price" class="swal2-input" value="${btn.getAttribute('data-price')}">
                       <textarea id="edit-desc" class="swal2-input">${btn.getAttribute('data-desc')}</textarea>
                       <input id="edit-img" class="swal2-input" value="${btn.getAttribute('data-img')}">`,
                background: '#11141a',
                color: '#fff',
                confirmButtonText: 'Update Product',
                preConfirm: () => {
                    return {
                        name: document.getElementById('edit-name').value,
                        price: document.getElementById('edit-price').value,
                        desc: document.getElementById('edit-desc').value,
                        img: document.getElementById('edit-img').value
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    update(ref(db, `products/${id}`), result.value);
                    Swal.fire('Updated!', 'Product details updated successfully.', 'success');
                }
            });
        });
    });
}