import React from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import "./Login.css";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const handleLogin = () =>
    // values: { email: string; password: string }
    {
      navigate("/agents");
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
          initialValues={{ email: "", password: "" }}
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
                type="password"
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange("password")}
                onBlur={handleBlur("password")}
                className="login-input"
              />
              {touched.password && errors.password && (
                <div className="error-message">{errors.password}</div>
              )}

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
