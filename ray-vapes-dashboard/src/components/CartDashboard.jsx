import React, { useEffect, useState } from "react";
import axios from "axios";

function CartDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/orders")
      .then((response) => {
        if (response.data.success) {
          setOrders(response.data.data.content);
        } else {
          setError("Дані не успішні");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Помилка завантаження:", err);
        setError(err.message || "Помилка при завантаженні");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Завантаження даних...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto", padding: 20 }}>
      <h1>Список замовлень</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Імʼя</th>
            <th style={thStyle}>Прізвище</th>
            <th style={thStyle}>Адреса</th>
            <th style={thStyle}>Телефон</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Telegram</th>
            <th style={thStyle}>Метод замовлення</th>
            <th style={thStyle}>Місце самовивозу</th>
            <th style={thStyle}>Товари (xЦіна)</th>
            <th style={thStyle}>Загальна сума (€)</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const {
              id,
              firstName,
              lastName,
              address,
              phoneNumber,
              email,
              telegramNickname,
              orderMethod,
              pickupLocation,
              items,
              priceCents,
            } = order;

            const itemSummary = items
              .map(
                (item) =>
                  `${item.quantity} × ${(item.priceCents / 100).toFixed(2)}`
              )
              .join(", ");

            return (
              <tr key={id}>
                <td style={tdStyle}>{firstName}</td>
                <td style={tdStyle}>{lastName}</td>
                <td style={tdStyle}>{address}</td>
                <td style={tdStyle}>{phoneNumber}</td>
                <td style={tdStyle}>{email}</td>
                <td style={tdStyle}>{telegramNickname}</td>
                <td style={tdStyle}>{orderMethod}</td>
                <td style={tdStyle}>
                  {orderMethod === "PICKUP" ? pickupLocation : "-"}
                </td>
                <td style={tdStyle}>{itemSummary}</td>
                <td style={tdStyle}>{(priceCents / 100).toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: 10,
  backgroundColor: "#f0f0f0",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: 8,
  verticalAlign: "top",
};

export default CartDashboard;
