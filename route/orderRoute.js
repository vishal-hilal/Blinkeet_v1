import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController ,stripePaymentController} from '../controllers/orderController.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post("/create-payment-intent",auth,stripePaymentController);
orderRouter.get("/order-list",auth,getOrderDetailsController)

export default orderRouter