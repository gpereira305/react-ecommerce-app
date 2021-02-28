import React from 'react'
import { Col, Container, ListGroup, Row } from 'react-bootstrap'




const Footer = () => {
    return (
        <footer>
            <Container>
            
                <Row >
                <Col className='text-center py-3'>
                    <div className='social'> 
                         <i className="fab fa-instagram"></i> 
                         <i className="fab fa-facebook-f"></i>
                         <i className="fab fa-twitter"></i>
                         <i className="fab fa-pinterest"></i>
                      </div>  
                    &copy; TechShop 2021 | All Rights Reserved
                    </Col> 
                </Row>
            </Container>
        </footer>
    )
}

export default Footer;
