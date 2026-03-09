import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// DOM elements
const datetimePicker = document.getElementById("datetime-picker");
const startBtn = document.querySelector("[data-start]");
const daysEl = document.querySelector("[data-days]");
const hoursEl = document.querySelector("[data-hours]");
const minutesEl = document.querySelector("[data-minutes]");
const secondsEl = document.querySelector("[data-seconds]");

// Global variables
let userSelectedDate = null;
let timerInterval = null;
let isTimerRunning = false;

// Flatpickr options
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const now = new Date();

    if (selectedDate <= now) {
      iziToast.error({
        title: "Error",
        message: "Please choose a date in the future",
        position: "topRight",
      });
      startBtn.disabled = true;
      userSelectedDate = null;
    } else {
      userSelectedDate = selectedDate;
      startBtn.disabled = false;
    }
  },
};

// Initialize flatpickr
flatpickr(datetimePicker, options);

// Disable start button initially
startBtn.disabled = true;

// Function to convert milliseconds to time components
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Function to add leading zero
function addLeadingZero(value) {
  return String(value).padStart(2, "0");
}

// Function to update timer display
function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

// Function to start timer
function startTimer() {
  if (!userSelectedDate || isTimerRunning) return;

  isTimerRunning = true;
  startBtn.disabled = true;
  datetimePicker.disabled = true;

  // Initial update
  const updateTimer = () => {
    const now = new Date();
    const msDiff = userSelectedDate - now;

    if (msDiff <= 0) {
      // Timer finished
      clearInterval(timerInterval);
      isTimerRunning = false;
      datetimePicker.disabled = false;
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const time = convertMs(msDiff);
    updateTimerDisplay(time);
  };

  // Update immediately
  updateTimer();

  // Update every second
  timerInterval = setInterval(updateTimer, 1000);
}

// Event listener for start button
startBtn.addEventListener("click", startTimer);

