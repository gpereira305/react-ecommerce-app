import React, { useState } from 'react'
import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import Ratings from './Ratings' 

const Product = ({product, match}) => { 






    return (
        <Card className='my-3 p-3 rounded'>
           <Card.Img
                src={product.image}
                variant='top'
             />
            <Card.Body> 
                <Card.Title as='div'> 
                   <strong>{product.name}</strong>
             </Card.Title> 

            <Card.Text as='div'>
            <Ratings
                value={product.rating}
                text={`${product.numReviews} Avaliações`}
              /> 
            </Card.Text>
            <Card.Text as='h3'>
              R$ {product.price}
            </Card.Text> 
            <Card.Text 
             style={{
               color: '#05c46b',
               fontSize: '.9rem'
             }}
            as='h6'>
              Frete Grátis acima de R$ 399.99
            </Card.Text> 
             <Link to={`/product/${product._id}`} 
                className='btn btn-dark my-3'>
                Ver  Detalhes
             </Link> 
            </Card.Body>
        </Card>
    )
}





export default Product;
