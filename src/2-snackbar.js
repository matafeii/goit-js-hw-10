import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// DOM elements
const form = document.querySelector(".form");

// Event listener for form submit
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get form data
  const delay = Number(event.target.elements.delay.value);
  const state = event.target.elements.state.value;

  // Create promise
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === "fulfilled") {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  // Handle promise result
  promise
    .then((delay) => {
      console.log(`✅ Fulfilled promise in ${delay}ms`);
      iziToast.success({
        title: "Success",
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: "topRight",
      });
    })
    .catch((delay) => {
      console.log(`❌ Rejected promise in ${delay}ms`);
      iziToast.error({
        title: "Error",
        message: `❌ Rejected promise in ${delay}ms`,
        position: "topRight",
      });
    });

  // Reset form
  event.target.reset();
});

