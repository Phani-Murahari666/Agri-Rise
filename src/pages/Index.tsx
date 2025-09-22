import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 to-accent/20">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary flex items-center justify-center">
          <span className="text-2xl">🌾</span>
        </div>
        <h1 className="mb-4 text-4xl font-bold text-primary">Gramin Samriddhi</h1>
        <p className="text-xl text-muted-foreground">AI-powered farmer assistant</p>
        <div className="mt-4 animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    </div>
  );
};

export default Index;
