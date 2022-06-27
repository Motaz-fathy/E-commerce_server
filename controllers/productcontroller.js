const Product = require("../models/productModel");
const productController = {};

productController.Getallproducts = async (req, res) => {
  
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: ""
        },
    
      }
    : {};
  const products = await Product.find({ ...keyword })
  res.json({ products});
};

productController.SingleProduct = async (req , res ) => {

  try {
    const product = await Product.findOne({_id : req.params.id}) 
  if(product)
  {
    res.json(product)
    console.log(product)
  }
  else {
  res.status(404).json({message : "this product not found "})
  }
  } catch (message) {
  res.status(404).json({message : "this product not found "})
    
  }

}

module.exports = productController;
