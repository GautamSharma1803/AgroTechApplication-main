import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { ArrowLeft, CreditCard, Wallet, Building2, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.user_metadata?.fullName || '',
    phone: user?.user_metadata?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const [upiId, setUpiId] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bank: '',
    accountNumber: ''
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 50;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + deliveryFee + tax;

  const handlePayment = async () => {
    // Validate shipping info
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.pincode) {
      toast.error('Please fill all shipping details');
      return;
    }

    // Validate payment method details
    if (paymentMethod === 'card') {
      if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvv) {
        toast.error('Please fill all card details');
        return;
      }
      if (cardInfo.number.length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!upiId) {
        toast.error('Please enter UPI ID');
        return;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!bankDetails.bank) {
        toast.error('Please select a bank');
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order record
    const order = {
      orderId: `ORD-${Date.now()}`,
      userId: user?.id,
      userName: shippingInfo.name,
      items: cartItems,
      shippingAddress: shippingInfo,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
      status: 'pending',
      createdAt: new Date()
    };

    // Save to local storage (in production, this would go to Supabase)
    const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('user_orders', JSON.stringify(existingOrders));

    setProcessing(false);
    setPaymentSuccess(true);

    toast.success('Payment successful! Your order has been placed.');

    // Clear cart after successful payment
    clearCart();

    // Navigate to orders page after 2 seconds
    setTimeout(() => {
      navigate('/profile?tab=orders');
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex items-center justify-center p-6">
        <Card className="rounded-3xl p-12 text-center w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <Button
            onClick={() => navigate('/profile?tab=orders')}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl h-12"
          >
            View Orders
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-orange-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/cart')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Shipping Information */}
        <Card className="rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Shipping Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={shippingInfo.name}
                onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                placeholder="Enter your name"
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={shippingInfo.phone}
                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                placeholder="Enter phone number"
                className="rounded-xl"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                placeholder="Enter your address"
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  placeholder="City"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                  placeholder="State"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={shippingInfo.pincode}
                onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })}
                placeholder="Enter pincode"
                className="rounded-xl"
              />
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                  <CreditCard size={20} className="text-blue-600" />
                  <span>Credit/Debit Card</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Wallet size={20} className="text-purple-600" />
                  <span>UPI</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value="netbanking" id="netbanking" />
                <Label htmlFor="netbanking" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Building2 size={20} className="text-green-600" />
                  <span>Net Banking</span>
                </Label>
              </div>
            </div>
          </RadioGroup>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  value={cardInfo.number}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                    setCardInfo({ ...cardInfo, number: value });
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="rounded-xl"
                  maxLength={16}
                />
              </div>
              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  value={cardInfo.name}
                  onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                  placeholder="Name on card"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    value={cardInfo.expiry}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                      }
                      setCardInfo({ ...cardInfo, expiry: value });
                    }}
                    placeholder="MM/YY"
                    className="rounded-xl"
                    maxLength={5}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="password"
                    value={cardInfo.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setCardInfo({ ...cardInfo, cvv: value });
                    }}
                    placeholder="123"
                    className="rounded-xl"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Details */}
          {paymentMethod === 'upi' && (
            <div className="mt-6">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@upi"
                className="rounded-xl"
              />
            </div>
          )}

          {/* Net Banking Details */}
          {paymentMethod === 'netbanking' && (
            <div className="mt-6">
              <Label htmlFor="bank">Select Bank</Label>
              <select
                id="bank"
                value={bankDetails.bank}
                onChange={(e) => setBankDetails({ ...bankDetails, bank: e.target.value })}
                className="w-full h-12 rounded-xl border border-gray-300 px-4 bg-white"
              >
                <option value="">Select your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
              </select>
            </div>
          )}
        </Card>

        {/* Order Summary */}
        <Card className="rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (5%)</span>
              <span>₹{tax}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={processing}
          className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-lg"
        >
          {processing ? 'Processing...' : `Pay ₹${total}`}
        </Button>
      </div>
    </div>
  );
}
