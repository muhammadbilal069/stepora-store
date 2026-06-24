const chain = document.getElementById('pull-chain');
const loginArea = document.getElementById('loginArea');
const string = document.getElementById('string');

chain.addEventListener('click', () => {

  loginArea.classList.toggle('light-on');

  string.style.height = "210px";

  setTimeout(() => {
    string.style.height = "180px";
  }, 200);
});


// ===> FIREBASE WORK START HAY YAHA SAI LOGIN

import { auth } from './app.js';  // app.js se import kiya
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";


var loginBtn = document.getElementById("loginBtn");
loginBtn.addEventListener("click", login);

function login() {
  var lemail = document.getElementById("lemail").value;
  var lpassword = document.getElementById("lpassword").value;

  signInWithEmailAndPassword(auth, lemail, lpassword)
    .then((userCredential) => {
    const user = userCredential.user;

    localStorage.setItem("userName", user.email.split('@')[0]);

    // !!! APNI REAL ADMIN UID !!!
    const ADMIN_UID = "m6QZjaIbqMQ9Qo732x7bKLeOCgx2"; 

    // CHAKKAH ROUTING SYSTEM: Check karo login karne wala kaun hai
    if (user.uid === ADMIN_UID) {
        // 1. AGAR ADMIN HAI TOH DASHBOARD BHEJO
        Swal.fire({
            title: 'Welcome Admin!',
            text: 'Redirecting to Admin Dashboard...',
            icon: 'success',
            background: '#11141a',
            color: '#fff',
            iconColor: '#6a8d55',
            width: '500px',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: 'my-custom-popup' }
        }).then(() => {
            window.location.href = "dashboard.html"; // Admin dashboard par chala gaya
        });

    } else {
        // 2. AGAR NORMAL USER HAI TOH HOME PAGE BHEJO
        Swal.fire({
            title: 'Success!',
            text: 'Login Successfully. Redirecting...',
            icon: 'success',
            background: '#11141a',
            color: '#fff',
            iconColor: '#6a8d55', // Aapka pyara green color
            width: '500px',
            showConfirmButton: false,
            timer: 2000,
            customClass: { popup: 'my-custom-popup' }
        }).then(() => {
            window.location.href = "index.html"; // User home page par chala gaya
        });
    }
})


    // ERROR WORK HAI YHA

    .catch((error) => {
      let message = "";

      if (error.code === "auth/user-not-found") {
        message = "Email not found";
      }
      else if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      }
      else if (error.code === "auth/invalid-credential") {
        message = "Incorrect email or password";
      }
      else if (error.code === "auth/invalid-email") {
        message = "Invalid email format";
      }
      else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Try again later";
      }
      else {
        message = error.code; // debug ke liye
      }

      // Error box bhi chota aur dark
      Swal.fire({
        title: 'Error!',
        text: message,
        icon: 'error',
        background: '#11141a',
        color: '#fff',
        confirmButtonColor: '#6a8d55',
        width: '500px',

      });

    });

}

