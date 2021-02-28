import React, { useState } from 'react'
import { Form, Button, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { savePaymentMethod} from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'



const PaymentScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart;
    if(!shippingAddress){
        history.push('/shipping')
    }
    const [paymentMethod, setPaymentMethod] = useState('Paypal'); 
    const dispatch = useDispatch();

    // Input handler
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))
        history.push('/placeorder')
      }



    return (
        <FormContainer>
        <CheckoutSteps step1 step2 step3/>
        <h1>Forma de pagamento</h1>
            <Form onSubmit={submitHandler}> 
               <Form.Group>
                   <Form.Label as='legend'>Selecione</Form.Label>
              
                <Col>
                    <Form.Check
                      type='radio'
                      label='PayPal ou Cartão de Crédito'
                      id='PayPal'
                      name='paymentMethod'
                      value='PayPal'
                      checked
                      onChange={(e) => 
                      setPaymentMethod(e.target.value)}
                    > 
                    </Form.Check>
                </Col>
                </Form.Group>
                <Button
                   type='submit'
                   variant='primary'
                >
                  Continuar   
                </Button>
           </Form>

        </FormContainer>
    )
}

export default PaymentScreen;
