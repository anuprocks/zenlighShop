const { default: slugify } = require('slugify');
const CategoryModel = require('../models/CategoryModel');

const createcategoryController = async(req,res)=>{
    try {
        const {name}= req.body;
        if(!name){
            return res.status(401).send({
                message:'name of the category is required'
            })
        }

        //check for existing category
        const existingCategory = await CategoryModel.findOne({name});

        if(existingCategory){
            return res.status(200).send({
                success:true,
                message: 'Existed category of same name'
            }) 
        }

        //if new category 
        const category = await new CategoryModel({
            name,
            slug:slugify(name)
        }).save();

        return res.status(201).send({
            success:true,
            message:'new category created successfully',
            category
        })


    } catch (error) {
        ;
        return res.status(500).send({
            success:false,
            message: 'Error while creating category'
            
        })
    }
}


//update category

const updateCategoryController = async(req,res)=>{
    try {

        const {name} = req.body
        const {id} = req.params

        const category = await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true});

        return res.status(201).send({
            success:true,
            message:"category updated successfully",
            category
        })
        
    } catch (error) {
        ;
        return res.status(500).send({
            success:false,
            message:"category update failed"
        })
    }
}


//get all categories
const getAllCategoriesController = async(req,res)=>{
    try {
        const category = await CategoryModel.find({});
        res.status(200).send({
            success:true,
            message:"Categories successfully retrived",
            category
        })
    } catch (error) {
            ;
            return res.status(500).send({
                success:false,
                message:'Cannot retrive all categories'
            })
    }
}

//get single category
const getSingleCategory = async(req,res)=>{
    try {
        const category = await CategoryModel.findOne({slug:req.params.slug});

            return res.status(200).send({
                success:true,
                message:"Single Category found",
                category
            })


    } catch (error) {
        ;
        return res.status(500).send({
            success:false,
            message:"Category couldn't be found!"
        })
    }
}

//delete category

const deleteCategoryController = async(req,res)=>{
    try {
        const {id} = req.params
        const category = await CategoryModel.findOneAndDelete(id);
        return res.status(200).send({
            success:true,
            message:"Category deleted successfully"
        })
    } catch (error) {
        ;
        return res.status(500).send({
            success:false,
            message:"Category deletion unsuccessfull"
        })
    }
}





module.exports = {createcategoryController,updateCategoryController,getAllCategoriesController,getSingleCategory,deleteCategoryController}