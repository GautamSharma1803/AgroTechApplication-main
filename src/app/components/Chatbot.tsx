import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Leaf, Minimize2 } from 'lucide-react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hello! I'm your AgriSmart assistant. I can help you with:\n\n🌱 Plant disease diagnosis\n💧 Soil health monitoring\n🌾 Crop management tips\n📊 Market price information\n🌤️ Weather forecasts\n\nHow can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Disease-related queries
    if (lowerMessage.includes('disease') || lowerMessage.includes('sick') || lowerMessage.includes('problem') || lowerMessage.includes('spots')) {
      return "🔍 I can help diagnose plant diseases! Please:\n\n1. Go to the 'Diagnose' section\n2. Take a clear photo of the affected plant part\n3. Upload the image for AI analysis\n\nI'll analyze it and provide:\n✓ Disease identification\n✓ Confidence level\n✓ Treatment recommendations\n✓ Prevention tips\n\nWould you like me to guide you through the process?";
    }

    // Soil health queries
    if (lowerMessage.includes('soil') || lowerMessage.includes('ph') || lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrients')) {
      return "💧 Soil health is crucial for crop success! Here's what I can help with:\n\n📊 Soil Testing:\n• NPK levels analysis\n• pH monitoring\n• Moisture content\n• Organic matter percentage\n\n💡 Recommendations:\n• Optimal fertilizer types\n• Application timing\n• Improvement strategies\n\nVisit the 'Soil Health' section to run a comprehensive test!";
    }

    // Crop management queries
    if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow') || lowerMessage.includes('harvest')) {
      return "🌾 Let me help with crop management:\n\n📅 Key Activities:\n• Track planting dates\n• Monitor growth stages\n• Schedule watering\n• Plan harvest timing\n\n💡 Best Practices:\n• Crop rotation strategies\n• Spacing guidelines\n• Companion planting\n• Pest management\n\nCheck 'My Crops' to manage your fields effectively!";
    }

    // Market and pricing queries
    if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('sell') || lowerMessage.includes('buy')) {
      return "📊 Market Information:\n\n💰 Current Trends:\n• Tomatoes: ₹45/kg (+5%)\n• Wheat: ₹30/kg (-2%)\n• Corn: ₹35/kg (+3%)\n\n🛒 Marketplace Features:\n• Buy fresh produce\n• List your products\n• Track price trends\n• Connect with buyers/sellers\n\nVisit the 'Market' section to explore opportunities!";
    }

    // Weather queries
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature') || lowerMessage.includes('forecast')) {
      return "🌤️ Weather is important for farming! I can provide:\n\n📊 Current Conditions:\n• Temperature\n• Humidity\n• Wind speed\n• Precipitation\n\n📅 7-Day Forecast:\n• Daily predictions\n• Rainfall alerts\n• Extreme weather warnings\n\nCheck your home dashboard for real-time weather updates!";
    }

    // Watering queries
    if (lowerMessage.includes('water') || lowerMessage.includes('irrigation') || lowerMessage.includes('dry') || lowerMessage.includes('moisture')) {
      return "💧 Watering Guidelines:\n\n⏰ Best Practices:\n• Early morning watering (6-10 AM)\n• Deep watering over frequent light watering\n• Check soil moisture before watering\n\n📊 Water Requirements:\n• Vegetables: 1-2 inches/week\n• Grains: 0.75-1.5 inches/week\n• Fruits: 1-2.5 inches/week\n\nAdjust based on:\n✓ Soil type\n✓ Weather conditions\n✓ Plant growth stage";
    }

    // Pest queries
    if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('bug') || lowerMessage.includes('aphid')) {
      return "🐛 Pest Management Tips:\n\n🔍 Common Pests:\n• Aphids - Use neem oil spray\n• Caterpillars - Manual removal or BT spray\n• Whiteflies - Yellow sticky traps\n• Spider mites - Increase humidity\n\n🌿 Natural Solutions:\n• Companion planting\n• Beneficial insects\n• Organic pesticides\n• Crop rotation\n\nFor specific pest identification, upload a photo in the Diagnose section!";
    }

    // Fertilizer queries
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('npk') || lowerMessage.includes('compost') || lowerMessage.includes('manure')) {
      return "🌱 Fertilizer Guidance:\n\n📊 NPK Basics:\n• N (Nitrogen) - Leaf growth\n• P (Phosphorus) - Root & flower development\n• K (Potassium) - Overall plant health\n\n🌿 Organic Options:\n• Compost - All-purpose\n• Manure - Nitrogen-rich\n• Bone meal - Phosphorus\n• Wood ash - Potassium\n\n⚠️ Application Tips:\n• Test soil first\n• Apply during active growth\n• Water after application\n• Follow package instructions";
    }

    // Help or general queries
    if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what can you')) {
      return "🌟 I'm here to help! I can assist with:\n\n🔍 **Diagnose**: Identify plant diseases from photos\n💧 **Soil Health**: Test and improve soil quality\n🌾 **Crop Management**: Track and optimize your crops\n📊 **Market Info**: Get prices and trading opportunities\n🌤️ **Weather**: Access forecasts and alerts\n💡 **Expert Tips**: Best practices for farming\n\nJust ask me anything related to farming, and I'll guide you!";
    }

    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! 🌱 I'm always here to help with your agricultural needs. Feel free to ask me anything else!";
    }

    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! 👋 How can I assist you with your farming today? Ask me about crops, diseases, soil, market prices, or anything agriculture-related!";
    }

    // Default response
    return "I understand you're asking about farming. I can help with:\n\n🌱 Plant disease diagnosis\n💧 Soil health & testing\n🌾 Crop management\n📊 Market prices\n🌤️ Weather forecasts\n🐛 Pest control\n💡 Fertilizer guidance\n\nCould you provide more details about what you need help with?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: '🌱 Diagnose Disease', action: 'How do I diagnose plant diseases?' },
    { label: '💧 Soil Health', action: 'Tell me about soil testing' },
    { label: '📊 Market Prices', action: 'What are current market prices?' },
    { label: '🌤️ Weather', action: 'What about weather forecasts?' }
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all hover:scale-110 animate-bounce"
          aria-label="Open chatbot"
        >
          <MessageCircle size={28} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden bg-white">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold">AgriSmart Assistant</h3>
                <p className="text-green-100 text-xs">Always here to help 🌱</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line break-words">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center mb-2">Quick Actions:</p>
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputMessage(action.action);
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    className="w-full text-left bg-white hover:bg-green-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Ask me anything about farming..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-4"
              >
                <Send size={20} />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Powered by AgriSmart AI
            </p>
          </div>
        </div>
      )}
    </>
  );
}
