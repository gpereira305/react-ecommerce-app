import Product from '../models/productModel.js';
import asyncHandler from 'express-async-handler';  





// Description   Fetch all products / Search for products in the homepage
// Route         GET/api/products
// Description   Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 198
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i'
      },
    } : {};
    
    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({ ...keyword })
    .limit(pageSize).skip(pageSize * (page -1));
    res.json({ 
      products, page, 
      pages: Math.ceil(count / pageSize)
    })

});



// Description   Fetch all products
// Route         GET/api/products
// Description   Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById( req.params.id)
    if(product){
        res.json(product)
    }else{
        res.status(404)
        throw new Error('Produto não  encontrado') 
    }

});



// Description   Delete a product
// Route         DELETE/api/products
// Description   Private/admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById( req.params.id)
    if(product){
        await product.remove()
        res.json({ message: 'Produto Removido com Sucesso!'})
    }else{
        res.status(404)
        throw new Error('Produto não  encontrado') 
    }
});


// Description   Create a product
// Route         POST/api/products
// Description   Private/admin
const createProduct = asyncHandler(async (req, res) => { 
    const product = new Product({
        name: 'Adicione um Nome...',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Adicione uma Marca...',
        category: 'Adicione uma Categoria...',
        countInStock: 0,
        numReviews: 0,
        description: 'Faça uma Descrição...',
      });
      const createdProduct = await product.save()
      res.status(201).json(createdProduct)
});


// Description   update a product
// Route         PUT/api/products/:id 
// Description   Private/admin
const updateProduct = asyncHandler(async (req, res) => { 
    const {
        name,
        price,
        description,
        image,
        brand,
        category,
        countInStock,
      } = req.body
    
      const product = await Product.findById(req.params.id)
    
      if (product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock
    
        const updatedProduct = await product.save()
        res.json(updatedProduct)
      } else {
        res.status(404)
        throw new Error('Produto não Encontrado')
      }
});


// Description   Create a review
// Route         POST/api/products/:id/ reviews 
// Description   Private
const createProductReview = asyncHandler(async (req, res) => { 
      const { rating, comment } = req.body ;
      const product = await Product.findById(req.params.id)
    
      if (product) { 
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
          )
      
          if (alreadyReviewed) {
            res.status(400)
            throw new Error('Esse Produto já foi Avaliado')
          }
          const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
          }
      
          product.reviews.push(review)
          product.numReviews = product.reviews.length
          product.rating = product.reviews.reduce((acc, item) => 
          item.rating + acc, 0) / product.reviews.length;
      
          await product.save()
          res.status(201).json({ message: 'Avaliação adicionada' })
      } else {
        res.status(404)
        throw new Error('Produto não Encontrado')
      }
});

// Description   Get top rated products
// Route         GET/api/products/toprated
// Description   Public
const getTopProducts = asyncHandler(async (req, res) => {  
  const products = await Product.find({}).sort({ rating: -1 }).limit(4);
  res.json(products)
});


export { 
    getProducts, 
    getProductById, 
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts
 }