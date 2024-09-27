import { Router } from "express";
import productController from "../controller/product.controller";
const productRouter = Router();
// specifies the endpoint and the method to call
productRouter.get("/", productController.getAll);
// export the router
// Endpoint to get all products
// Endpoint to delete a product by ID
productRouter.delete("/:id", productController.deleteById);
// Endpoint to insert a new product
productRouter.post("/", productController.insertProduct);
// Endpoint to update an existing product by ID
productRouter.put("/:id", productController.updateProduct);
export default productRouter;
