document.addEventListener("DOMContentLoaded", () => {
  const existingUser = JSON.parse(localStorage.getItem("taskflowUser"));
  if (existingUser) {
    window.location.href = "app.html";
  }

  const form = document.querySelector("form");
  const nameInput = document.querySelector('input[type="text"]');
  const dobInput = document.querySelector('input[type="date"]');

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const dob = new Date(dobInput.value);
    const today = new Date();

    if (!name || isNaN(dob)) {
      alert("Please enter your name and a valid date of birth.");
      return;
    }

    let age = today.getFullYear() - dob.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    if(!hasBirthdayPassed){
        age = age - 1;
    }

    if (age < 10) {
      alert("You must be older than 10 years to use TaskFlow.");
      return;
    }

    localStorage.setItem("taskflowUser", JSON.stringify({name}));
    window.location.href = "app.html";

  });
});
