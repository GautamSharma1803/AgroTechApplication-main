import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Share2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function SoilHealthReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const soilTest = location.state?.soilTest;

  const overallScore = soilTest?.score || 75;
  const fieldLocation = soilTest?.location || 'North Field';
  const cropType = soilTest?.cropType || 'Tomatoes';

  const pH = parseFloat(soilTest?.pH || '6.5');
  const nitrogen = parseFloat(soilTest?.nitrogen || '45');
  const phosphorus = parseFloat(soilTest?.phosphorus || '25');
  const potassium = parseFloat(soilTest?.potassium || '120');
  const moisture = parseFloat(soilTest?.moisture || '25');
  const organicMatter = parseFloat(soilTest?.organicMatter || '3.5');

  const parameters = [
    { 
      name: 'pH Level', 
      value: pH.toFixed(1), 
      status: pH >= 6.0 && pH <= 7.0 ? 'good' : 'warning', 
      icon: Minus, 
      target: '6.0-7.0' 
    },
    { 
      name: 'Nitrogen (N)', 
      value: `${nitrogen} ppm`, 
      status: nitrogen >= 40 && nitrogen <= 60 ? 'good' : 'low', 
      icon: nitrogen >= 40 ? TrendingUp : TrendingDown, 
      target: '40-60 ppm' 
    },
    { 
      name: 'Phosphorus (P)', 
      value: `${phosphorus} ppm`, 
      status: phosphorus >= 30 && phosphorus <= 50 ? 'good' : 'low', 
      icon: phosphorus >= 30 ? TrendingUp : TrendingDown, 
      target: '30-50 ppm' 
    },
    { 
      name: 'Potassium (K)', 
      value: `${potassium} ppm`, 
      status: potassium >= 100 && potassium <= 150 ? 'good' : 'low', 
      icon: potassium >= 100 ? TrendingUp : TrendingDown, 
      target: '100-150 ppm' 
    },
    { 
      name: 'Moisture', 
      value: `${moisture}%`, 
      status: moisture >= 20 && moisture <= 30 ? 'good' : 'warning', 
      icon: moisture >= 20 ? TrendingUp : TrendingDown, 
      target: '20-30%' 
    },
    { 
      name: 'Organic Matter', 
      value: `${organicMatter}%`, 
      status: organicMatter >= 3 && organicMatter <= 5 ? 'good' : 'low', 
      icon: organicMatter >= 3 ? TrendingUp : TrendingDown, 
      target: '3-5%' 
    }
  ];

  const recommendations = soilTest?.recommendations || [
    {
      title: 'Add Phosphorus',
      description: 'Apply bone meal or rock phosphate to increase phosphorus levels',
      priority: 'high'
    },
    {
      title: 'Maintain pH',
      description: 'Current pH is optimal, continue regular monitoring',
      priority: 'medium'
    },
    {
      title: 'Organic Matter',
      description: 'Add compost to maintain good organic matter levels',
      priority: 'low'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-blue-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/soil-health')} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold">Soil Health Report</h1>
          </div>
          <button className="text-white">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Overall Score */}
        <Card className="rounded-2xl p-6 mb-6 text-center">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1756946349540-78a69bc3588a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwdGV4dHVyZSUyMGJyb3dufGVufDF8fHx8MTc3NDk0MzIxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Soil"
            className="w-full h-32 object-cover rounded-xl mb-4"
          />
          <div className="mb-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallScore / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <p className="text-4xl font-bold text-gray-900">{overallScore}</p>
                  <p className="text-sm text-gray-600">Score</p>
                </div>
              </div>
            </div>
          </div>
          <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            {overallScore >= 80 ? 'Excellent Health' : overallScore >= 60 ? 'Good Health' : 'Needs Improvement'}
          </div>
          <p className="text-gray-600 mt-3">{fieldLocation} - {cropType}</p>
        </Card>

        {/* Parameters */}
        <Card className="rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Soil Parameters</h3>
          <div className="space-y-4">
            {parameters.map((param, index) => {
              const Icon = param.icon;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        param.status === 'good'
                          ? 'bg-green-100'
                          : param.status === 'low'
                          ? 'bg-orange-100'
                          : 'bg-blue-100'
                      }`}
                    >
                      <Icon
                        className={
                          param.status === 'good'
                            ? 'text-green-600'
                            : param.status === 'low'
                            ? 'text-orange-600'
                            : 'text-blue-600'
                        }
                        size={20}
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{param.name}</p>
                      <p className="text-sm text-gray-500">Target: {param.target}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{param.value}</p>
                    <p
                      className={`text-xs ${
                        param.status === 'good'
                          ? 'text-green-600'
                          : param.status === 'low'
                          ? 'text-orange-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {param.status === 'good' ? 'Optimal' : param.status === 'low' ? 'Low' : 'Normal'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  rec.priority === 'high'
                    ? 'bg-orange-50 border-orange-200'
                    : rec.priority === 'medium'
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-900">{rec.title}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      rec.priority === 'high'
                        ? 'bg-orange-200 text-orange-700'
                        : rec.priority === 'medium'
                        ? 'bg-blue-200 text-blue-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{rec.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/market')}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            Buy Recommended Products
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/home')}
            className="w-full h-12 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}