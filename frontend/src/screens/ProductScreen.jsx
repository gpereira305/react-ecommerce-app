import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Col, Form, FormText, Image, ListGroup, Row } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Ratings from '../components/Ratings'; 
import Loader from '../components/Loader'; 
import Message from '../components/Message'; 
import Meta from '../components/Meta';
import { listProductDetails, createProductReview } from '../actions/productActions'; 
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';



const ProductScreen = ({match, color, paddingTop, history }) => { 
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    
    
    const dispatch  = useDispatch();

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const productReviewCreate = useSelector(state => state.productReviewCreate);
    const { 
        success:successProductReview, 
        error:errorProductReview,  
     } = productReviewCreate;
    



    useEffect(() => { 
        if(successProductReview){
            alert('Avaliação Feita com Sucesso!')
            setRating(0)
            setComment('')
            dispatch({
                type: PRODUCT_CREATE_REVIEW_RESET
            })
        }
        dispatch(listProductDetails(match.params.id)) 
    }, [dispatch, match, successProductReview]); 



    // Input handlers
    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}?qty=${qty}`)
    };
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(createProductReview(match.params.id), {
            rating, comment 
        })
    };


    return (
        <>
           <Link 
                className='btn btn-dark my-3'
                style={{marginBottom: '1rem'}}
                to='/' >
                Voltar
          </Link>
            { loading ?  <Loader/> : error ?
            <Message variant='danger'>{error}</Message> :
             (
           <>    
           <Meta title={product.name}/>  
          <Row>
              <Col md={6}>
                   <Image
                       src={product.image}
                       alt={product.name}
                       fluid
                   />
              </Col>

              <Col md={3}>
                    <ListGroup variant='flush'>
                         <ListGroup.Item>
                                <h3>{product.name}</h3>
                         </ListGroup.Item>
                         <ListGroup.Item>
                               <Ratings
                                   value={product.rating}
                                   text={`${product.numReviews} Avaliações`}
                               />
                         </ListGroup.Item>

                         <ListGroup.Item>
                                <h5>Características Gerais:</h5>{' '}
                                {product.description}
                         </ListGroup.Item>

                    </ListGroup>
              </Col>

              <Col md={3}>
                   <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        <h2>Por Apenas:</h2>
                                    </Col>
                                    <Col>
                                        <h4  style={{color: color, paddingTop: paddingTop}}>
                                            R$ {product.price} 
                                        </h4>
                                        <h6>À vista ou 12x sem juros</h6>
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item> 

                            </ListGroup.Item>
                                  {product.countInStock > 0 && (
                                      <ListGroup.Item>
                                          <Row>
                                              <Col>Selecione a Qtd:</Col>
                                              <Col>
                                                  <Form.Control
                                                    as='select'
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                  >
                                                   {[...Array(product.countInStock).keys()].map(x => (
                                                       <option
                                                         key={x + 1}
                                                         value={x + 1}
                                                       >
                                                        {x + 1}
                                                       </option>
                                                   ))}
                                                  </Form.Control>
                                              </Col>
                                          </Row>
                                      </ListGroup.Item>
                                  )}
                            <ListGroup.Item>
                                <Button 
                                   onClick={addToCartHandler}
                                   className='btn-block'
                                   type='button'
                                   disabled={product.countInStock === 0}
                                >
                                {product.countInStock !== 0 ?
                                 'Comprar' : 'Esgotado'}
                                 
                                </Button>
                            </ListGroup.Item>
                        </ListGroup>
                   </Card> 
              </Col>
          </Row> 
       </>     
          )}
        </>
    )
};


ProductScreen.defaultProps = {
    color: '#05c46b',
    paddingTop: '0rem'
    
  };

export default ProductScreen;
