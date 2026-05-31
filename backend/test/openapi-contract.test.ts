import { describe, it, expect } from "vitest";

describe("OpenAPI contract", () => {
  it("should validate that API returns correct status codes", async () => {
    const res = await fetch("http://localhost:3001/api/health");
    expect(res.status).toBe(200);
  });

  it("should return bounties as array", async () => {
    const res = await fetch("http://localhost:3001/api/bounties");
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
