import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'




// Description   Create new Order
// Route         POST/api/orders
// Description   Private
 const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body

      if(orderItems && orderItems.length === 0){
          res.status(400)
          throw new Error('Nenhum pedido')
          return 
      }else{
          const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          });

          const createdOrder = await order.save();
          res.status(201).json(createdOrder);
      }

});



// Description   Get Order by ID
// Route         GET/api/orders/:id
// Description   Private
  const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if(order){
    res.json(order)

  }else{
    res.status(404)
    throw new Error('Pedido não encontrado')
  }
   
});



// Description   Get logged in user orders
// Route         GET /api/orders/myorders
// Description   Private
  const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id}) 
  res.json(orders) 
});



// Description    Get all orders
// Route          GET /api/orders
// Description    Private/Admin
  const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name') 
  res.json(orders) 
});



// Description   Update order to paid
// Route         GET /api/orders/:id/pay
// Description   Private
  const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if(order){
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder)

  }else{
    res.status(404)
    throw new Error('Pedido não encontrado')
  }
   
});


 
  // Description    Update order to delivered
  // Route          GET /api/orders/:id/deliver
  // Description    Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})


export { 
  addOrderItems, 
  getOrderById, 
  updateOrderToPaid,
  getMyOrders, getOrders,
  updateOrderToDelivered
}