import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants'


const  OrderScreen = ({ match, history }) => {
    const orderId =  match.params.id;
    const [sdkReady, setSdkReady] = useState(false);
    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector(state => state.orderPay)
    const { loading:loadingPay, success:successPay } = orderPay;

    const orderDeliver = useSelector(state => state.orderDeliver)
    const { loading:loadingDeliver, success:successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

    //  price calculation
    if(!loading){
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
            }
            order.itemsPrice = addDecimals(
                order.orderItems.reduce(
                    (accum, item) => accum + item.price * item.qty, 0)
            ) 
    }

    useEffect(() => {
        if(!userInfo){
            history.push('/login')
        }
        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            script.async = true
            script.onload = () => {
              setSdkReady(true)
            }
            document.body.appendChild(script)
          } 
         
        if(!order || successPay || successDeliver){
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        }else if(!order.isPaid){
            if(!window.paypal){
                addPayPalScript()

            }else{
                setSdkReady(true)
            }
        }
    }, [
        dispatch, 
        orderId, 
        successPay, 
        order,
        successDeliver
    ]);  


    // Input handlers
    const successPaymentHandler = (paymentResult) => { 
        dispatch(payOrder(orderId, paymentResult))
    };
    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    };



    return loading ? <Loader/> : error ?
      <Message variant='danger'>{error}</Message> :
      <>
      <h2>ID Pedido: {order._id}</h2>
        <Row> 
               <Col md={8}>
                    <ListGroup.Item>
                        <h2>Dados para Entrega</h2>
                        <p> NOME:  {order.user.name}</p>
                        <p>
                          EMAIL: 
                            <a href={`mailto:${order.user.email}`} style={{
                                fontStyle: 'italic', fontSize: '.9rem'
                                }}>{' '}
                             {order.user.email}
                            </a>
                        </p>
                          <p>RUA: {order.shippingAddress.address}</p>
                          <p>CIDADE: {order.shippingAddress.city}</p>   
                          <p>CEP: {order.shippingAddress.postalCode}</p> 
                          <p>ESTADO: {order.shippingAddress.country}</p> 
                          {order.isDelivered ? (
                          <Message variant='success'>Entrgue em {order.deliveredAt}</Message>
                           ) : (
                          <Message variant='danger'>Aguardando Entrega</Message> 
                           )} 
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Forma de Pagamento</h2>
                        <h6>{order.paymentMethod}</h6>
                        {order.isPaid ? (
                          <Message variant='success'>Pago em {order.paidAt}</Message>
                         ) : (
                          <Message variant='danger'>Aguardando Pagamento</Message> 
                         )}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Itens do Pedido</h2>
                        <h6>
                            {order.orderItems.length === 0 ?
                            <Message>
                                Sem Pedidos 
                            </Message> : (
                               <ListGroup variant='flush'>
                                   {order.orderItems.map((item, index) => (
                                       <ListGroup.Item key={index}>
                                           <Row>
                                               <Col md={1}>
                                                   <Image
                                                       src={item.image}
                                                       alt={item.name}
                                                       fluid rounded
                                                   />
                                               </Col>

                                               <Col>
                                                   <Link to={`/product/${item.product}`}>
                                                       {item.name}
                                                   </Link>
                                               </Col>

                                               <Col md={4}> 
                                                       {item.qty} x 
                                                       R$ { item.price } =
                                                       R$ { item.qty * item.price} 
                                               </Col>
                                           </Row>
                                       </ListGroup.Item>
                                   ))}
                               </ListGroup>  
                            )}
                        </h6>
                    </ListGroup.Item>
               </Col>

               <Col md={4}> 
                   <Card>
                       <ListGroup variant='flush'>
                             <ListGroup.Item>
                                 <h2>Resumo do Pedido</h2>
                             </ListGroup.Item>
                             <ListGroup.Item>
                                 <Row>
                                     <Col>Preço Itens</Col>
                                     <Col>R$ {order.itemsPrice}</Col>
                                 </Row>
                             </ListGroup.Item>
                             <ListGroup.Item>
                                 <Row>
                                     <Col>
                                       {order.itemsPrice > 100 ? 'Frete Grátis':
                                       'Frete'}
                                     </Col>
                                     <Col>R$ {order.shippingPrice}</Col>
                                 </Row>
                             </ListGroup.Item>
                             <ListGroup.Item>
                                 <Row>
                                     <Col>ICMS</Col>
                                     <Col>R$ {order.taxPrice}</Col>
                                 </Row>
                             </ListGroup.Item>
                             <ListGroup.Item>
                                 <Row>
                                     <Col>Preço Total</Col>
                                     <Col>R$ {order.totalPrice}</Col>
                                 </Row>
                             </ListGroup.Item> 

                             {!order.isPaid && (
                                <ListGroup.Item> 
                                 {loadingPay && <Loader/>}
                                 {!sdkReady ? <Loader/> : (
                                     <PayPalButton 
                                        amount={order.totalPrice}
                                        onSuccess={successPaymentHandler}
                                        
                                     />
                                     
                                 )}
                                </ListGroup.Item>
                             )}
                             { loadingDeliver && <Loader/> }
                             { userInfo && userInfo.isAdmin &&
                               order.isPaid && !order.isDelivered &&
                             (
                               <ListGroup.Item>
                                   <Button
                                     type='button'
                                     className='btn btn-block'
                                     onClick={deliverHandler}
                                   > 
                                   Marcar como Entregue
                                   </Button>
                               </ListGroup.Item>
                             )}  
                       </ListGroup>  
                   </Card>
               </Col>
            </Row>
      </>
};


export default OrderScreen;