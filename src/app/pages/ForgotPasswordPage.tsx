import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Leaf, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset - in production, this would send reset email
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="bg-green-600 rounded-b-[3rem] p-8 pb-16 relative">
        <button
          onClick={() => navigate('/login')}
          className="absolute left-8 top-8 text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center justify-center mb-4 mt-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Leaf className="text-green-600" size={32} />
          </div>
        </div>
        <h1 className="text-white text-3xl font-bold text-center">AgroTech</h1>
        <p className="text-green-100 text-center mt-2">Smart Farming Solutions</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 px-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-gray-600 mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl border-gray-300"
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl"
                >
                  Send Reset Link
                </Button>

                {/* Back to Login */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-green-600 font-semibold hover:text-green-700"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="text-green-600" size={40} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
              <p className="text-gray-600">
                We've sent a password reset link to <span className="font-semibold">{email}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
