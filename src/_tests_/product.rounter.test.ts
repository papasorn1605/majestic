import request from "supertest";
import express from "express";
import productRouter from "../routes/product.route";

// Mock productController methods
jest.mock("../controller/product.controller", () => ({
  getAll: jest.fn((req, res) =>
    res.status(200).send({
      message: "OK",
      result: [{ id: 347, name: "Papasorn" }], // แก้ไขข้อมูลใน mock ให้เป็น Papasorn และรหัส 347
    })
  ),
  deleteById: jest.fn((req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: "Invalid ID format" });
    }
    res.status(204).send(); // No Content
  }),
  insertProduct: jest.fn((req, res) => {
    const { id, name, price } = req.body;
    if (
      typeof id !== "number" ||
      typeof name !== "string" ||
      typeof price !== "number"
    ) {
      return res.status(400).send({ message: "Invalid input data" });
    }
    res.status(201).send({ message: `Product ${name} with ID ${id} created successfully` });
  }),
  updateProduct: jest.fn((req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, price } = req.body;
    if (isNaN(id) || typeof name !== "string" || typeof price !== "number") {
      return res.status(400).send({ message: "Invalid input data" });
    }
    res.status(200).send({ message: `Product with ID ${id} updated successfully` });
  }),
}));

const app = express();
app.use(express.json());
app.use("/products", productRouter);

describe("Product Router", () => {
  it("should get all products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "OK",
      result: [{ id: 347, name: "Papasorn" }], // ตรวจสอบข้อมูลการตอบกลับให้ตรงกับ mock
    });
  });

  it("should delete a product by ID", async () => {
    const response = await request(app).delete("/products/347"); // ใช้ ID 347 ในการลบ
    expect(response.status).toBe(204); // Updated to 204 No Content
  });

  it("should handle invalid ID format in delete request", async () => {
    const response = await request(app).delete("/products/invalid-id");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid ID format" });
  });

  it("should insert a new product with name 'Papasorn' and ID 347", async () => {
    const newProduct = { id: 347, name: "Papasorn", price: 100 }; // เพิ่มข้อมูลชื่อ Papasorn และ ID 347
    const response = await request(app).post("/products").send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Product Papasorn with ID 347 created successfully",
    });
  });

  it("should handle invalid input data in insert request", async () => {
    const invalidProduct = {
      id: "string",
      name: "Invalid Product",
      price: "not-a-number",
    };
    const response = await request(app).post("/products").send(invalidProduct);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid input data" });
  });

  it("should update an existing product by ID 347", async () => {
    const updatedProduct = { name: "Papasorn Updated", price: 150 }; // ใช้ข้อมูลชื่อ Papasorn Updated และ ID 347
    const response = await request(app).put("/products/347").send(updatedProduct);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Product with ID 347 updated successfully",
    });
  });

  it("should handle invalid input data in update request", async () => {
    const invalidUpdate = { name: "Updated Product", price: "not-a-number" };
    const response = await request(app).put("/products/347").send(invalidUpdate); // ใช้ ID 347 ในการทดสอบกรณี input ผิด
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid input data" });
  });
});
