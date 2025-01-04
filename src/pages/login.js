import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Layout,
  Flex,
  Image,
  Select,
  Spin,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { adminlogin, login } from "../store/user/userSlice";
import { useDispatch } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { toast } from "react-toastify";
const { Content } = Layout;
const { Option } = Select;
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    role: "",
  });

  const onFinish = async () => {
    try {
      setLoading(true);
      // debugger;
      let response;
      // if (formValues?.role === "superadmin") {
      //   const resultAction = await dispatch(adminlogin(formValues));
      //   response = resultAction.payload;
      // } else {
        const resultAction = await dispatch(login(formValues));
        response = resultAction.payload;
      // }
      console.log(response, "response");
      if (response) {
        console.log(response,'===========================')
        let token = response.token;
        let useremail = response.email;
        let userId = response.id;
        let role = response?.role;
        localStorage.setItem("token", token);
        localStorage.setItem("useremail", useremail);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        toast.success(response.message || "Login successful!");
        setTimeout(() => {
          // window.location.pathname = "/";
          if (role === "SuperAdmin" || role === "Agent") {
            navigate("/");
          } else if (role === "Doctor") {
            navigate("/doctor-dashboard");
          } else {
            navigate("/manufacturer-dashboard");
          }
        }, 1000);
      } else {
        if (response && response.message) {
          toast.error(response.message || "Login failed: Invalid Credientials");
        } else {
          toast.error("Login failed: Invalid Credientials");
        }
      }
    } catch (error) {
      console.error("Login API call failed:", error.message);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Content>
        <Row className="w-full flex lg:flex-row lg:items-stretch flex-col lg:gap-0 gap-5 lg:min-h-screen lg:max-h-screen overflow-hidden">
          <Col className="lg:w-[41.8%] relative flex flex-col justify-between">
            <PerfectScrollbar className="lg:max-h-screen lg:px-9 px-5 py-5">
              <div className="flex items-center justify-center lg:justify-start max-w-[200px] mx-auto lg:mx-0 lg:mb-9 max-lg:mb-4">
                {/* {Svgs.loginlogo} */}
              </div>
              <div className="flex flex-col justify-center items-center login-height">
                <h1 className="md:text-[26px] text-xl font-normal leading-normal text-dark text-center mt-3 mb-1">
                  Sign In to your Account
                </h1>
                <p className="text-sm text-primary font-normal leading-normal text-center">
                  Welcome back! please enter your detail
                </p>
                <Form
                  name="login"
                  size="large"
                  layout="vertical"
                  style={{
                    width: "100%",
                    maxWidth: "400px",
                    margin: "30px auto 0 auto",
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                  className="flex flex-col gap-3"
                  onFinish={onFinish}
                  validateMessages={{
                    required: "${label} is required",
                    types: {
                      email: "${label} is not a valid email",
                    },
                  }}
                  initialValues={{
                    email: formValues.email,
                    password: formValues.password,
                    role: formValues.role,
                  }}
                >
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Email is required" },
                      {
                        type: "email",
                        message: "Email is not a valid email",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      size="large"
                      required
                      placeholder="Email"
                      className="super__select text-sm font-normal text-dark"
                      prefix={<></>}
                      value={formValues.email}
                      onChange={(e) =>
                        setFormValues({ ...formValues, email: e.target.value })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    className="custom-password-field"
                    name="password"
                    rules={[{ required: true }, { min: 6 }, { max: 25 }]}
                    hasFeedback
                  >
                    <Input.Password
                      className="super__select text-sm font-normal text-dark"
                      required
                      size="large"
                      placeholder="Password"
                      value={formValues.password}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          password: e.target.value,
                        })
                      }
                      prefix={<></>}
                    />
                  </Form.Item>
                  {/* Role Select Dropdown */}
                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Role is required" }]}
                  >
                    <Select
                      size="large"
                      placeholder="Select Role"
                      value={formValues.role}
                      onChange={(value) =>
                        setFormValues({ ...formValues, role: value })
                      }
                    >
                      <Option value="superadmin">Super Admin</Option>
                      <Option value="agent">Agent</Option>
                      <Option value="manufacturer">Manufacturer</Option>
                      <Option value="doctor">Doctor</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item>
                    <Flex vertical style={{ width: "100%", marginTop: 20 }}>
                      <Spin spinning={loading}>
                        <Button
                          className="bg-primary border border-primary text-white hover:bg-white hover:text-primary rounded-xl !h-14 transition-all ease-out"
                          type="submit"
                          htmlType="submit"
                          block
                        >
                          Sign In
                        </Button>
                      </Spin>
                    </Flex>
                  </Form.Item>
                </Form>
                {/* <ul className="flex items-center justify-center lg:mt-8 max-lg:mt-5 space-x-9">
                  <li>
                    <Link className="text-sm text-dark font-normal leading-normal">
                      Terms and conditions
                    </Link>
                  </li>
                  <li className="list-disc">
                    <Link className="text-sm text-dark font-normal leading-normal">
                      Privacy policy
                    </Link>
                  </li>
                </ul> */}
              </div>
            </PerfectScrollbar>
          </Col>
          <Col className="bg-login-gradient lg:flex-1 lg:px-9 px-5 py-10 hidden lg:block">
            <div className="flex items-center justify-center w-full h-full">
              <Image
                preview={false}
                className="lg:max-w-sm"
                src="../assets/images/login-page-pic.svg"
              />
            </div>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default Login;
