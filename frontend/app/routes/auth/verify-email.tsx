import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

const VerifyEmail = () => {
  const { token } = useParams();

  const [message, setMessage] = useState("Verifying your email...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("Verification token is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api-v1/auth/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Email verification failed.");
          setLoading(false);
          return;
        }

        setMessage(data.message || "Email verified successfully!");
      } catch (error) {
        console.error("Verification error:", error);
        setMessage("Something went wrong while verifying your email.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>

      {loading ? (
        <p>Verifying your email...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default VerifyEmail;
