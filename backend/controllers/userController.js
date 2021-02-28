import User from '../models/userModel.js';
import asyncHandler from 'express-async-handler';  
import generateToken from '../utils/generateToken.js';



// Description   Auth users
// Route         GET/api/users/login
// Description   Public
const authUser = asyncHandler(async (req, res) => { 
    const { email, password } = req.body
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin, 
            token: generateToken(user._id),
        })
    }else{
        res.status(401)
        throw new Error('Senha ou email Inválido')
    }
});


// Description   Register users
// Route         POST/api/users
// Description   Public
const registerUser = asyncHandler(async (req, res) => { 
    const { name, email, password } = req.body
    const userExist = await User.findOne({ email }); 
    if(userExist){
        res.status(400)
        throw new Error('Usuário já existente')
    }
    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });

    }else{
        res.status(400)
        throw new Error('Dados do Usuário Invválidos')
    }
});



// Description   get users profile
// Route         GET/api/users/profile
// Description   Private
const getUserProfile = asyncHandler(async (req, res) => {  
    const user = await User.findById(req.user._id)
    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin, 
        });

    }else{
        res.status(404)
        throw new Error('Usuário não Encontrado')
    }
});


// Description   Update users profile
// Route         PUT/api/users/profile
// Description   Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
  
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = req.body.password
      }
      const updatedUser = await user.save()
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
});


// Description   Get all users
// Route         GET/api/users
// Description   Private/Admin
const getUsers = asyncHandler(async (req, res) => {  
    const users = await User.find({});
    res.json(users) 
});



// Description   Delete users
// Route         DELETE/api/users/:id
// Description   Private/Admin
const deleteUser = asyncHandler(async (req, res) => {  
    const user = await User.findById(req.params.id);
    if(user){
        await user.remove()
        res.json({ message: 'Usuário removido com sucesso!'}) 
    }else{
        res.status(404)
        throw new Error('Usuário não Encontrado')
    }
});



// Description   Get user by ID
// Route         GET/api/users/:id
// Description   Private/Admin
const getUserById = asyncHandler(async (req, res) => {  
    const user = await User.findById(req.params.id).select('-password');
    if(user){
        res.json(user) 
    }else{
        res.status(404)
        throw new Error('Usuário não Encontrado')
    }
});
 


// Description   Update user
// Route         PUT/api/users/:id
// Description   Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
  
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email 
      user.isAdmin = req.body.isAdmin

      const updatedUser = await user.save()
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin, 
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
});







export { 
    authUser, 
    getUserProfile, 
    registerUser,
    updateUserProfile,
    getUsers, deleteUser, 
    getUserById, updateUser
}
