import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'




const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const dispatch = useDispatch();

    const userRegister = useSelector(state => state.userRegister);
    const { loading, error, userInfo } = userRegister;

    // Redirect the user if already registered
    const redirect = location.search ? 
      location.search.split('=')[1] : '/';


     useEffect(() => {
        if (userInfo) {
          history.push(redirect)
        }
      }, [history, userInfo, redirect]);


     // Input handler
     const submitHandler = (e) => {
         e.preventDefault();
         if(password !== confirmPassword){
           setMessage('Senhas não Combinam')

         }else{
           dispatch(register(name, email, password)) 
         }
     };



    return (
        <FormContainer>
            <h1>Cadastre se</h1>
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
                   Cadastrar
                </Button>
            </Form>

            <Row className='py-3'>
              <Col>
                Já tem uma conta? {' '}{' '}
                <Link to={redirect ? 
                `/login?redirect=${redirect}` : 
                '/login'}
                style={{ color: '#05c46b', 
                fontSize: '1.2rem'}}
                >
                  Login
                </Link>
              </Col>
          </Row>
        </FormContainer>
    )
}

export default RegisterScreen;
