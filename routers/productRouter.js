const express = require("express");
const router = express.Router();
const productValidator = require("../validators/productValidator");
const authMiddleware = require("../middlewares/authMiddleware");
const productController = require("../controllers/productController");

// admin can add product
router.post(
  "/addProduct",
  productValidator.addProductValidator,
  authMiddleware.verifyUserToken,
  productController.addProduct
);

router.get(
  "/allProducts",
  productValidator.allProductsValidator,
  authMiddleware.verifyUserToken,
  productController.getAllProducts
);
router.get(
  "/:id",
  productValidator.getProductByIdValidator,
  authMiddleware.verifyUserToken,
  productController.getProductById
);
router.put(
  "/update/:id",
  productValidator.updateProductValidator,
  authMiddleware.verifyUserToken,
  productController.updateProduct
);
router.delete(
  "/delete/:id",
  productValidator.deleteProductValidator,
  authMiddleware.verifyUserToken,
  productController.deleteProduct
);

module.exports = router;