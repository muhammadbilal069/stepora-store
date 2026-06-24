const chain = document.getElementById('pull-chain');
const signupArea = document.getElementById('signupArea');
const string = document.getElementById('string');

chain.addEventListener('click', () => {
  signupArea.classList.toggle('light-on');

  string.style.height = "190px";
  setTimeout(() => {
    string.style.height = "150px";
  }, 200);
});


// ===> FIREBASE WORK START HAY YAHA SAI SIGNUP WALA

import { auth } from './app.js';  // app.js se import kiya
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

var signupBtn = document.getElementById("signupBtn");
signupBtn.addEventListener("click", signup);

function signup() {
  var semail = document.getElementById("semail").value;
  var spasword = document.getElementById("spasword").value;

  createUserWithEmailAndPassword(auth, semail, spasword)
    .then((userCredential) => {
      const user = userCredential.user;

      // Chota aur Dark Theme wala Popup
      Swal.fire({
        title: 'Success!',
        text: 'Signup Successfully',
        icon: 'success',
        background: '#11141a',
        color: '#fff',
        iconColor: '#6a8d55',
        width: '500px',
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          popup: 'my-custom-popup'
        }
      }).then(() => {
        window.location.href = "index.html";
      });

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


