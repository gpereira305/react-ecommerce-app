import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions' 
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'




const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  
  const dispatch = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails; 

    const productUpdate = useSelector(state => state.productUpdate);
    const { 
      loading: loadingUpdate,
      error: errorUpdate,
      success: successUpdate
    } = productUpdate; 


     useEffect(() => { 
       if(successUpdate){
         dispatch({
           type: PRODUCT_UPDATE_RESET
         });
         history.push('/admin/productlist')

       }else{
         if(!product.name || product._id !== productId){
             dispatch(listProductDetails(productId))
         }else{
             setName(product.name)
             setPrice(product.price)
             setImage(product.image)
             setBrand(product.brand)
             setCategory(product.category)
             setCountInStock(product.countInStock)
             setDescription(product.description)
         }
       } 

      }, [
          dispatch, 
          history, 
          productId, 
          product, 
          successUpdate
     ]);


     // Input handlers 
     const uploadFileHandler = async (e) => { 
       const file = e.target.files[0]
       const formData = new FormData()
       formData.append('image', file)
       setUploading(true)

       try {
         const config = {
           headers: {
             'Content-Type': 'multipart/form-data',
           }
         }
         const { data } = await axios.post('/api/upload', formData, config)
         setImage(data)
         setUploading(false)

       } catch (error) {
         console.error(error)
         setUploading(false)  
       }
     };
     const submitHandler = (e) => {
      e.preventDefault()
      dispatch(updateProduct({
          _id: productId,
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
        })
      )
    };



    return (
        <>
            <Link
              to='/admin/productlist'
              className='btn btn-dark my-3'
            >
              Voltar
            </Link> 

        <FormContainer>
           <h1>Editar Produto</h1>
            { loadingUpdate && <Loader/> }  
            { errorUpdate && <Message variant='danger'>{errorUpdate}</Message>} 
            { loading ? <Loader/> : error ?
           <Message variant='danger'>{error}</Message> :
           ( 
             <Form onSubmit={submitHandler}>
             <Form.Group controlId='name'>

             <Form.Label>Nome</Form.Label>
                <Form.Control
                  type='name' 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                >  
                </Form.Control>
              </Form.Group>

                <Form.Group controlId='price'>
                    <Form.Label>Preço</Form.Label>
                    <Form.Control
                      type='number'
                      value={price}
                      onChange={(e) => 
                      setPrice(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='image'> 
                <Form.Label>Imagem</Form.Label>
                  <Form.Control
                      type='text'
                      value={image}
                      onChange={(e) => 
                      setImage(e.target.value)}
                    ></Form.Control>
                    <Form.File
                      id='image-file'
                      label='Escolha um Arquivo'
                      custom
                      onChange={uploadFileHandler}
                    ></Form.File>
                    { uploading && <Loader/>}
                </Form.Group> 

                <Form.Group controlId='brand'> 
                <Form.Label>Marca</Form.Label>
                  <Form.Control
                      type='text'
                      value={brand}
                      onChange={(e) => 
                      setBrand(e.target.value)}
                    ></Form.Control>
                </Form.Group> 

                <Form.Group controlId='countInStock'>
                    <Form.Label>Qtd. em Estoque</Form.Label>
                    <Form.Control
                      type='number'
                      value={countInStock}
                      onChange={(e) => 
                      setCountInStock(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='category'> 
                <Form.Label>Categoria</Form.Label>
                  <Form.Control
                      type='text'
                      value={category}
                      onChange={(e) => 
                      setCategory(e.target.value)}
                    ></Form.Control>
                </Form.Group> 

                <Form.Group controlId='description'> 
                <Form.Label>Descrição</Form.Label>
                  <Form.Control
                      type='text'
                      value={description}
                      onChange={(e) => 
                      setDescription(e.target.value)}
                    ></Form.Control>
                </Form.Group> 

                <Button
                  type='submit'
                  variant='primary'
                >
                   Atualizar
                </Button>
            </Form> 
         )} 
        </FormContainer>
     </>
    )
}

export default ProductEditScreen;
