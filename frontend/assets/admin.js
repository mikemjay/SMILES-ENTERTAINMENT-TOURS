fetch("http://localhost:3000/bookings")
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("bookings");
    data.forEach(b => {
      table.innerHTML += `
        <tr>
          <td>${b.ref}</td>
          <td>${b.date}</td>
          <td>${b.days}</td>
          <td>${b.phone}</td>
          <td>${b.status}</td>
        </tr>
      `;
    });
  });
