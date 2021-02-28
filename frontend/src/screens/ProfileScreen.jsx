import React, { useState, useEffect } from 'react' 
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader' 
import { getUserDetails, updateUserProfile} from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';




const ProfileScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
 

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile;

  const orderListMy = useSelector(state => state.orderListMy);
  const { loading:loadingOrders, error:errorOrders, orders } = orderListMy;

 

     useEffect(() => {
        if (!userInfo) {
          history.push('/login')
        }else{
            if(!user.name || !user.name || success){
                dispatch({ type: USER_UPDATE_PROFILE_RESET})
                dispatch(getUserDetails('profile'));
                dispatch(listMyOrders());
            }else{
                setName(user.name)
                setEmail(user.email)
            }
        }
      }, [
          history, 
          userInfo, 
          dispatch, 
          user,
          success
        ]);


     // Input handler
     const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
          setMessage('Senhas não Combinam')
        } else {
          dispatch(updateUserProfile({ id: user._id, name, email, password }))
        }
      }



    return ( 
          <Row>
            <Col md={3}> 
                 <h2>Perfil do Usuário</h2>
                    {message && 
                    <Message variant='danger'>
                        {message}
                    </Message>
                    } 
                    {error && 
                    <Message 
                        variant='danger'>
                        {error}
                    </Message>
                    }
                    {success && 
                    <Message 
                        variant='success'>
                         Perfil Atualizado com Sucesso!
                    </Message>
                    }
                    {loading && <Loader />}

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

                        <Form.Group controlId='email'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                            type='email'
                            value={email}
                            onChange={(e) => 
                            setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='password'>
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                            type='password'
                            value={password}
                            onChange={(e)  => 
                            setPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='confirmPassword'>
                            <Form.Label>Confirmar Senha </Form.Label>
                            <Form.Control
                            type='password' 
                            value={confirmPassword}
                            onChange={(e) => 
                            setConfirmPassword(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Button
                        type='submit'
                        variant='primary'
                        >
                        Atualizar
                        </Button>
                    </Form> 
               </Col> 

            <Col md={9}>
                 <h2>Lista de Pedidos</h2>
                 {loadingOrders ? <Loader/> : errorOrders
                 ? <Message variant='danger'>{errorOrders}</Message> : (
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
                            <th>DATA</th>
                            <th>TOTAL PAGO</th>
                            <th>PAGO</th>
                            <th>ENTREGUE</th> 
                            <th></th>
                          </tr>
                       </thead>
                       <tbody>
                           {orders.map(order => (
                               <tr key={order._id}>
                                   <td>{order._id}</td>
                                   <td>{order.createdAt.substring(0, 10)}</td>
                                   <td>{order.totalPrice}</td>
                                   <td style={{ color: '#05c46b'}}>
                                      {order.isPaid ? 
                                       order.paidAt.substring(0, 10) : ( 
                                        <p style={{ color: 'red'}}>Não</p>
                                       )}
                                   </td>
                                   <td>
                                      {order.isDelivered ?
                                       order.deliveredAt.substring(0, 10) : (
                                           <p style={{ color: 'red'}}>Não</p>
                                       )} 
                                   </td>
                                   <td>
                                       <LinkContainer to={`/order/${order._id}`}>
                                           <Button className='btn-sm' variant='light'>Detalhes</Button>
                                       </LinkContainer>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                     </Table>
                 )}
             </Col> 

          </Row> 
    )
}

export default ProfileScreen;
