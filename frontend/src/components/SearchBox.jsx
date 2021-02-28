import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';




const SearchBox = ({ history }) => {
    const [keyword, setKeyword] = useState('');


// Input handler
const submitHandler = (e) => {
    e.preventDefault()
    if(keyword.trim()){
        history.push(`/search/${keyword}`)
    }else{
        history.push('/')
    }
};

 

    return (
        <Form 
          onSubmit={submitHandler} 
          className='searchField'
          inline
        > 
            <Form.Control
               type='text'
               name='q'
               onChange={(e) => 
               setKeyword(e.target.value)}
               placeholder='Perquisar Produto...'
               className='mr-sm-2 ml-sm-5 searchInput'
            ></Form.Control>
            <Button 
              type='submit'
              variant='outline-success'
              className='p-2'
            > Pesquisar</Button>
        </Form>
    )
}

export default SearchBox;
