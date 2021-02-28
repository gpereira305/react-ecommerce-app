
import bcrypt from 'bcryptjs';

const users = [
    {
        name: 'Admin User',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        isAdmin: true
        
    },

    {
        name: 'Diana Prince',
        email: 'diana@gmail.com',
        password: bcrypt.hashSync('123456', 10), 
    },

    {
        name: 'Clark Kent',
        email: 'clark@gmail.com',
        password: bcrypt.hashSync('123456', 10),
        
    },
] 

export default users