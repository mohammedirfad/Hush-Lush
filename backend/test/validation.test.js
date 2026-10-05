import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { validateLoginPayload } from "../src/utils/validation.js";

describe("login validation", () => {
  it("requires email and password", () => {
    const result = validateLoginPayload({});

    assert.equal(result.isValid, false);
    assert.equal(result.errors.email, "Email is required");
    assert.equal(result.errors.password, "Password is required");
  });

  it("accepts a valid payload", () => {
    const result = validateLoginPayload({
      email: "USER@Example.com",
      password: "Password@123"
    });

    assert.equal(result.isValid, true);
    assert.equal(result.email, "user@example.com");
  });
});
