const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const categoryRoute = require("./routes/categoryRoute")
const productRoute = require("./routes/productRoute")
const path = require("path")

const cors = require('cors');

//REST object
const app = express();

//configure dotenv
dotenv.config();


//connect databse
connectDB();


//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,"./client/build")))


//routes
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/category",categoryRoute);
app.use("/api/v1/product",productRoute);

//REST api
app.use("*",function(req,res){
  res.sendFile(path.join(__dirname,"./client/build/index.html"))
})


//port
const PORT = process.env.PORT || 8080;

//listen PORT
app.listen(PORT, () => {
  // console.log(`server is running in ${PORT}`);
});
