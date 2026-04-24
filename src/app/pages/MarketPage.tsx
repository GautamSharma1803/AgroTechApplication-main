import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ShoppingCart, 
  TrendingUp,
  MapPin,
  Star
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { market } from '../utils/api';
import { toast } from 'sonner';

export default function MarketPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketData();
  }, [activeTab]);

  async function loadMarketData() {
    setLoading(true);
    try {
      if (activeTab === 'buy') {
        const data = await market.getProducts(searchQuery);
        if (data.length === 0) {
          // Use mock data if no products found
          setProducts(mockProducts);
        } else {
          setProducts(data);
        }
      } else {
        const data = await market.getMyListings();
        setMyListings(data);
      }
    } catch (error: any) {
      console.error('Failed to load market data:', error);
      toast.error('Failed to load products');
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  }

  const mockProducts = [
    {
      id: 1,
      name: 'Fresh Tomatoes',
      price: 45,
      unit: 'kg',
      seller: 'Green Valley Farms',
      sellerName: 'Green Valley Farms',
      location: 'California',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1748432171507-c1d62fe2e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGdyb3dpbmd8ZW58MXx8fHwxNzc0ODQ5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'In Stock'
    },
    {
      id: 2,
      name: 'Organic Wheat',
      price: 30,
      unit: 'kg',
      seller: 'Sunrise Agriculture',
      sellerName: 'Sunrise Agriculture',
      location: 'Texas',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1627842822558-c1f15aef9838?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwZ29sZGVuJTIwaGFydmVzdHxlbnwxfHx8fDE3NzQ5NDMyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'In Stock'
    },
    {
      id: 3,
      name: 'Sweet Corn',
      price: 35,
      unit: 'kg',
      seller: 'Harvest Moon Farm',
      sellerName: 'Harvest Moon Farm',
      location: 'Iowa',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1769258958976-8852440011b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBjcm9wcyUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzc0OTQzMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'Limited'
    },
    {
      id: 4,
      name: 'Fresh Vegetables Mix',
      price: 55,
      unit: 'kg',
      seller: 'Valley Fresh Produce',
      sellerName: 'Valley Fresh Produce',
      location: 'Oregon',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1599275247787-40daab5777bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBtYXJrZXQlMjBmcmVzaCUyMHByb2R1Y2V8ZW58MXx8fHwxNzc0OTQzMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 'In Stock'
    }
  ];

  const displayProducts = products.length > 0 ? products : mockProducts;

  const priceAlerts = [
    { product: 'Tomatoes', change: '+5%', trend: 'up' },
    { product: 'Wheat', change: '-2%', trend: 'down' },
    { product: 'Corn', change: '+3%', trend: 'up' }
  ];

  const handleSearch = () => {
    loadMarketData();
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-orange-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold">Marketplace</h1>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <ShoppingCart className="text-white" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white/20 rounded-xl p-1 flex gap-1 mb-4">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'buy'
                ? 'bg-white text-orange-600'
                : 'text-white'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'sell'
                ? 'bg-white text-orange-600'
                : 'text-white'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-12 rounded-xl bg-white/95 text-gray-900"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" onClick={handleSearch}>
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'buy' ? (
          <>
            {/* Price Alerts */}
            <Card className="rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Price Alerts</h3>
                <TrendingUp className="text-gray-400" size={20} />
              </div>
              <div className="space-y-2">
                {priceAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-gray-700">{alert.product}</span>
                    <span
                      className={`text-sm font-semibold ${
                        alert.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {alert.change}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Products Grid */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Available Products
                </h2>
                <span className="text-sm text-gray-600">
                  {displayProducts.length} items
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {displayProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-32">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                        {product.stock}
                      </div>
                    </div>

                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="text-yellow-500 fill-yellow-500" size={12} />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                        <MapPin size={12} />
                        {product.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-orange-600">
                            ${product.price}
                          </p>
                          <p className="text-xs text-gray-500">per {product.unit}</p>
                        </div>
                        <Button
                          size="sm"
                          className="h-8 px-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs"
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Sell Tab */
          <div className="space-y-6">
            <Card className="rounded-2xl p-8 text-center border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                List Your Products
              </h3>
              <p className="text-gray-600 mb-4">
                Reach thousands of buyers and get the best prices for your produce
              </p>
              <Button className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white rounded-xl">
                Create Listing
              </Button>
            </Card>

            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Your Active Listings</h3>
              <div className="space-y-3">
                <Card className="rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Fresh Lettuce</p>
                      <p className="text-sm text-gray-600">$25/kg • 50kg available</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">5 offers</p>
                    </div>
                  </div>
                </Card>

                <Card className="rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Carrots</p>
                      <p className="text-sm text-gray-600">$20/kg • 30kg available</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">3 offers</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}