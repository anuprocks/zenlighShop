const { default: slugify } = require("slugify");
const ProductModel = require("../models/ProductModel");
const categoryModel = require("../models/CategoryModel");
const OrderModel = require("../models/OrderModel");
const fs = require("fs");
const braintree = require("braintree");
const dotenv = require('dotenv')

dotenv.config();


//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, quantity, shipping } = req.fields;
    const { photos } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photos && photos.size > 1000000:
        return res.status(500).send({
          error: "photo is required and photo size should be less than 1mb",
        });
    }

    //check for existing product
    const existingCategory = await ProductModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Product already exists",
      });
    }
    //new product
    const products = new ProductModel({
      ...req.fields,
      slug: slugify(name),
    });

    if (photos) {
      products.photos.data = fs.readFileSync(photos.path);
      products.photos.contentType = photos.type;
    }
    await products.save();

    return res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    ;
    return res.status(500).send({
      success: false,
      message: "product create failed",
    });
  }
};

//access all product
const getAllProductController = async (req, res) => {
  try {
    const products = await ProductModel.find({})
      .populate("category")
      .select("-photos")
      .limit(12)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "All Products",
      ToatalProducts: products.length,
      products,
    });
  } catch (error) {
    ;
    return res.status(500).send({
      success: false,
      message: "Failed to get all products",
    });
  }
};

//accessing single product

const getSingleProductController = async (req, res) => {
  try {
    const product = await ProductModel.findOne({ slug: req.params.slug })
      .populate("category")
      .select("-photos");

    return res.status(200).send({
      success: true,
      message: "Product found sucessfully",
      product,
    });
  } catch (error) {
    ;
    return res.status(500).send({
      success: true,
      message: "Can't access the product",
    });
  }
};

const productPhotoController = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).select(
      "photos"
    );
    // console.log(product.photos.contentType);

    if (product.photos.data) {
      res.set("Content-Type", product.photos.contentType);
      return res.status(200).send(product.photos.data);
    } else {
      return res.status(404).send({
        success: false,
        message: "Photo not found",
      });
    }
  } catch (error) {
    ;
    return res.status(500).send({
      success: false,
      message: "Photo can't be accessed",
    });
  }
};

//delete product controller

const deleteProductController = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.params.pid).select("-photos");
    return res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
      res.status(500).send({
        success: false,
        message: "Failed to delete Product",
      });
  }
};

//update product controller
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, quantity, shipping } = req.fields;
    const { photos } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !price:
        return res.status(500).send({ error: "price is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photos && photos.size > 1000000:
        return res.status(500).send({
          error: "photo is required and photo size should be less than 1mb",
        });
    }
    //update product
    const products = await ProductModel.findByIdAndUpdate(
      req.params.pid,
      {
        ...req.fields,
        slug: slugify(name),
      },
      {
        new: true,
      }
    );

    if (photos) {
      products.photos.data = fs.readFileSync(photos.path);
      products.photos.contentType = photos.type;
    }
    await products.save();

    return res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    ;
    return res.status(500).send({
      success: false,
      message: "product Update failed",
    });
  }
};

//filter product

const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await ProductModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    ;
    return res.status(400).send({
      success: false,
      message: "product filteration failed",
      error,
    });
  }
};

//product count controller

const productCountController = async (req, res) => {
  try {
    const total = await ProductModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    ;
    return res.status(400).send({
      success: false,
      message: "product count failed",
      error,
    });
  }
};

const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await ProductModel.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    ;
    return res.status(400).send({
      success: false,
      message: "error in products/page",
      error,
    });
  }
};

// search product
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await ProductModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.json(results);
  } catch (error) {
    ;
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

//related product controller
const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await ProductModel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    ;
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await ProductModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    ;
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
 const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        console.error(err);
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    ;
  }
};

//payment
const braintreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new OrderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    ;
  }
};




module.exports = {
  createProductController,
  braintreePaymentController,
  braintreeTokenController,
  productCategoryController,
  productCountController,
  filterProductController,
  updateProductController,
  getAllProductController,
  getSingleProductController,
  deleteProductController,
  productPhotoController,
  productListController,
  searchProductController,
  relatedProductController,
};
