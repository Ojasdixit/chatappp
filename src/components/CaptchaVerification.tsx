import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

export default function CaptchaVerification() {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerification = (token: string | null) => {
    if (token) {
      // In a production environment, you would verify the token with your backend
      // For now, we'll just assume it's valid after the user completes the captcha
      setVerified(true);
      setError('');
      
      // Store verification in session storage
      sessionStorage.setItem('captchaVerified', 'true');
      
      // Redirect to chat after a short delay
      setTimeout(() => {
        navigate('/chat');
      }, 1000);
    } else {
      setError('Please complete the verification');
    }
  };

  // For development, we'll use a test key that always passes
  // In production, replace with your actual reCAPTCHA site key
  const recaptchaKey = import.meta.env.DEV 
    ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'  // Test key that always passes in development
    : 'YOUR_ACTUAL_SITE_KEY';  // Replace with your actual production key

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Verification Required</h2>
          <p className="text-gray-400">Please verify you're not a robot to continue to the chat</p>
        </div>
        
        <div className="flex justify-center mb-6">
          {!verified ? (
            <ReCAPTCHA
              sitekey={recaptchaKey}
              onChange={handleVerification}
              className="transform scale-90"
            />
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-400 font-medium">Verification successful! Redirecting...</p>
            </div>
          )}
        </div>
        
        {error && (
          <div className="text-red-400 text-sm text-center mb-4">
            {error}
          </div>
        )}
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our <a href="#" className="text-blue-400 hover:underline">Terms of Service</a> and 
            <a href="#" className="text-blue-400 hover:underline ml-1">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
