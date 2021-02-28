import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'


const CartScreen = ({ match, location, history }) => {
    const productId = match.params.id;
    const qty = location.search ? Number(location.search.split('=')[1]) : 1;

    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;



    // Input handler
    const removeFromCartHandler = (id) => { 
        if(cartItems.length === 1){
            window.confirm('Tem certeza que quer remover tudo?')
        }
            dispatch(removeFromCart(id)) 
    }
            
        


    const checkoutHandler = () => {
         history.push('/login?redirect=shipping')
    }


    useEffect(() => {
        if(productId){
            dispatch(addToCart(productId, qty))
        }
    }, [dispatch, productId, qty]);




    return (
        <Row>
            <Col md={8}>
                 <h1>Carrinho</h1>
                 {cartItems.length === 0 
                 ? (<Message className='empty-cart'>
                      <h4>Carrinho Vazio</h4>
                      <h6>
                         <Link to='/' style={{color: '#05c46b'}}>Voltar</Link>
                      </h6>
                   </Message>) : (
                       <ListGroup variant='flush'>
                         {cartItems.map(item => (
                             <ListGroup.Item key={item.product}>
                                 <Row>
                                     <Col md={2}>
                                           <Image
                                               src={item.image}
                                               alt={item.name}
                                               fluid rounded
                                           />
                                     </Col>

                                     <Col md={3}>
                                          <Link
                                            to={`/product/${item.product}`}
                                          >
                                           {item.name}
                                          </Link>
                                     </Col>

                                     <Col md={2}>
                                         R$ {item.price}
                                     </Col>

                                     <Col md={2}>
                                        <Form.Control
                                             as='select'
                                             value={item.qty}
                                              onChange={(e) =>
                                                dispatch( addToCart(item.product, 
                                                  Number(e.target.value))
                                               )}
                                            >
                                            {[...Array(item.countInStock).keys()].map(x => (
                                            <option
                                                key={x + 1}
                                                value={x + 1}
                                            >
                                            {x + 1}
                                            </option>
                                          ))}
                                        </Form.Control>
                                     </Col>

                                     <Col md={2}>
                                         <Button
                                           type='button'
                                           variant='light'
                                           onClick={() => 
                                           removeFromCartHandler(item.product)}
                                         >
                                          <i className='fas fa-trash'></i>   
                                         </Button>
                                     </Col>
                                 </Row>
                             </ListGroup.Item>
                         ))}
                       </ListGroup>
                   )}
            </Col>

            <Col md={4}>
                 <Card>
                     <ListGroup variant='flush'>
                         <ListGroup.Item>
                             <h3>
                                 Subtotal de Itens : {' '}
                                 ( {cartItems.reduce((accum, item) => 
                                 accum + item.qty, 0)} ) {' '}
                                  
                             </h3>
                              <h2>
                             Total a Pagar: {' '}
                             <span style={{color: '#05c46b', fontSize: '1.8rem'}}>
                             R$ {cartItems.reduce((accum, item) => 
                             accum + item.qty * item.price, 0).toFixed(2)}
                             </span>
                              </h2>
                              <h6>À vista ou 12x sem juros</h6>
                         </ListGroup.Item> 
                         <ListGroup.Item>
                             <Button
                                type='button'
                                className='btn-block'
                                disabled={cartItems.length === 0}
                                    onClick={checkoutHandler}
                             >
                                 Ir para checkout
                             </Button>
                         </ListGroup.Item>
                    </ListGroup>
                 </Card>
            </Col> 
        </Row>
    )
}

export default CartScreen
