import React from 'react'
import { Spinner } from 'react-bootstrap';





const Loader = () => {
    return (
        <Spinner 
          animation='border'
          role='status'
          style={{
              width: '150px',
              height: '150px',
              color: '#05c46b',
              margin: 'auto',
              display: 'block',
              marginTop: '15rem'
          }}
        >
            <span className='sr-only'>
                Carregando...
            </span>
        </Spinner>
    )
}

export default Loader;
