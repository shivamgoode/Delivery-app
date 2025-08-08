import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import auth from '../middleware/auth.js';


const cartRouter = express.Router();


cartRouter.post('/add',auth, addToCart);
cartRouter.post('/get',auth, getCart);
cartRouter.post('/remove',auth, removeFromCart);


export default cartRouter;