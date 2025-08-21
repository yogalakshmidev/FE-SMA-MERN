import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-password/${token}`,
        { password }
      );
      setMessage(res.data.message);
      console.log("reset password successfully", res.data);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="register">
      <div className="container register__container">

    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button  className="btn primary" type="submit">Reset Password</button>
      </form>
      <p>{message}</p>
    </div>
    </div>
    </section>
  );
}
