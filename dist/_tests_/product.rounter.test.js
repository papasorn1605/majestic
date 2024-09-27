"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const product_route_1 = __importDefault(require("../routes/product.route"));
// Mock productController methods
jest.mock("../controller/product.controller", () => ({
    getAll: jest.fn((req, res) => res.status(200).send({
        message: "OK",
        result: [{ id: 1, name: "Product 1" }],
    })),
    deleteById: jest.fn((req, res) => {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).send({ message: "Invalid ID format" });
        }
        res.status(204).send(); // No Content
    }),
    insertProduct: jest.fn((req, res) => {
        const { id, name, price } = req.body;
        if (typeof id !== "number" ||
            typeof name !== "string" ||
            typeof price !== "number") {
            return res.status(400).send({ message: "Invalid input data" });
        }
        res.status(201).send({ message: "Product created successfully" });
    }),
    updateProduct: jest.fn((req, res) => {
        const id = parseInt(req.params.id, 10);
        const { name, price } = req.body;
        if (isNaN(id) || typeof name !== "string" || typeof price !== "number") {
            return res.status(400).send({ message: "Invalid input data" });
        }
        res
            .status(200)
            .send({ message: `Product with ID ${id} updated successfully` });
    }),
}));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/products", product_route_1.default);
describe("Product Router", () => {
    it("should get all products", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/products");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "OK",
            result: [{ id: 1, name: "Product 1" }],
        });
    }));
    it("should delete a product by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/products/1");
        expect(response.status).toBe(204); // Updated to 204 No Content
    }));
    it("should handle invalid ID format in delete request", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).delete("/products/invalid-id");
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Invalid ID format" });
    }));
    it("should insert a new product", () => __awaiter(void 0, void 0, void 0, function* () {
        const newProduct = { id: 2, name: "New Product", price: 20 };
        const response = yield (0, supertest_1.default)(app).post("/products").send(newProduct);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: "Product created successfully" });
    }));
    it("should handle invalid input data in insert request", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidProduct = {
            id: "string",
            name: "Invalid Product",
            price: "not-a-number",
        };
        const response = yield (0, supertest_1.default)(app).post("/products").send(invalidProduct);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Invalid input data" });
    }));
    it("should update an existing product by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedProduct = { name: "Updated Product", price: 25 };
        const response = yield (0, supertest_1.default)(app).put("/products/1").send(updatedProduct);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: "Product with ID 1 updated successfully",
        });
    }));
    it("should handle invalid input data in update request", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidUpdate = { name: "Updated Product", price: "not-a-number" };
        const response = yield (0, supertest_1.default)(app).put("/products/1").send(invalidUpdate);
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "Invalid input data" });
    }));
});
