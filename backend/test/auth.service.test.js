import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { guestLogin, login, verifyToken } from "../src/services/auth.service.js";

describe("auth service", () => {
  it("logs in a valid mock user", () => {
    const result = login({ email: "irfad@example.com", password: "Password@123" });

    assert.equal(result.status, 200);
    assert.equal(result.body.user.name, "Irfad");
    assert.ok(result.body.token);
    assert.ok(result.body.expiresAt);
  });

  it("rejects invalid credentials", () => {
    const result = login({ email: "irfad@example.com", password: "wrongpass" });

    assert.equal(result.status, 401);
  });

  it("creates guest sessions", () => {
    const result = guestLogin();

    assert.equal(result.user.role, "guest");
    assert.ok(result.token);
  });

  it("verifies signed JWT sessions", () => {
    const result = login({ email: "irfad@example.com", password: "Password@123" });
    const user = verifyToken(result.body.token);

    assert.equal(user.email, "irfad@example.com");
  });
});
