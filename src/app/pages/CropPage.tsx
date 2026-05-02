import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ArrowLeft, Plus, Calendar, Droplets, TrendingUp, AlertCircle, X, Upload, Camera, Loader2, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { crops as cropsApi, cropDetection } from '../utils/api';
import { toast } from 'sonner';

export default function CropPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [crops, setCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCrop, setNewCrop] = useState({
    name: '',
    variety: '',
    planted: '',
    harvest: '',
    health: 'good',
    image: '',
    tasks: [] as string[]
  });
  const [detecting, setDetecting] = useState(false);
  const [cropImagePreview, setCropImagePreview] = useState<string | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState<any | null>(null);

  // Demo crop images mapping
  const getCropDemoImage = (cropName: string): string => {
    const cropImageMap: Record<string, string> = {
      'tomato': 'https://images.unsplash.com/photo-1748432171507-c1d62fe2e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjBwbGFudCUyMGdyb3dpbmd8ZW58MXx8fHwxNzc0ODQ5OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'wheat': 'https://images.unsplash.com/photo-1627842822558-c1f15aef9838?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGZpZWxkJTIwZ29sZGVuJTIwaGFydmVzdHxlbnwxfHx8fDE3NzQ5NDMyMTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'corn': 'https://images.unsplash.com/photo-1769258958976-8852440011b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBjcm9wcyUyMHZlZ2V0YWJsZXN8ZW58MXx8fHwxNzc0OTQzMjE0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'rice': 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'carrot': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'cucumber': 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      'default': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
    };

    const cropNameLower = cropName.toLowerCase();
    for (const [key, image] of Object.entries(cropImageMap)) {
      if (cropNameLower.includes(key)) {
        return image;
      }
    }
    return cropImageMap.default;
  };


  useEffect(() => {
    loadCrops();
  }, []);

  async function loadCrops() {
    try {
      const data = await cropsApi.getAll();
      setCrops(data || []);
    } catch (error: any) {
      console.error('Failed to load crops:', error);
      toast.error('Failed to connect to backend. Please check your connection.');
      setCrops([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddCrop() {
    if (!newCrop.name || !newCrop.variety) {
      toast.error('Please fill in crop name and variety');
      return;
    }

    try {
      // If no image provided, use demo image based on crop name
      const finalCrop = {
        ...newCrop,
        image: cropImagePreview || newCrop.image || getCropDemoImage(newCrop.name)
      };

      const crop = await cropsApi.create(finalCrop);
      setCrops([...crops, crop]);
      toast.success('Crop added successfully!');
      resetCropForm();
    } catch (error: any) {
      console.error('Failed to add crop:', error);
      toast.error('Backend not connected. Deploy Edge Function to add crops.');
      const demoCrop = {
        id: Date.now(),
        ...newCrop,
        image: cropImagePreview || newCrop.image || getCropDemoImage(newCrop.name)
      };
      setCrops([...crops, demoCrop]);
      toast.info('Added as demo crop (not saved to database)');
      resetCropForm();
    }
  }

  function resetCropForm() {
    setShowAddModal(false);
    setNewCrop({
      name: '',
      variety: '',
      planted: '',
      harvest: '',
      health: 'good',
      image: '',
      tasks: []
    });
    setCropImagePreview(null);
  }

  async function handleCropImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const imageData = reader.result as string;
      setCropImagePreview(imageData);

      setDetecting(true);
      toast.info('🤖 AI is validating your image...');

      try {
        // First, validate if it's actually a plant
        const validation = await diagnosis.validatePlant(imageData);

        if (!validation.isPlant || validation.confidence < 50) {
          toast.error('❌ Not a plant detected! Please upload a clear image of a crop or plant.');
          setCropImagePreview(null);
          setDetecting(false);
          // Reset file input
          e.target.value = '';
          return;
        }

        // If it's a plant, proceed with crop detection
        toast.info('🌱 Plant detected! Identifying crop type...');

        const cropInfo = await cropDetection.detectCrop(imageData);

        setNewCrop({
          ...newCrop,
          name: cropInfo.cropType || newCrop.name,
          variety: cropInfo.variety || newCrop.variety,
          planted: cropInfo.plantedDaysAgo ? `${cropInfo.plantedDaysAgo} days ago` : newCrop.planted,
          harvest: cropInfo.harvestDays ? `${cropInfo.harvestDays} days` : newCrop.harvest,
          health: cropInfo.health || newCrop.health,
          image: imageData,
          tasks: cropInfo.tasks || newCrop.tasks
        });

        toast.success(`✅ Crop Identified: ${cropInfo.cropType}! (${cropInfo.confidence}% confidence)`);
      } catch (error: any) {
        console.error('Crop detection error:', error);

        // Check if it's a "not a plant" error
        if (error.message && error.message.includes('Not a plant')) {
          toast.error('❌ Not a plant detected! Please upload a clear image of a crop or plant.');
          setCropImagePreview(null);
          setDetecting(false);
          e.target.value = '';
          return;
        }

        // If backend is not available, just keep the image without auto-detection
        toast.warning('⚠️ AI detection unavailable. Please manually enter crop details.');
        setNewCrop({
          ...newCrop,
          image: imageData
        });
      } finally {
        setDetecting(false);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleRemoveCrop(cropId: number) {
    try {
      await cropsApi.delete(cropId.toString());
      setCrops(crops.filter(c => c.id !== cropId));
      toast.success('Crop removed successfully!');
      setShowDetailsModal(false);
      setSelectedCrop(null);
    } catch (error: any) {
      console.error('Failed to remove crop:', error);
      // Remove from local state even if backend fails
      setCrops(crops.filter(c => c.id !== cropId));
      toast.info('Crop removed locally (backend not connected)');
      setShowDetailsModal(false);
      setSelectedCrop(null);
    }
  }

  const stats = {
    totalCrops: crops.length,
    activeFields: crops.filter((c: any) => c.health !== 'warning').length,
    harvestSoon: crops.filter((c: any) => c.harvest && parseInt(c.harvest) < 30).length
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
      <div className="bg-emerald-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold">My Crops</h1>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
          >
            <Plus className="text-white" size={24} />
          </button>
        </div>

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

        <div className="space-y-4">
          {crops.length === 0 ? (
            <Card className="rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-emerald-600" size={32} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">No Crops Added Yet</h3>
              <p className="text-gray-600 mb-4">
                Start tracking your crops to monitor their health and manage your farm better
              </p>
              <Button
                onClick={() => setShowAddModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-11 px-6"
              >
                Add Your First Crop
              </Button>
            </Card>
          ) : (
            crops
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
                      {crop.tasks.map((task: string, idx: number) => (
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
                    onClick={() => {
                      setSelectedCrop(crop);
                      setShowDetailsModal(true);
                    }}
                    variant="outline"
                    className="w-full mt-4 h-10 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {crops.length > 0 && (
          <Card 
          onClick={() => setShowAddModal(true)}
          className="rounded-2xl p-8 mt-4 border-2 border-dashed border-gray-300 cursor-pointer hover:border-emerald-600 hover:bg-emerald-50/50 transition-colors"
        >
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
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Crop</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Crop Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Tomatoes"
                  value={newCrop.name}
                  onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variety *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Cherry"
                  value={newCrop.variety}
                  onChange={(e) => setNewCrop({ ...newCrop, variety: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Planted (optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 15 days ago"
                  value={newCrop.planted}
                  onChange={(e) => setNewCrop({ ...newCrop, planted: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Harvest In (optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 45 days"
                  value={newCrop.harvest}
                  onChange={(e) => setNewCrop({ ...newCrop, harvest: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Health Status
                </label>
                <select
                  value={newCrop.health}
                  onChange={(e) => setNewCrop({ ...newCrop, health: e.target.value })}
                  className="w-full h-9 rounded-md border border-gray-300 px-3 py-1 text-base bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/50 outline-none"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="warning">Needs Attention</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📸 Upload Crop Photo (AI Auto-Detection)
                </label>
                <div className="space-y-3">
                  {!cropImagePreview ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-emerald-500 transition-colors">
                      <input
                        id="crop-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCropImageUpload}
                        className="hidden"
                        disabled={detecting}
                      />
                      <label
                        htmlFor="crop-image-upload"
                        className="cursor-pointer"
                      >
                        {detecting ? (
                          <div className="space-y-3">
                            <Loader2 className="mx-auto text-emerald-600 animate-spin" size={40} />
                            <p className="text-sm text-gray-600">AI is analyzing...</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Camera className="mx-auto text-gray-400" size={40} />
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                Upload Crop Photo
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                AI will auto-detect variety, health & harvest time
                              </p>
                            </div>
                          </div>
                        )}
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={cropImagePreview}
                        alt="Crop preview"
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => setCropImagePreview(null)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
                      >
                        <X size={16} className="text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <Input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={newCrop.image}
                  onChange={(e) => setNewCrop({ ...newCrop, image: e.target.value })}
                />
              </div>
            </div>
            <Button
              onClick={handleAddCrop}
              disabled={detecting}
              className="w-full mt-6 h-11 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {detecting ? 'AI Detecting...' : 'Add Crop'}
            </Button>
          </div>
        </div>
      )}

      {/* Crop Details Modal */}
      {showDetailsModal && selectedCrop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Crop Image */}
            <div className="relative h-48">
              <ImageWithFallback
                src={selectedCrop.image}
                alt={selectedCrop.name}
                className="w-full h-full object-cover rounded-t-2xl"
              />
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCrop(null);
                }}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100"
              >
                <X size={20} className="text-gray-600" />
              </button>
              <div
                className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedCrop.health === 'excellent'
                    ? 'bg-green-500 text-white'
                    : selectedCrop.health === 'good'
                    ? 'bg-blue-500 text-white'
                    : 'bg-orange-500 text-white'
                }`}
              >
                {selectedCrop.health === 'excellent'
                  ? 'Excellent Health'
                  : selectedCrop.health === 'good'
                  ? 'Good Health'
                  : 'Needs Attention'}
              </div>
            </div>

            {/* Crop Details */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedCrop.name}
              </h2>
              <p className="text-lg text-gray-600 mb-6">{selectedCrop.variety}</p>

              {/* Details Grid */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Planted</p>
                    <p className="text-base text-gray-900">{selectedCrop.planted}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <TrendingUp className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Harvest In</p>
                    <p className="text-base text-gray-900">{selectedCrop.harvest}</p>
                  </div>
                </div>

                {selectedCrop.tasks && selectedCrop.tasks.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Today's Tasks</p>
                    <div className="space-y-2">
                      {selectedCrop.tasks.map((task: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2">
                          {selectedCrop.health === 'warning' && idx === 0 ? (
                            <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={16} />
                          ) : (
                            <Droplets className="text-blue-600 flex-shrink-0 mt-0.5" size={16} />
                          )}
                          <span className="text-sm text-gray-700">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowDetailsModal(false);
                    navigate('/diagnose');
                  }}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                >
                  Diagnose Health
                </Button>
                <Button
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove ${selectedCrop.name}?`)) {
                      handleRemoveCrop(selectedCrop.id);
                    }
                  }}
                  variant="outline"
                  className="h-11 px-4 border-red-300 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
