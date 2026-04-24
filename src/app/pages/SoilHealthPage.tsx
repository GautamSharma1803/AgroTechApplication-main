import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ArrowLeft, Droplets } from 'lucide-react';
import { soilTests } from '../utils/api';
import { toast } from 'sonner';

export default function SoilHealthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    cropType: '',
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    organicMatter: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await soilTests.create(formData);
      toast.success('Soil test saved successfully!');
      navigate('/soil-health/report', { state: { soilTest: result } });
    } catch (error: any) {
      console.error('Soil test error:', error);
      toast.error(error.message || 'Failed to save soil test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-blue-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/home')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-2xl font-bold">Soil Health Test</h1>
        </div>
        <p className="text-blue-100">Enter your soil test results</p>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location & Crop */}
          <Card className="rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Field Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Field Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., North Field"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="h-11 rounded-lg mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cropType">Crop Type</Label>
                <Input
                  id="cropType"
                  placeholder="e.g., Tomatoes"
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  className="h-11 rounded-lg mt-1"
                  required
                />
              </div>
            </div>
          </Card>

          {/* pH Level */}
          <Card className="rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">pH Level</h3>
            <div>
              <Label htmlFor="pH">pH Value (0-14)</Label>
              <Input
                id="pH"
                type="number"
                step="0.1"
                min="0"
                max="14"
                placeholder="e.g., 6.5"
                value={formData.pH}
                onChange={(e) => setFormData({ ...formData, pH: e.target.value })}
                className="h-11 rounded-lg mt-1"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                Optimal range: 6.0 - 7.0 for most crops
              </p>
            </div>
          </Card>

          {/* NPK Levels */}
          <Card className="rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              NPK Levels (ppm)
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nitrogen">Nitrogen (N)</Label>
                <Input
                  id="nitrogen"
                  type="number"
                  placeholder="e.g., 45"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  className="h-11 rounded-lg mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phosphorus">Phosphorus (P)</Label>
                <Input
                  id="phosphorus"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  className="h-11 rounded-lg mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="potassium">Potassium (K)</Label>
                <Input
                  id="potassium"
                  type="number"
                  placeholder="e.g., 120"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  className="h-11 rounded-lg mt-1"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Additional Parameters */}
          <Card className="rounded-2xl p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Additional Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="moisture">Moisture Content (%)</Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 25"
                  value={formData.moisture}
                  onChange={(e) => setFormData({ ...formData, moisture: e.target.value })}
                  className="h-11 rounded-lg mt-1"
                />
              </div>
              <div>
                <Label htmlFor="organicMatter">Organic Matter (%)</Label>
                <Input
                  id="organicMatter"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 3.5"
                  value={formData.organicMatter}
                  onChange={(e) => setFormData({ ...formData, organicMatter: e.target.value })}
                  className="h-11 rounded-lg mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Droplets className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Need a Soil Test Kit?
                </p>
                <p className="text-sm text-gray-700">
                  You can purchase affordable soil test kits from our marketplace 
                  or get professional testing from certified labs.
                </p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {loading ? 'Generating Report...' : 'Generate Report'}
          </Button>
        </form>
      </div>
    </div>
  );
}