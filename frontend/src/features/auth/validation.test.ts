import { describe, expect, it } from "vitest";
import { validateLogin } from "./validation";

describe("validateLogin", () => {
  it("requires email and password", () => {
    expect(validateLogin({ email: "", password: "" })).toEqual({
      email: "Email is required",
      password: "Password is required"
    });
  });

  it("rejects invalid email and short password", () => {
    expect(validateLogin({ email: "bad", password: "short" })).toEqual({
      email: "Enter a valid email address",
      password: "Password must be at least 8 characters"
    });
  });

  it("accepts valid login input", () => {
    expect(validateLogin({ email: "irfad@example.com", password: "Password@123" })).toEqual({});
  });
});
