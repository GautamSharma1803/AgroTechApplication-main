import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { ChevronRight, Leaf, Sprout, TrendingUp } from 'lucide-react';

const onboardingScreens = [
  {
    id: 0,
    title: "Welcome to AgroTech",
    description: "Your smart farming companion for better crops and healthier soil",
    icon: Leaf,
    color: "text-green-600"
  },
  {
    id: 1,
    title: "Plant Disease Detection",
    description: "Instantly diagnose plant diseases using AI-powered image recognition",
    icon: Sprout,
    color: "text-emerald-600"
  },
  {
    id: 2,
    title: "Soil Health Monitoring",
    description: "Track and analyze your soil health for optimal crop growth",
    icon: TrendingUp,
    color: "text-lime-600"
  },
  {
    id: 3,
    title: "Crop Management",
    description: "Manage your crops efficiently with data-driven insights",
    icon: Leaf,
    color: "text-green-700"
  },
  {
    id: 4,
    title: "Market Access",
    description: "Connect with buyers and sell your produce at the best prices",
    icon: TrendingUp,
    color: "text-teal-600"
  },
  {
    id: 5,
    title: "Weather Forecast",
    description: "Get accurate weather updates to plan your farming activities",
    icon: Sprout,
    color: "text-blue-600"
  },
  {
    id: 6,
    title: "Expert Advice",
    description: "Access agricultural experts for personalized recommendations",
    icon: Leaf,
    color: "text-green-600"
  },
  {
    id: 7,
    title: "Yield Prediction",
    description: "Predict your crop yield with advanced analytics",
    icon: TrendingUp,
    color: "text-orange-600"
  },
  {
    id: 8,
    title: "Resource Management",
    description: "Optimize water, fertilizer, and pesticide usage",
    icon: Sprout,
    color: "text-cyan-600"
  },
  {
    id: 9,
    title: "Community Support",
    description: "Join a community of farmers and share knowledge",
    icon: Leaf,
    color: "text-green-500"
  },
  {
    id: 10,
    title: "Price Tracking",
    description: "Monitor market prices for better selling decisions",
    icon: TrendingUp,
    color: "text-purple-600"
  },
  {
    id: 11,
    title: "Farm Analytics",
    description: "Visualize your farm's performance with detailed reports",
    icon: Sprout,
    color: "text-indigo-600"
  },
  {
    id: 12,
    title: "Smart Alerts",
    description: "Receive timely notifications about important farm events",
    icon: Leaf,
    color: "text-amber-600"
  },
  {
    id: 13,
    title: "Get Started",
    description: "Begin your journey to smarter, more profitable farming today",
    icon: TrendingUp,
    color: "text-green-600"
  }
];

export default function OnboardingPage() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentScreen < onboardingScreens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      navigate('/login');
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  const screen = onboardingScreens[currentScreen];
  const Icon = screen.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-between p-8 max-w-md mx-auto">
      {/* Skip Button */}
      <div className="w-full flex justify-end">
        <button 
          onClick={handleSkip}
          className="text-gray-500 text-sm hover:text-gray-700"
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
        <div className={`w-32 h-32 rounded-full bg-green-100 flex items-center justify-center ${screen.color}`}>
          <Icon size={64} strokeWidth={1.5} />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{screen.title}</h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-sm">
            {screen.description}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full space-y-6">
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2">
          {onboardingScreens.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentScreen
                  ? 'w-8 bg-green-600'
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-full"
        >
          {currentScreen === onboardingScreens.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
}
