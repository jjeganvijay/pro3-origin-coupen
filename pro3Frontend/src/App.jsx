import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css'
const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    const response = await axios.get("http://localhost:5000/coupons");
    setCoupons(response.data);
  };

  const addCoupon = async () => {
    await axios.post("http://localhost:5000/add-coupon", {
      code,
      discount,
      expiryDate,
    });
    fetchCoupons();
    setCode("");
    setDiscount("");
    setExpiryDate("");
  };

  const deleteCoupon = async (id) => {
    await axios.delete(`http://localhost:5000/delete-coupon/${id}`);
    fetchCoupons();
  };

  return (
    <div>
      <h2>Coupon Manager</h2>
      <input
        type="text"
        placeholder="Coupon Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <input
        type="number"
        placeholder="Discount %"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
      />
      <input
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
      />
      <button onClick={addCoupon}>Add Coupon</button>

      <h3>Coupons:</h3>
      <ul>
        {coupons.map((coupon) => (
          <li key={coupon._id}>
            {coupon.code} - {coupon.discount}% off (Expires: {coupon.expiryDate})
            <button onClick={() => deleteCoupon(coupon._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CouponManager;