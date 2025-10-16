import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

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
      text: 'Hello! I\'m your Namjai assistant. I can help you with:\n\n• Understanding water quality metrics\n• Interpreting alerts\n• Submitting reports\n• Scheduling maintenance\n• System navigation\n\nHow can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('ph') || input.includes('acid')) {
      return 'pH measures water acidity/alkalinity. Safe drinking water should be between 6.5-8.5. Values outside this range may indicate contamination or treatment issues.';
    }
    if (input.includes('turbidity') || input.includes('cloudy')) {
      return 'Turbidity measures water cloudiness. It should be below 5 NTU for safe drinking water. High turbidity can indicate sediment, algae, or other particles.';
    }
    if (input.includes('tds') || input.includes('dissolved solids')) {
      return 'TDS (Total Dissolved Solids) measures mineral content in ppm. Safe range is 0-500 ppm. High TDS may affect taste but isn\'t always harmful.';
    }
    if (input.includes('temperature')) {
      return 'Temperature should be 10-30°C for optimal water quality. Extreme temperatures can affect microbial growth and water treatment efficiency.';
    }
    if (input.includes('alert') || input.includes('notification')) {
      return 'Alerts are automatically generated when sensor readings exceed thresholds. Critical alerts require immediate attention. You can acknowledge alerts from the Alerts page.';
    }
    if (input.includes('report')) {
      return 'To submit a report, go to the Reports page, click "Submit Report", select the tank, describe the issue, and optionally attach a photo. Reports help track infrastructure issues.';
    }
    if (input.includes('maintenance')) {
      return 'Regular maintenance includes sensor calibration (quarterly), filter replacement (6 months), and tank cleaning (annually). Check the Maintenance page for schedules.';
    }
    if (input.includes('role') || input.includes('permission')) {
      return 'Admins have full access. Field Officers can manage reports and maintenance. Observers have read-only access to dashboards and alerts.';
    }

    return 'I can help you with water quality metrics, alerts, reports, maintenance, and system navigation. Could you please be more specific about what you need help with?';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle size={20} />
              <span className="font-semibold">Namjai Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 rounded p-1">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
