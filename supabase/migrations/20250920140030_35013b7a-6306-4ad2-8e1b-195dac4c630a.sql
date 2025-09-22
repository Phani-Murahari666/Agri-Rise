-- Create farmers table for user profiles
CREATE TABLE public.farmers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  preferred_language TEXT DEFAULT 'english' CHECK (preferred_language IN ('english', 'hindi', 'malayalam', 'telugu')),
  phone_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;

-- Create policies for farmer access
CREATE POLICY "Farmers can view their own profile" 
ON public.farmers 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Farmers can create their own profile" 
ON public.farmers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Farmers can update their own profile" 
ON public.farmers 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create crop recommendations table
CREATE TABLE public.crop_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  soil_ph DECIMAL(3,1),
  soil_moisture DECIMAL(5,2),
  soil_nitrogen DECIMAL(6,2),
  soil_phosphorus DECIMAL(6,2),
  soil_potassium DECIMAL(6,2),
  weather_data JSONB,
  recommended_crops JSONB,
  expected_yield JSONB,
  profit_margin JSONB,
  sustainability_score DECIMAL(3,1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for recommendations
CREATE POLICY "Farmers can view their own recommendations" 
ON public.crop_recommendations 
FOR SELECT 
USING (farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid()));

CREATE POLICY "System can create recommendations" 
ON public.crop_recommendations 
FOR INSERT 
WITH CHECK (farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid()));

-- Create disease detections table
CREATE TABLE public.disease_detections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  detected_disease TEXT,
  confidence_score DECIMAL(5,2),
  remedies TEXT,
  diagnosis_language TEXT DEFAULT 'english',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.disease_detections ENABLE ROW LEVEL SECURITY;

-- Create policies for disease detections
CREATE POLICY "Farmers can view their own disease detections" 
ON public.disease_detections 
FOR SELECT 
USING (farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid()));

CREATE POLICY "System can create disease detections" 
ON public.disease_detections 
FOR INSERT 
WITH CHECK (farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid()));

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  message_language TEXT DEFAULT 'english',
  is_voice_input BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat messages
CREATE POLICY "Farmers can view their own chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid()));

CREATE POLICY "System can create chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (farmer_id IN (SELECT id FROM public.farmers WHERE user_id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_farmers_updated_at
BEFORE UPDATE ON public.farmers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for crop/disease images
INSERT INTO storage.buckets (id, name, public) VALUES ('crop-images', 'crop-images', false);

-- Create storage policies
CREATE POLICY "Farmers can upload their own images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Farmers can view their own images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'crop-images' AND auth.uid()::text = (storage.foldername(name))[1]);