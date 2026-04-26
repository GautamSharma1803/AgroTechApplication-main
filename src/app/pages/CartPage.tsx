import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 50;
  const grandTotal = total + deliveryFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    toast.success('Order placed successfully! Thank you for your purchase.');
    clearCart();
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-40">
      {/* Header */}
      <div className="bg-orange-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/market')} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold">Shopping Cart</h1>
          </div>
          {cartItems.length > 0 && (
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{cartItems.length}</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {cartItems.length === 0 ? (
          <Card className="rounded-2xl p-12 text-center">
            <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Browse products and add items to your cart
            </p>
            <Button
              onClick={() => navigate('/market')}
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl"
            >
              Browse Products
            </Button>
          </Card>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <Card key={item.id} className="rounded-2xl overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.seller}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              removeFromCart(item.id);
                              toast.success('Item removed from cart');
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white rounded-lg transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-sm font-semibold text-gray-900 min-w-[2ch] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-white rounded-lg transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-orange-600">
                              ₹{item.price * item.quantity}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{item.price}/{item.unit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <Card className="rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-orange-600">
                  ₹{grandTotal}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold"
              >
                Proceed to Checkout
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
