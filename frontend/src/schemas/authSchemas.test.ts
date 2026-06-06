import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./authSchemas";

describe("auth schemas", () => {
  it("validates login data", () => {
    const result = loginSchema.safeParse({
      email: "admin@jkcards.com",
      password: "admin123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects register data with different passwords", () => {
    const result = registerSchema.safeParse({
      name: "Cliente JKCards",
      email: "cliente@jkcards.com",
      password: "senha123",
      confirmPassword: "outra123",
    });

    expect(result.success).toBe(false);
  });
});

