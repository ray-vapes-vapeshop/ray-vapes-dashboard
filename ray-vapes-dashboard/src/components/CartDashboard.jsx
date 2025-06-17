import React, { useEffect, useState } from "react";
import axios from "axios";

function CartDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    setError(null);

    axios
      .get("https://ray-vapes-api.onrender.com/api/orders")
      .then((response) => {
        if (response.data.success) {
          setOrders(response.data.data.content);
        } else {
          setError("Дані не успішні");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response) {
          console.error("Помилка сервера, статус:", err.response.status);
          console.error("Тіло відповіді:", err.response.data);
        } else if (err.request) {
          console.error(
            "ЗАПИТ відправлено, але відповіді не отримано:",
            err.request
          );
        } else {
          console.error("Невідома помилка:", err.message);
        }
        setError(
          err.response?.data?.message ||
            err.message ||
            "Помилка при завантаженні"
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Подождите, идет загрузка данных...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Список заказов</h1>
        <button onClick={fetchOrders} style={buttonStyle}>
          Обновить страницу
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Імя</th>
            <th style={thStyle}>Фамилия</th>
            <th style={thStyle}>Адрес</th>
            <th style={thStyle}>Телефон</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Telegram</th>
            <th style={thStyle}>Метод</th>
            <th style={thStyle}>Самовывоз</th>
            <th style={thStyle}>Товары</th>
            <th style={thStyle}>Сумма (€)</th>
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
              .map((item) => {
                const name = item.product?.name || "Неизвестный товар";
                const flavour = item.product?.variant?.flavour?.name;
                const fullName = flavour ? `${name} (${flavour})` : name;
                const price = (item.priceCents / 100).toFixed(2);
                return `${item.quantity} × ${fullName} (${price} €)`;
              })
              .join(", ");

            return (
              <tr key={id}>
                <td style={tdStyle}>{firstName}</td>
                <td style={tdStyle}>{lastName}</td>
                <td style={tdStyle}>{address}</td>
                <td style={tdStyle}>{phoneNumber}</td>
                <td style={tdStyle}>{email}</td>
                <td style={tdStyle}>{telegramNickname}</td>
                <td style={tdStyle}>
                  {orderMethod === "PICKUP"
                    ? "Самовывоз"
                    : orderMethod === "DELIVERY"
                    ? "Доставка"
                    : orderMethod}
                </td>
                <td style={tdStyle}>
                  {orderMethod === "PICKUP" ? pickupLocation || "-" : "-"}
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

const buttonStyle = {
  padding: "8px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
};

export default CartDashboard;
