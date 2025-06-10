import { updateCart } from '../services/cart.js';
import { validateCartInput, validateCartInUrl } from '../middlewares/validators.js';
import { Router } from 'express';
import { getCart } from '../services/cart.js';
import { getAllCarts } from '../services/cart.js';

const router = Router();
// GET all carts
router.get('/', async (req, res, next) => {
  try {
    const carts = await getAllCarts();
    res.json({ success: true, carts });
  } catch (error) {
    next({
      status: 500,
      message: "Could not fetch carts"
    });
  }
});

// GET cart by cartId
router.get('/:cartId', validateCartInUrl, async (req, res, next) => {
    const { cartId } = req.params;
    const cart = await getCart(cartId);

    if (!cart) {
        next({
        status: 404,
        message: 'No cart found!'
        });
    } else {
        res.json({
        success: true,
        cart: cart
        });
    }
});

// PUT cart
router.put('/', validateCartInput, updateCart);


export default router;