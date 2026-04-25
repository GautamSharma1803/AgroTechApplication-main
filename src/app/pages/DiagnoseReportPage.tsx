import { useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, AlertCircle, CheckCircle, Info, Share2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function DiagnoseReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const diagnosis = location.state?.diagnosis;

  // Default data if no diagnosis passed
  const report = diagnosis || {
    disease: 'Tomato Late Blight',
    confidence: 92,
    severity: 'High',
    treatments: [
      'Remove and destroy affected leaves immediately',
      'Apply copper-based fungicide spray',
      'Improve air circulation around plants',
      'Avoid overhead watering',
      'Monitor plants daily for new symptoms'
    ],
    preventions: [
      'Plant resistant varieties',
      'Ensure proper spacing between plants',
      'Water at soil level, not on leaves',
      'Remove plant debris regularly'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1771510523730-fb4eb23fb54f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGRpc2Vhc2UlMjBsZWFmJTIwZGFtYWdlfGVufDF8fHx8MTc3NDk0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  };

  const treatments = Array.isArray(report.treatments) ? report.treatments : [
    'Remove and destroy affected leaves immediately',
    'Apply copper-based fungicide spray',
    'Improve air circulation around plants',
    'Avoid overhead watering',
    'Monitor plants daily for new symptoms'
  ];

  const preventions = Array.isArray(report.preventions) ? report.preventions : [
    'Plant resistant varieties',
    'Ensure proper spacing between plants',
    'Water at soil level, not on leaves',
    'Remove plant debris regularly'
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-green-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/diagnose')} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold">Diagnosis Report</h1>
          </div>
          <button className="text-white">
            <Share2 size={24} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Disease Card */}
        <Card className="rounded-2xl p-6 mb-6">
          <div className="mb-4">
            <ImageWithFallback
              src={report.imageUrl}
              alt="Affected plant"
              className="w-full h-48 object-cover rounded-xl"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-orange-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">
                  {report.disease}
                </h2>
              </div>
              <p className="text-gray-600">
                Detected with {report.confidence}% confidence
              </p>
            </div>

            <div className="flex gap-3">
              <div className="flex-1 bg-orange-50 border border-orange-200 rounded-xl p-3">
                <p className="text-sm text-gray-600 mb-1">Severity</p>
                <p className="font-semibold text-orange-700">{report.severity}</p>
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-sm text-gray-600 mb-1">Action Required</p>
                <p className="font-semibold text-blue-700">Immediate</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Treatment */}
        <Card className="rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Recommended Treatment
            </h3>
          </div>
          <ul className="space-y-3">
            {treatments.map((treatment, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                  {index + 1}
                </span>
                <span className="text-gray-700 text-sm">{treatment}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Prevention */}
        <Card className="rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Info className="text-blue-600" size={20} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Prevention Tips
            </h3>
          </div>
          <ul className="space-y-3">
            {preventions.map((prevention, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-blue-600 mt-0.5">•</span>
                <span className="text-gray-700 text-sm">{prevention}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Additional Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">
            Important Note
          </h3>
          <p className="text-sm text-gray-700">
            This is an AI-powered diagnosis. For severe cases or if symptoms persist, 
            please consult with a local agricultural expert or extension service.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/diagnose')}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            Scan Another Plant
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/home')}
            className="w-full h-12 border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}