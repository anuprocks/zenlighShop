const express  = require('express');
const { isAdmin, requireSignIn } = require('../middlewares/authMiddlewares');
const { createcategoryController, updateCategoryController, getAllCategoriesController, getSingleCategory, deleteCategoryController } = require('../controllers/categoryController');


const router = express.Router();

//routes
//create-category
router.post('/create-category',requireSignIn,isAdmin,createcategoryController);

//update-category
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);

//get all categories
router.get('/get-category',getAllCategoriesController);

//get single category
router.get('/single-category/:slug',getSingleCategory);

//delete category
router.delete('/delete-category/:slug',requireSignIn,isAdmin,deleteCategoryController);





module.exports= router;