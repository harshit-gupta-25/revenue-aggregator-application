import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders the app component", () => {
    render(<App />);

    expect(screen.getByText("Revenue Aggregator Application")).toBeInTheDocument();
    expect(screen.getByLabelText("Search:")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });
});
