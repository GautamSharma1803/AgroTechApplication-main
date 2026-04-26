import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowLeft, Camera, Upload, Image as ImageIcon, X, AlertTriangle } from 'lucide-react';
import { diagnosis as diagnosisApi, upload as uploadApi } from '../utils/api';
import { toast } from 'sonner';

export default function DiagnosePage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageData = reader.result as string;
        setSelectedImage(imageData);
        // Automatically start analysis when image is uploaded
        await handleAnalyze(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (imageData?: string) => {
    const imageToAnalyze = imageData || selectedImage;
    if (!imageToAnalyze) return;

    setAnalyzing(true);
    try {
      // STEP 1: Validate if the image contains a plant
      toast.info('Validating image...');
      const validation = await diagnosisApi.validatePlant(imageToAnalyze);
      
      // Mock validation logic for demo (will use real AI when backend is connected)
      // This simulates detecting if image is a plant
      const isValidPlant = await mockPlantValidation(imageToAnalyze);
      
      if (!isValidPlant) {
        toast.error('❌ This doesn\'t appear to be a plant image!', {
          description: 'Please upload a clear photo of a plant, leaf, stem, or crop for disease detection.',
          duration: 5000,
        });
        setAnalyzing(false);
        return;
      }

      // STEP 2: Upload image
      toast.info('Uploading image...');
      const imageUrl = await uploadApi.image(imageToAnalyze, 'diagnosis');

      // STEP 3: Analyze the image with AI
      toast.info('AI is analyzing your plant...');
      const result = await diagnosisApi.analyze(imageToAnalyze);

      toast.success('Analysis complete!');
      // Navigate to report with the diagnosis data
      navigate('/diagnose/report', { state: { diagnosis: result } });
    } catch (error: any) {
      console.error('Diagnosis error:', error);

      // Create mock diagnosis result for demo
      const mockDiagnosis = {
        plantName: 'Tomato Plant',
        disease: 'Early Blight',
        confidence: 87.5,
        severity: 'moderate',
        description: 'Early blight is a common fungal disease affecting tomato plants, characterized by dark spots on leaves.',
        symptoms: [
          'Dark brown spots with concentric rings on lower leaves',
          'Yellowing of affected leaves',
          'Premature leaf drop'
        ],
        treatment: [
          'Remove and destroy infected leaves',
          'Apply copper-based fungicide',
          'Improve air circulation around plants',
          'Avoid overhead watering'
        ],
        prevention: [
          'Use disease-resistant varieties',
          'Practice crop rotation',
          'Mulch around plants to prevent soil splash',
          'Water at the base of plants'
        ],
        imageUrl: imageToAnalyze
      };

      toast.info('Backend not connected. Showing demo AI analysis.');
      navigate('/diagnose/report', { state: { diagnosis: mockDiagnosis } });
    } finally {
      setAnalyzing(false);
    }
  };

  // Mock plant validation function (simulates AI detection)
  const mockPlantValidation = async (imageData: string): Promise<boolean> => {
    // This is a simulation. In production, this would call real AI API
    // For demo purposes, we'll do a simple check based on image characteristics
    
    // You can enhance this with actual image analysis libraries or AI APIs
    // For now, we'll simulate a validation that passes most of the time
    // but could reject based on certain patterns
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real implementation, this would use computer vision to detect:
        // - Green colors (chlorophyll)
        // - Plant-like textures
        // - Leaf/stem structures
        // For demo, we'll accept all images but you can add logic here
        resolve(true);
      }, 500);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-green-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/home')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-2xl font-bold">Plant Diagnosis</h1>
        </div>
        <p className="text-green-100">Upload a photo to detect plant diseases</p>
      </div>

      <div className="p-6">
        {/* Upload Area */}
        {!selectedImage ? (
          <Card className="rounded-2xl p-8 mb-6">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Camera className="text-green-600" size={40} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Take or Upload Photo
                </h2>
                <p className="text-gray-600">
                  Capture a clear image of the affected plant part
                </p>
              </div>

              <div className="space-y-3">
                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="camera-input">
                  <div className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors font-medium">
                    <Camera className="mr-2" size={20} />
                    Take Photo
                  </div>
                </label>

                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="file-input">
                  <div className="w-full h-12 border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl flex items-center justify-center cursor-pointer transition-colors font-medium">
                    <Upload className="mr-2" size={20} />
                    Upload from Gallery
                  </div>
                </label>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="rounded-2xl p-6 mb-6">
            <div className="relative mb-4">
              <img
                src={selectedImage}
                alt="Selected plant"
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <Button
              onClick={() => handleAnalyze()}
              disabled={analyzing}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              {analyzing ? 'AI Analyzing...' : 'Re-analyze Plant'}
            </Button>
          </Card>
        )}

        {/* Tips */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Tips for Better Results
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Ensure good lighting when taking photos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Focus on the affected area of the plant</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Take multiple photos from different angles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>Include leaves, stems, or fruits showing symptoms</span>
            </li>
          </ul>
        </div>

        {/* Recent Scans */}
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Scans</h3>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                onClick={() => navigate('/diagnose/report')}
                className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center cursor-pointer hover:opacity-80"
              >
                <ImageIcon className="text-gray-400" size={24} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}