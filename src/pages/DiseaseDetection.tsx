import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Scan, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockResults = [
    {
      disease: "Leaf Spot Disease",
      confidence: 92,
      severity: "Moderate",
      remedies: [
        "Apply copper-based fungicide spray",
        "Remove infected leaves immediately", 
        "Improve air circulation between plants",
        "Avoid overhead watering"
      ],
      prevention: [
        "Maintain proper plant spacing",
        "Water at soil level, not on leaves",
        "Apply preventive fungicide before wet season"
      ]
    },
    {
      disease: "Healthy Crop",
      confidence: 88,
      severity: "None",
      remedies: [
        "Continue current care routine",
        "Monitor regularly for early detection",
        "Maintain proper nutrition schedule"
      ],
      prevention: [
        "Keep soil well-drained",
        "Maintain balanced fertilization",
        "Regular inspection recommended"
      ]
    }
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // Camera capture would be implemented here
    toast({
      title: "Camera feature",
      description: "Camera integration would be available in the mobile app",
    });
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to analyze",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      setAnalyzing(false);
      
      toast({
        title: "Analysis complete!",
        description: `Detected: ${randomResult.disease}`,
      });
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'severe':
        return 'bg-red-500';
      case 'moderate':
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
      case 'mild':
        return 'bg-orange-500';
      default:
        return 'bg-green-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">Disease Detection</h1>
        <p className="text-muted-foreground">AI-powered crop disease identification</p>
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Crop Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </Button>
            <Button 
              onClick={handleCameraCapture}
              variant="outline"
              className="flex-1"
            >
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {selectedImage && (
            <div className="space-y-4">
              <img 
                src={selectedImage} 
                alt="Selected crop" 
                className="w-full h-48 object-cover rounded-lg border"
              />
              
              <Button 
                onClick={analyzeImage}
                disabled={analyzing}
                className="w-full"
              >
                <Scan className="h-4 w-4 mr-2" />
                {analyzing ? "Analyzing..." : "Analyze Image"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Progress */}
      {analyzing && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin mx-auto h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              <div className="space-y-2">
                <p className="font-medium">AI Analysis in Progress</p>
                <p className="text-sm text-muted-foreground">Identifying diseases and conditions...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {result.disease === "Healthy Crop" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  Detection Results
                </CardTitle>
                <Badge 
                  variant="outline"
                  className={`${getSeverityColor(result.severity)} text-white border-none`}
                >
                  {result.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-lg">{result.disease}</p>
                <p className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                  {result.confidence}% confidence
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Immediate Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.remedies.map((remedy: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{remedy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prevention Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.prevention.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;