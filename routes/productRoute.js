const express = require('express');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddlewares');
const { createProductController, getAllProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, filterProductController, productCountController, productListController, searchProductController, relatedProductController, productCategoryController, braintreeTokenController, braintreePaymentController } = require('../controllers/productController');
const formidableMiddleware = require('express-formidable');

const router = express.Router();


//create Product

router.post('/create-product',requireSignIn,isAdmin,formidableMiddleware(),createProductController)

//update Product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidableMiddleware(),updateProductController)

//fetching all product

router.get('/get-product',getAllProductController);

//get single product
router.get('/get-product/:slug',getSingleProductController);

//get product photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/delete-product/:pid',deleteProductController)

//filter product
router.post('/product-filters',filterProductController);

//products count
router.get('/product-count',productCountController);

//products by page
router.get('/product-list/:page',productListController);

//search
router.get('/search/:keyword',searchProductController)

//get similar products
router.get('/related-product/:pid/:cid',relatedProductController)

//category-wise product
router.get('/category-product/:slug',productCategoryController)

//braintree payments

//token
router.get('/braintree/token',braintreeTokenController)

//payments

router.post('/braintree/payment',requireSignIn,braintreePaymentController)




module.exports= router;