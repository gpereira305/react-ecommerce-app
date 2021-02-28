import React from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import { Route } from 'react-router-dom';
import { Container,  Nav, Navbar, NavDropdown, } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions/userActions';
import Searchbox from './SearchBox';




const Header = () => {
    const dispatch = useDispatch();
    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin; 


// input handler
const logoutHandler = () => {
    dispatch(logout())
}    


    return (
        <header>
               <Navbar 
                 bg="dark" 
                 variant='dark' 
                 expand="lg" 
                 collapseOnSelect
                >
                <Container>
                  <LinkContainer to='/'>
                       <Navbar.Brand>TechShop</Navbar.Brand>
                 </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                       <Route render={({ history }) => 
                        <Searchbox  
                           history={history}
                            />} 
                       /> 
                        <Nav className="ml-auto">
                        <LinkContainer to='/cart'>
                          <Nav.Link>
                              <i className='fas fa-shopping-cart'></i>{' '}
                               Carrinho
                           </Nav.Link>
                        </LinkContainer>
                          {userInfo ? (
                            <NavDropdown title={userInfo.name} id='username'>
                                <LinkContainer to='/profile'>
                                    <NavDropdown.Item>Meu Perfil</NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Item onClick={logoutHandler}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                            ) : ( 
                            <LinkContainer to='/login'>
                                <Nav.Link>
                                <i className='fas fa-user'></i>{' '}
                                    Sign In
                                </Nav.Link> 
                            </LinkContainer> 
                           )}
                            {userInfo && userInfo.isAdmin && (
                            <NavDropdown title='Admin' id='adminmenu'>
                                <LinkContainer to='/admin/userlist'>
                                    <NavDropdown.Item>Usuársios</NavDropdown.Item>
                                </LinkContainer> 
                                <LinkContainer to='/admin/productlist'>
                                    <NavDropdown.Item>Produtos</NavDropdown.Item>
                                </LinkContainer> 
                                <LinkContainer to='/admin/orderlist'>
                                    <NavDropdown.Item>Pedidos</NavDropdown.Item>
                                </LinkContainer> 
                            </NavDropdown>
                            )}
                        </Nav> 
                    </Navbar.Collapse>
            </Container>
                    </Navbar>
        </header>
    )
}

export default Header;
