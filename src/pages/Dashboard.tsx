import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, Send, Leaf, Cloud, TrendingUp, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);

  const quickStats = [
    { label: "Weather", value: "28°C", icon: Cloud, color: "bg-blue-500" },
    { label: "Soil Health", value: "Good", icon: Leaf, color: "bg-green-500" },
    { label: "Market Price", value: "₹45/kg", icon: TrendingUp, color: "bg-orange-500" },
    { label: "Alerts", value: "2", icon: AlertCircle, color: "bg-red-500" },
  ];

  const recentChats = [
    { question: "Best crop for monsoon season?", answer: "Rice and cotton are ideal for monsoon..." },
    { question: "How to prevent leaf spot disease?", answer: "Use copper-based fungicides and maintain proper spacing..." },
  ];

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Voice input implementation would go here
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Send message logic would go here
      setMessage("");
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">Welcome, Farmer!</h1>
        <p className="text-muted-foreground">How can I help you today?</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="pt-4">
                <div className={`inline-flex p-2 rounded-full ${stat.color} mb-2`}>
                  <IconComponent className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ask Anything</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your question or use voice..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              size="icon"
              variant={isListening ? "default" : "outline"}
              onClick={handleVoiceInput}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {isListening && (
            <div className="text-center py-4">
              <Badge variant="outline" className="animate-pulse">
                🎤 Listening...
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Chats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Conversations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentChats.map((chat, index) => (
            <div key={index} className="p-3 bg-muted rounded-lg">
              <p className="font-medium text-sm mb-1">{chat.question}</p>
              <p className="text-xs text-muted-foreground">{chat.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;