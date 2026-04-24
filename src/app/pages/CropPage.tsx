import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Plus, Calendar, Droplets, TrendingUp, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { crops as cropsApi } from '../utils/api';
import { toast } from 'sonner';

export default function CropPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrops();
  }, []);

  async function loadCrops() {
    try {
      const data = await cropsApi.getAll();
      setCrops(data);
    } catch (error: any) {
      console.error('Failed to load crops:', error);
      toast.error('Failed to load crops');
      // Use mock data as fallback
      setCrops(mockCrops);
    } finally {
      setLoading(false);
    }
  }

  const mockCrops = [
    {
      id: 1,
      name: 'Tomatoes',
      variety: 'Cherry',
      planted: '15 days ago',
      harvest: '45 days',
      health: 'excellent',
      image: 'https://images.unsplash.com/photo-1748432171507-c1d62fe2e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGdyb3dpbmd8ZW58MXx8fHwxNzc0ODQ5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tasks: ['Water today', 'Check for pests']
    },
    {
      id: 2,
      name: 'Wheat',
      variety: 'Winter Wheat',
      planted: '30 days ago',
      harvest: '90 days',
      health: 'good',
      image: 'https://images.unsplash.com/photo-1627842822558-c1f15aef9838?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwZ29sZGVuJTIwaGFydmVzdHxlbnwxfHx8fDE3NzQ5NDMyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tasks: ['Apply fertilizer']
    },
    {
      id: 3,
      name: 'Corn',
      variety: 'Sweet Corn',
      planted: '20 days ago',
      harvest: '70 days',
      health: 'warning',
      image: 'https://images.unsplash.com/photo-1769258958976-8852440011b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBjcm9wcyUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzc0OTQzMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tasks: ['Disease detected', 'Increase watering']
    }
  ];

  const displayCrops = crops.length > 0 ? crops : mockCrops;

  const stats = {
    totalCrops: displayCrops.length,
    activeFields: displayCrops.filter((c: any) => c.health !== 'warning').length,
    harvestSoon: 1
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex items-center justify-center">
        <p className="text-gray-600">Loading crops...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-emerald-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold">My Crops</h1>
          </div>
          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Plus className="text-white" size={24} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{stats.totalCrops}</p>
            <p className="text-xs text-emerald-100">Total Crops</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{stats.activeFields}</p>
            <p className="text-xs text-emerald-100">Active Fields</p>
          </div>
          <div className="bg-white/20 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-white">{stats.harvestSoon}</p>
            <p className="text-xs text-emerald-100">Harvest Soon</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['all', 'excellent', 'good', 'warning'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Crop Cards */}
        <div className="space-y-4">
          {displayCrops
            .filter((crop) => filter === 'all' || crop.health === filter)
            .map((crop) => (
              <Card key={crop.id} className="rounded-2xl overflow-hidden">
                <div className="relative h-40">
                  <ImageWithFallback
                    src={crop.image}
                    alt={crop.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
                      crop.health === 'excellent'
                        ? 'bg-green-500 text-white'
                        : crop.health === 'good'
                        ? 'bg-blue-500 text-white'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {crop.health === 'excellent'
                      ? 'Excellent'
                      : crop.health === 'good'
                      ? 'Good'
                      : 'Needs Attention'}
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {crop.name}
                    </h3>
                    <p className="text-sm text-gray-600">{crop.variety}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-gray-400" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Planted</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {crop.planted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="text-gray-400" size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Harvest in</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {crop.harvest}
                        </p>
                      </div>
                    </div>
                  </div>

                  {crop.tasks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">
                        Today's Tasks:
                      </p>
                      {crop.tasks.map((task, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          {crop.health === 'warning' && idx === 0 ? (
                            <AlertCircle
                              className="text-orange-600 flex-shrink-0"
                              size={16}
                            />
                          ) : (
                            <Droplets
                              className="text-blue-600 flex-shrink-0"
                              size={16}
                            />
                          )}
                          <span className="text-gray-700">{task}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => navigate('/diagnose')}
                    variant="outline"
                    className="w-full mt-4 h-10 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
        </div>

        {/* Add Crop Card */}
        <Card className="rounded-2xl p-8 mt-4 border-2 border-dashed border-gray-300 cursor-pointer hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors">
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="text-emerald-600" size={32} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Add New Crop</h3>
            <p className="text-sm text-gray-600">
              Track another crop in your farm
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}