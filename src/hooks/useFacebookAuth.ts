import { useState, useEffect, useCallback } from 'react';

export interface FacebookAuthResponse {
  status: 'connected' | 'not_authorized' | 'unknown';
  authResponse: {
    accessToken: string;
    expiresIn: string;
    signedRequest: string;
    userID: string;
  } | null;
}

export function useFacebookAuth() {
  const [authStatus, setAuthStatus] = useState<FacebookAuthResponse | null>(null);

  const checkLoginState = useCallback(() => {
    if (window.FB) {
      window.FB.getLoginStatus((response: FacebookAuthResponse) => {
        setAuthStatus(response);
      });
    }
  }, []);

  useEffect(() => {
    const initFacebookSDK = () => {
      if (window.FB) {
        checkLoginState();
      } else {
        window.fbAsyncInit = function() {
          window.FB.init({
            appId: '1323790411955452',
            cookie: true,
            xfbml: true,
            version: 'v19.0'
          });
          
          checkLoginState();
        };
      }
    };

    initFacebookSDK();
  }, [checkLoginState]);

  const handleLogin = useCallback(() => {
    if (window.FB) {
      window.FB.login((response: FacebookAuthResponse) => {
        if (response.authResponse) {
          setAuthStatus(response);
        }
      }, { scope: 'public_profile,email' });
    }
  }, []);

  return {
    authStatus,
    handleLogin,
    checkLoginState
  };
}