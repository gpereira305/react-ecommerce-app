import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader';
import { listOrders } from '../actions/orderActions'



const OrderListScreen = ({ history }) => {
    const dispatch = useDispatch();

    const orderList = useSelector(state => state.orderList)
    const { loading, error, orders } = orderList;

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin; 


    useEffect(() => {
        if(userInfo && userInfo.isAdmin){
            dispatch(listOrders())
        }else{
            history.push('/')
        }

    }, [dispatch, history, userInfo]); 




    return (
        <>
         <h1>Pedidos</h1>
         {loading ? <Loader/> : error ? 
         <Message variant='danger'>{error}</Message> :
         (
            <Table
               striped
               bordered
               hover
               responsive
               className='table-sm'
            >
             <thead>
                 <tr>
                     <th>ID DO PEDIDO</th>
                     <th>NOME DO CLIENTE</th>
                     <th>DATA DA COMPRA</th>
                     <th>VALOR DA COMPRA</th>
                     <th>PAGO</th>
                     <th>ENTREGUE</th>
                     <th>AÇÕES</th>
                 </tr>
             </thead>
             <tbody>
                 {orders.map(order => (
                     <tr key={order._id}>
                         <td>{order._id}</td>
                         <td>{order.user && order.user.name}</td>
                         <td>{order.createdAt.substring(0, 10)}</td>
                         <td>R$ {order.totalPrice}</td>
                         <td>
                             {order.isPaid ? (
                                order.paidAt.substring(0, 10)
                             ) : (<i className='fas fa-times' style={{ color: '#ff0303'}}></i>
                             )}
                         </td>
                         <td>
                             {order.isDelivered ? (
                                order.deliveredAt.substring(0, 10)
                             ) : (<i className='fas fa-times' style={{ color: '#ff0303'}}></i>
                             )}
                         </td>
                         <td>
                             <LinkContainer to={`/order/${order._id}`}>
                                  <Button 
                                     variant='light' 
                                     className='btn-sm'
                                     >
                                     Detalhes
                                  </Button>
                             </LinkContainer> 
                         </td>
                     </tr>
                 ))}
             </tbody>
            </Table> 
         )}   
        </>
    )
}

export default OrderListScreen
