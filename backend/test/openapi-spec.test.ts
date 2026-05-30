import { describe, it, expect } from "vitest";
describe("OpenAPI Spec", () => {
  it("should have swagger document", () => {
    const doc = require("../src/swagger").swaggerDocument;
    expect(doc).toBeDefined();
    expect(doc.openapi).toBe("3.0.0");
  });
});
