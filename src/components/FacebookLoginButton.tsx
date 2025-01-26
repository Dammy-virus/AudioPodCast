import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface FacebookLoginButtonProps {
  status: string | undefined;
  onLogin: () => void;
}

export function FacebookLoginButton({ status, onLogin }: FacebookLoginButtonProps) {
  return (
    <div className="relative">
      <Button 
        variant={status === 'connected' ? "secondary" : "outline"} 
        className="gap-2" 
        onClick={onLogin}
      >
        <Users className="w-4 h-4" />
        {status === 'connected' ? 'Connected to Facebook' : 'Connect Facebook'}
      </Button>
      {/* Hidden Facebook login button for XFBML parsing */}
      <div className="hidden">
        <fb:login-button 
          scope="public_profile,email"
          onlogin="checkLoginState();">
        </fb:login-button>
      </div>
    </div>
  );
}