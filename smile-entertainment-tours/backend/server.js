const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const BOOKINGS = "./bookings.json";

/* CREATE BOOKING */
app.post("/book", (req, res) => {
  const bookings = JSON.parse(fs.readFileSync(BOOKINGS));
  bookings.push({
    ...req.body,
    status: "Pending Payment"
  });
  fs.writeFileSync(BOOKINGS, JSON.stringify(bookings, null, 2));
  res.send("Booking saved");
});

/* SIMULATE MPESA PAYMENT */
app.post("/pay", (req, res) => {
  const bookings = JSON.parse(fs.readFileSync(BOOKINGS));
  const booking = bookings.find(b => b.ref === req.body.ref);

  if (booking) booking.status = "Paid";
  fs.writeFileSync(BOOKINGS, JSON.stringify(bookings, null, 2));

  res.send("Payment successful");
});

/* ADMIN VIEW */
app.get("/bookings", (req, res) => {
  res.json(JSON.parse(fs.readFileSync(BOOKINGS)));
});

app.listen(3000, () => console.log("Server running on port 3000"));
c
