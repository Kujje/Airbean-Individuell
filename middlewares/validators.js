import Menu from '../models/Menu.js';
import User from '../models/user.js';
import Cart from '../models/cart.js';

export function validateAuthBody(req, res, next) {
    const { username, password, continueAsGuest } = req.body;

    if (!req.body) {
        return res.status(400).json({
            success: false,
            message: 'No body found in request'
        });
    }

    if (continueAsGuest) {
        return next();
    }

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Both username AND password are required unless continuing as guest'
        });
    }

    next();
}

export async function validateCartInput(req, res, next) {
    const { prodId, qty } = req.body;

    if (!prodId || typeof qty !== 'number') {
        return res.status(400).json({
            success: false,
            message: 'Missing or invalid prodId/qty'
        });
    }

    if (qty < 0) {
        return res.status(400).json({
            success: false,
            message: 'Quantity must be >= 0'
        });
    }

    try {
        const exists = await Menu.findOne({ prodId });
        if (!exists) {
            return res.status(400).json({
                success: false,
                message: 'Product does not exist in menu'
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Database error',
            error: error.message
        });
    }
}

export async function validateUser(req, res, next) {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'Missing userId in parameters'
        });
    }

    if (userId.startsWith('guest-')) {
        return next();
    }

    if (userId.startsWith('user-')) {
        try {
            const user = await User.findOne({ userId: userId });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            return next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Database error',
                error: error.message
            });
        }
    }

    return res.status(400).json({
        success: false,
        message: 'Invalid userId prefix'
    });
}

export async function validateCartInBody(req, res, next) {
    const { cartId } = req.body;

    if (!cartId) {
        return res.status(400).json({
            success: false,
            message: 'Missing cartId in body'
        });
    }

    try {
        const cart = await Cart.findOne({ cartId: cartId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Database error',
            error: error.message
        });
    }
}

export async function validateCartInUrl(req, res, next) {
    const { cartId } = req.params;

    if (!cartId) {
        return res.status(400).json({
            success: false,
            message: 'Missing cartId in URL parameters'
        });
    }

    try {
        const cart = await Cart.findOne({ cartId: cartId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Database error',
            error: error.message
        });
    }
}

export function validatePromotion(req, res, next) {
    const { title, description, requiredItems, discountType, discountValue, isActive } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: 'Missing title'
        });
    }

    if (!description) {
        return res.status(400).json({
            success: false,
            message: 'Missing description'
        });
    }

    if (!requiredItems || requiredItems.length < 2) {
        return res.status(400).json({
            success: false,
            message: 'requiredItems must exist and contain atleast 2 items'
        });
    }

    if (!discountType) {
        return res.status(400).json({
            success: false,
            message: 'Missing discountType'
        });
    }

    if (!discountValue) {
        return res.status(400).json({
            success: false,
            message: 'Missing discountValue'
        });
    }

    if (isActive === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing isActive'
        });
    }

    next();
}