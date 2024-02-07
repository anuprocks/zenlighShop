const express = require("express");
const { registerController,loginController,testController, forgotpasswordController, updateProfileController, getOrdersController, getAllOrdersController, orderStatusController } = require("../controllers/authController"); 
const { requireSignIn, isAdmin } = require("../middlewares/authMiddlewares");


//router object
const router = express.Router();

//routes

//registration(POST METHOD)
router.post('/register',registerController);

//login
router.post('/login',loginController);


//protected user-route
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({
        ok:true
    })
});

//protected admin-route
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({
        ok:true,
    })
});

//forgot password
router.post('/forgot-password',forgotpasswordController);

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//order - user side
router.get('/orders',requireSignIn,getOrdersController);

//order - admin side
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController);

//order status- admin side
router.get('/order-status/:orderId',requireSignIn,isAdmin,orderStatusController);


module.exports = router;