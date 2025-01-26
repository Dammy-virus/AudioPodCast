import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Radio, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from 'sonner';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useStreamDuration } from '@/hooks/useStreamDuration';
import { useFacebookAuth } from '@/hooks/useFacebookAuth';
import { usePageTransition } from '@/hooks/usePageTransition';
import { FacebookLoginButton } from '@/components/FacebookLoginButton';
import { Preloader } from '@/components/Preloader';

declare global {
  interface Window {
    FB: any;
    checkLoginState: () => void;
  }
}

function App() {
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop&q=60");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isRecording, audioLevel, startRecording, stopRecording } = useAudioRecorder();
  const duration = useStreamDuration(isLive);
  const { authStatus, handleLogin, checkLoginState } = useFacebookAuth();
  const isTransitioning = usePageTransition();

  useEffect(() => {
    window.checkLoginState = checkLoginState;
    return () => {
      delete window.checkLoginState;
    };
  }, [checkLoginState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleImageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  }, []);

  const handleGoLive = useCallback(async () => {
    if (!isLive) {
      try {
        await startRecording();
        setIsLive(true);
        toast.success('Stream started successfully!');
      } catch (error) {
        toast.error('Failed to start stream. Please check your microphone permissions.');
      }
    } else {
      stopRecording();
      setIsLive(false);
      toast.info('Stream ended');
    }
  }, [isLive, startRecording, stopRecording]);

  return (
    <>
      {(loading || isTransitioning) && <Preloader />}
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex flex-col">
        <div className="flex-grow p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Radio className="w-8 h-8 text-primary" />
                <h1 className="text-2xl font-bold">Fowokanmi | AudioCast</h1>
              </div>
              <FacebookLoginButton 
                status={authStatus?.status} 
                onLogin={handleLogin}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stream Preview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Stream Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imageUrl}
                      alt="Stream preview"
                      className="object-cover w-full h-full"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-4 right-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {isLive && (
                      <Badge
                        variant="destructive"
                        className="absolute top-4 left-4 animate-pulse"
                      >
                        LIVE
                      </Badge>
                    )}
                  </div>
                  <Button
                    className="w-full gap-2"
                    variant={isLive ? "destructive" : "default"}
                    onClick={handleGoLive}
                    disabled={!authStatus || authStatus.status !== 'connected'}
                  >
                    <Mic className="w-4 h-4" />
                    {isLive ? "End Stream" : "Go Live"}
                  </Button>
                  {(!authStatus || authStatus.status !== 'connected') && (
                    <p className="text-sm text-muted-foreground text-center">
                      Please connect to Facebook to start streaming
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Stream Stats Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Stream Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-2xl font-bold font-mono">{duration}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Audio Level</p>
                      <div className="h-8 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-150"
                          style={{ width: `${audioLevel * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Facebook Status</p>
                      <Badge variant={authStatus?.status === 'connected' ? "default" : "secondary"}>
                        {authStatus?.status || 'Loading...'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Viewers</p>
                      <p className="text-sm font-medium">0</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Peak Viewers</p>
                      <p className="text-sm font-medium">0</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Stream Quality</p>
                      <p className="text-sm font-medium">HD</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-border mt-auto">
          <div className="max-w-4xl mx-auto py-6 px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">© 2025 AudioCast. All rights reserved.</p>
              </div>
              <div className="flex items-center gap-6">
                <a href="/privacy-policy.html" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms-of-service.html" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
                <a href="/data-deletion.html" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Data Deletion
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;