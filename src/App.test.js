import React from "react";
import { render } from "@testing-library/react";
import App from "./App";
import "./setupTest";
test("renders without crashing", () => {
  render(<App />);
});
test("renders the correct route components", () => {
  const { container } = render(<App />);

  expect(container.querySelector("h1")).toHaveTextContent(
    "Sign In to your Account"
  );
  expect(container.querySelector("button")).toHaveTextContent("Sign In");
});
