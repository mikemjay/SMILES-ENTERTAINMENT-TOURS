function payMpesa(ref, phone) {
  alert(`STK Push sent to ${phone}`);
  fetch("http://localhost:3000/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ref, phone })
  })
  .then(() => window.location.href = "confirmation.html");
}
