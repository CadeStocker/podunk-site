"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMessage("All fields are required");
      return;
    }

    try {
      // Send email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: "podunkramblers@gmail.com"
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again.");
      console.error("EmailJS Error:", error);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main style={{ 
      padding: "40px 24px",
      maxWidth: "600px",
      margin: "0 auto"
    }}>
      <h1 style={{ 
        fontSize: "2.5rem", 
        fontWeight: 900, 
        marginBottom: "16px",
        textAlign: "center"
      }}>
        Get in Touch
      </h1>

      <p style={{ 
        fontSize: "1.1rem", 
        textAlign: "center",
        marginBottom: "32px",
        lineHeight: 1.6
      }}>
        Want to book us for a show or just say howdy? Drop us a line!
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "32px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label 
            htmlFor="name" 
            style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "bold"
            }}
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "2px solid #F9A72A",
              background: "#fff",
              color: "#13477B",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label 
            htmlFor="email" 
            style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "bold"
            }}
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "2px solid #F9A72A",
              background: "#fff",
              color: "#13477B",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label 
            htmlFor="message" 
            style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "bold"
            }}
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            rows={6}
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "2px solid #F9A72A",
              background: "#fff",
              color: "#13477B",
              boxSizing: "border-box",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />
        </div>

        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "1.1rem",
            fontWeight: "bold",
            borderRadius: "6px",
            border: "none",
            background: status === "sending" ? "#999" : "#F9A72A",
            color: "#13477B",
            cursor: status === "sending" ? "not-allowed" : "pointer",
            transition: "transform 0.2s, background 0.2s",
          }}
          onMouseEnter={(e) => {
            if (status !== "sending") {
              e.currentTarget.style.transform = "scale(1.02)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {status === "sending" ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status === "success" && (
        <div style={{
          padding: "16px",
          background: "rgba(249, 167, 42, 0.2)",
          border: "2px solid #F9A72A",
          borderRadius: "6px",
          textAlign: "center"
        }}>
          <p style={{ margin: 0, fontSize: "1.1rem" }}>
            ✅ Thanks for reaching out! We'll get back to you soon.
          </p>
        </div>
      )}

      {status === "error" && (
        <div style={{
          padding: "16px",
          background: "rgba(255, 0, 0, 0.1)",
          border: "2px solid #ff4444",
          borderRadius: "6px",
          textAlign: "center"
        }}>
          <p style={{ margin: 0, fontSize: "1rem", color: "#ff6666" }}>
            ❌ {errorMessage}
          </p>
        </div>
      )}

      <div style={{
        marginTop: "40px",
        textAlign: "center",
        fontSize: "0.9rem",
        color: "#F9A72A"
      }}>
        <p>Or email us directly at:</p>
        <a 
          href="mailto:podunkramblers@gmail.com"
          style={{
            color: "#F9A72A",
            fontWeight: "bold",
            fontSize: "1.1rem"
          }}
        >
          podunkramblers@gmail.com
        </a>
      </div>
    </main>
  );
}
