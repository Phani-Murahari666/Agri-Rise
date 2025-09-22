import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Droplets, Activity, TrendingUp, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Recommendations = () => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const mockRecommendations = [
    {
      crop: "Rice",
      expectedYield: "4.5 tons/hectare",
      profitMargin: "₹35,000/hectare",
      sustainabilityScore: 8.5,
      soilRequirement: "pH 5.5-7.0, High moisture",
      season: "Kharif",
    },
    {
      crop: "Cotton",
      expectedYield: "2.2 tons/hectare", 
      profitMargin: "₹42,000/hectare",
      sustainabilityScore: 7.2,
      soilRequirement: "pH 6.0-8.0, Well-drained",
      season: "Kharif",
    },
    {
      crop: "Wheat",
      expectedYield: "3.8 tons/hectare",
      profitMargin: "₹28,000/hectare", 
      sustainabilityScore: 9.1,
      soilRequirement: "pH 6.0-7.5, Loamy soil",
      season: "Rabi",
    },
  ];

  const handleGetRecommendations = async () => {
    if (!location.trim()) {
      toast({
        title: "Location required",
        description: "Please enter your location to get recommendations",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRecommendations(mockRecommendations);
      setLoading(false);
      toast({
        title: "Recommendations ready!",
        description: "Found suitable crops for your area",
      });
    }, 2000);
  };

  const getSustainabilityColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-yellow-500";
    return "bg-orange-500";
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">Crop Recommendations</h1>
        <p className="text-muted-foreground">Get AI-powered crop suggestions for your farm</p>
      </div>

      {/* Location Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Farm Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your location (e.g., Village, District)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleGetRecommendations}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Get Crops"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Conditions */}
      {location && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Current Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Soil Moisture</p>
                  <p className="font-medium">72%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Soil pH</p>
                  <p className="font-medium">6.8</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recommended Crops</h2>
          {recommendations.map((crop, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{crop.crop}</CardTitle>
                  <Badge variant="outline">{crop.season}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Expected Yield</p>
                    <p className="font-medium">{crop.expectedYield}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className="font-medium text-green-600">{crop.profitMargin}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sustainability Score</span>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getSustainabilityColor(crop.sustainabilityScore)}`} />
                      <span className="font-medium">{crop.sustainabilityScore}/10</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Soil Requirements</p>
                    <p className="text-sm">{crop.soilRequirement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;