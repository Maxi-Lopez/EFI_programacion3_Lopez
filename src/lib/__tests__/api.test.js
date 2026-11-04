import { describe, it, expect, vi, beforeEach } from "vitest";

global.fetch = vi.fn();

vi.mock("@/lib/auth", () => ({
  getToken: vi.fn().mockResolvedValue("mock-token"),
}));

describe("API Library", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env.NEXT_PUBLIC_API_URL = "http://127.0.0.1:8000/api";
  });

  it("getProductos llama endpoint real /api/catalogo/producto-get/", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ id: 1, nombre: "Test" }], next: null }),
    });

    const { getProductos } = await import("@/lib/api");
    const result = await getProductos();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/catalogo/producto-get/?page=1&search=",
      expect.objectContaining({ headers: expect.any(Object), cache: "no-store" })
    );
    expect(result).toEqual([{ id: 1, nombre: "Test" }]);
  });

  it("maneja paginación múltiple", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [{ id: 1 }], next: "page=2" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [{ id: 2 }], next: null }),
      });

    const { getProductos } = await import("@/lib/api");
    const result = await getProductos();
    expect(result).toHaveLength(2);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("getCategorias llama endpoint real /api/catalogo/categoria-get/", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [{ id: 1, title: "Cat1" }], next: null }),
    });

    const { getCategorias } = await import("@/lib/api");
    const result = await getCategorias();
    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/catalogo/categoria-get/?page=1",
      expect.objectContaining({ headers: expect.any(Object), cache: "no-store" })
    );
    expect(result).toEqual([{ id: 1, title: "Cat1" }]);
  });
});