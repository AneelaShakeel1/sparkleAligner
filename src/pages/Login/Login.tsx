import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "./Login.css";
import axios from "axios";
import { message, Select } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

const Login: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: {
    email: string;
    password: string;
    role: string | null;
  }) => {
    const payload = {
      email: values.email,
      password: values.password,
    };
    const response = await axios.post(
      "http://localhost:5000/api/auth/admin",
      payload
    );

    if (response) {
      localStorage.setItem("token", response.data.token);
      message.success(response.data.message);
      setTimeout(() => {
        const role = values.role;
        if (role) {
          role === "superadmin"
            ? navigate("/agents")
            : role === "agent"
            ? navigate("/agent-portal")
            : navigate("/doctor-portal");
        }
      }, 1000);
    }
    console.log(response.data.token, "response=================");
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay">
          <h1 className="login-title">SPARKLE ALIGN</h1>
          <p className="login-subtitle">Fill The Below Information to Login</p>
        </div>
      </div>
      <div className="login-form-wrapper">
        <Formik
          initialValues={{ email: "", password: "", role: null }}
          onSubmit={handleLogin}
          validationSchema={LoginSchema}
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <div className="login-form-card">
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                className="login-input"
              />
              {touched.email && errors.email && (
                <div className="error-message">{errors.email}</div>
              )}
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                className="login-input"
              />
              <span
                style={{
                  position: "absolute",
                  top:
                    errors.password && errors.email
                      ? "28%"
                      : errors.password
                      ? "25%"
                      : errors.email
                      ? "29%"
                      : "26%",
                  right: "9%",
                  color: "#ddd",
                }}
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </span>
              {touched.password && errors.password && (
                <div className="error-message">{errors.password}</div>
              )}
              <div className="role-select">
                <Select
                  value={values.role}
                  onChange={handleChange("role")}
                  onBlur={handleBlur("role")}
                  placeholder="Select Role"
                  style={{ width: "100%" }}
                >
                  <Select.Option value="superadmin">superadmin</Select.Option>
                  <Select.Option value="agent">agent</Select.Option>
                  <Select.Option value="doctor">doctor</Select.Option>
                </Select>
                {touched.role && errors.role && (
                  <div className="error-message">{errors.role}</div>
                )}
              </div>

              <p className="forgot-password">Forgot password?</p>

              <button
                type="button"
                onClick={handleSubmit as any}
                className="login-button"
              >
                Log In
              </button>

              <p className="footer-text">
                By proceeding, you agree to our{" "}
                <a
                  href="http://www.crypthonlab.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="http://www.crypthonlab.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
