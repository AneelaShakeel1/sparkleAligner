import React, { useState } from "react";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import * as Yup from "yup";
import axios from "axios";
import { message, Select } from "antd";
import "./AddUser.css";

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string().required("Role is required"),
});

const SignUp: React.FC = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (
    values: {
      name: string;
      email: string;
      password: string;
      role: string | null;
    },
    actions: { resetForm: () => void }
  ) => {
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    };
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      payload
    );

    if (response && response.data) {
      message.success(response.data.message);

      let users = JSON.parse(localStorage.getItem("users") || "[]");
      let agents = JSON.parse(localStorage.getItem("agents") || "[]");
      let clients = JSON.parse(localStorage.getItem("clients") || "[]");
      let doctors = JSON.parse(localStorage.getItem("doctors") || "[]");

      const {
        name,
        email,
        // password,
        role,
        treatment_details,
        status,
        profile,
      } = response.data.user;

      const newUser = {
        name: name,
        email: email,
        role: role,
        // password: password,
        treatment_deatils: treatment_details,
        status: status,
        profile: profile,
      };

      switch (role) {
        case "agent":
          agents = [...agents, newUser];
          localStorage.setItem("agents", JSON.stringify(agents));
          break;
        case "client":
          clients = [...clients, newUser];
          localStorage.setItem("clients", JSON.stringify(clients));
          break;
        case "doctor":
          doctors = [...doctors, newUser];
          localStorage.setItem("doctors", JSON.stringify(doctors));
          break;
        default:
          break;
      }

      users = [...users, newUser];
      localStorage.setItem("users", JSON.stringify(users));

      setTimeout(() => {
        switch (role) {
          case "agent":
            navigate("/agents");
            break;
          case "client":
            navigate("/clients");
            break;
          case "doctor":
            navigate("/doctors");
            break;
          default:
            break;
        }
      }, 1000);
    }
    actions.resetForm();

    console.log(
      response.data.user,
      "===============register response================="
    );
  };

  return (
    <div className="signup-container">
      <div className="signup-background">
        <div className="signup-overlay">
          <h1 className="signup-title">SIGNUP FORM</h1>
        </div>
      </div>
      <div className="signup-form-wrapper">
        <Formik
          initialValues={{ name: "", email: "", password: "", role: null }}
          onSubmit={handleSignUp}
          validationSchema={SignUpSchema}
        >
          {({
            handleBlur,
            handleChange,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <div className="signup-form-card">
              <input
                type="name"
                name="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                className="signup-input"
              />
              {touched.name && errors.name && (
                <div className="error-message">{errors.name}</div>
              )}
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                className="signup-input"
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
                className="signup-input"
              />
              <span
                style={{
                  position: "absolute",
                  top:
                    errors.password && errors.email
                      ? "50%"
                      : errors.password
                      ? "48%"
                      : errors.email
                      ? "52%"
                      : "50%",
                  right: "9%",
                  color:'#ddd'
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
                  <Select.Option value="client">client</Select.Option>
                  <Select.Option value="agent">agent</Select.Option>
                  <Select.Option value="doctor">doctor</Select.Option>
                </Select>
                {touched.role && errors.role && (
                  <div className="error-message">{errors.role}</div>
                )}
              </div>
              <button
                type="button"
                onClick={handleSubmit as any}
                className="signup-button"
              >
                SignUp
              </button>
            </div>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
