import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { saveShippingAddress } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'



const ShippingScreen = ({ history }) => {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart;
    const [address, setAddress] = useState(shippingAddress.address)
    const [city, setCity] = useState(shippingAddress.city)
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
    const [country, setCountry] = useState(shippingAddress.country)

    const dispatch = useDispatch();



    // Input handler
    const submitHandler = (e) => {
      e.preventDefault()
      dispatch(saveShippingAddress({
        address, city, postalCode, country
       }))
      history.push('/payment')
    };



    return (
        <FormContainer>
        <CheckoutSteps step1 step2/>
        <h1>Endereço de Entrega</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='address'>
              <Form.Label>Endereço</Form.Label>
                  <Form.Control
                    type='text' 
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                  >  
                  </Form.Control>
                </Form.Group>
           </Form>

            <Form onSubmit={submitHandler}>
              <Form.Group controlId='city'>
              <Form.Label>Cidade</Form.Label>
                  <Form.Control
                    type='text' 
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                  >  
                  </Form.Control>
                </Form.Group>
           </Form>

            <Form onSubmit={submitHandler}>
              <Form.Group controlId='postalCode'>
              <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type='text' 
                    value={postalCode}
                    required
                    onChange={(e) => setPostalCode(e.target.value)}
                  >  
                  </Form.Control>
                </Form.Group>
           </Form>

            <Form onSubmit={submitHandler}>
              <Form.Group controlId='country'>
              <Form.Label>Estado</Form.Label>
                  <Form.Control
                    type='text' 
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                  >  
                  </Form.Control>
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

export default ShippingScreen;
