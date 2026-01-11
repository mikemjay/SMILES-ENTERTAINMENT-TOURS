document.getElementById("bookingForm").addEventListener("submit", e => {
  e.preventDefault();

  const date = date.value;
  const days = days.value;
  const phone = phone.value;

  const ref = "SET-" + Math.floor(Math.random() * 100000);

  fetch("http://localhost:3000/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref, date, days, phone })
  })
  .then(() => payMpesa(ref, phone));

  localStorage.setItem("bookingRef", ref);
});

