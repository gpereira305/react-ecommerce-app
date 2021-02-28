import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader';
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'
import Paginate from '../components/Paginate'



const ProductListScreen = ({ history, match }) => {
    const pageNumber = match.params.pageNumber;

    const dispatch = useDispatch();

    const productList = useSelector(state => state.productList)
    const { loading, error, products, page, pages } = productList;

    const productCreate = useSelector(state => state.productCreate)
    const { 
        loading:loadingCreate, 
        error:errorCreate, 
        success:successCreate ,
        product: createdProduct
    } = productCreate;

    const productDelete = useSelector(state => state.productDelete)
    const { 
        loading:loadingDelete, 
        error:errorDelete, 
        success:successDelete 
    } = productDelete;

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin; 


    useEffect(() => {
        dispatch({ type: PRODUCT_CREATE_RESET })
        if(!userInfo.isAdmin){
            history.push('/login')
        }
        if(successCreate){
            history.push(`/admin/product/${createdProduct._id}/edit`)
        }else{
            dispatch(listProducts('', pageNumber))
        }
    }, [
        dispatch, 
        history, 
        userInfo, 
        successDelete,
        successCreate,
        createdProduct,
        pageNumber
    ]);


    // input handlers
    const deleteHandler = (id) => { 
         if(window.confirm(
            'Tem certeza que quer remover esse produto?'
             )){
             dispatch(deleteProduct(id))   
         }
    };
    const createProductHandler = () => {
        dispatch(createProduct())
    };




    return (
        <>
        <Row className='align-items-center'>
            <Col>
                <h1>Products</h1>
            </Col>
            <Col className='text-right'>
                <Button className='my-3'
                onClick={createProductHandler}>
                    <i className='fas fa-plus'></i>{' '}
                    Criar Produto
                </Button>
            </Col>
        </Row> 
         {loadingDelete && <Loader/>}
         {errorDelete && <Message variant='danger'>{errorDelete}</Message>} 

         {loadingCreate && <Loader/>}
         {errorCreate && <Message variant='danger'>{errorCreate}</Message>} 

         {loading ? <Loader/> : error ? 
         <Message variant='danger'>{error}</Message> :
         (
             <>
            <Table
               striped
               bordered
               hover
               responsive
               className='table-sm'
            >
             <thead>
                 <tr>
                     <th>ID DO PRODUTO</th>
                     <th>NOME DO PRODUTO</th>
                     <th>PREÇO</th>
                     <th>CATEGORIA</th>
                     <th>MARCA DO PRODUTO</th>
                     <th>AÇÕES</th>
                 </tr>
             </thead>
             <tbody>
                 {products.map(product => (
                     <tr key={product._id}>
                         <td><h6>{product._id}</h6></td>
                         <td><h6>{product.name}</h6></td>
                         <td><h6>R$ {product.price}</h6></td>
                         <td><h6>{product.category}</h6></td>
                         <td><h6>{product.brand}</h6></td>
                         <td>
                             <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                  <Button 
                                     variant='light' 
                                     className='btn-sm'
                                     >
                                       <i className='fas fa-edit'></i>
                                  </Button>
                             </LinkContainer>
                             <Button 
                                     variant='danger' 
                                     className='btn-sm'
                                     onClick={() => 
                                     deleteHandler(product._id)}
                                     >
                                       <i className='fas fa-trash'></i>
                             </Button>
                         </td>
                     </tr>
                 ))}
             </tbody>
            </Table> 
            <Paginate
                pages={pages}
                page={page}
                isAdmin={true}
            />
        </>
         )}   
        </>
    )
}

export default ProductListScreen
