import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export function VipUpgradeModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();

  const handleUpgrade = () => {
    // Open WhatsApp with the provided number
    const phoneNumber = '18062407920';
    const message = 'I want to upgrade to VIP';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-pink-200 dark:border-pink-900/50">
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Unlock VIP Access</h2>
          <p className="text-pink-600 dark:text-pink-400 font-medium">Connect with verified girls instantly!</p>
        </div>
        
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-pink-100 dark:border-pink-900/50">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">VIP Benefits:</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-pink-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Connect with verified girls</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Skip the wait and match with real profiles</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-pink-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Gender filter</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose to connect only with girls</p>
              </div>
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-pink-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Priority matching</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">Get matched faster than regular users</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="space-y-3">
          <Button 
            onClick={handleUpgrade} 
            className="w-full py-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg font-semibold rounded-xl shadow-lg shadow-pink-500/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            size="lg"
          >
            <svg className="w-6 h-6 mr-2 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.498 14.382v-.002c-.301-.15-1.758-.867-2.03-.967-.273-.099-.473-.15-.674.15-.197.295-.771.963-.944 1.16-.174.196-.348.223-.646.075-.3-.15-1.265-.466-2.41-1.486-1.84-1.612-2.34-2.25-2.62-2.63-.15-.225-.016-.347.11-.461.114-.099.3-.3.45-.45.15-.15.195-.254.3-.421.1-.17.05-.316-.025-.446-.075-.129-.7-1.682-.96-2.29-.24-.57-.49-.5-.7-.51-.18-.01-.39-.011-.6-.011h-.51c-.18 0-.45.06-.69.3-.24.24-.93.9-.93 2.16 0 1.26.9 2.46 1.05 2.64.15.18 1.83 2.76 4.38 3.72.6.24 1.05.39 1.41.5.6.18 1.14.15 1.56.09.48-.075 1.5-.6 1.71-1.2.21-.6.21-1.11.15-1.2-.05-.09-.18-.15-.39-.24z"/>
              <path d="M12 0C5.373 0 0 5.177 0 11.564c0 2.05.531 3.982 1.462 5.662L0 24l6.898-1.81c1.88.99 4.028 1.57 6.302 1.57 6.627 0 12-5.178 12-11.564C25.5 5.177 20.127 0 12 0zm6.5 15.5c-.15.36-1.5 1.35-2.1 1.44-.6.09-1.05.12-2.4-.63-1.65-.93-2.7-3.18-2.79-3.33-.09-.15-.75-1.02-.75-1.95s.45-1.44.6-1.65c.15-.21.33-.3.45-.3s.33-.03.51.03c.18.06.42.09.6.66.21.72.75 2.46.81 2.64.06.18.09.39-.03.57-.12.18-.21.3-.39.48-.15.15-.33.33-.48.45-.18.15-.36.3-.15.6.21.3.9 1.26 1.95 2.04 1.35.99 2.49 1.26 2.88 1.41.39.15.63.12.84-.12.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.84-.18.36.12 2.25 1.05 2.64 1.23.39.18.66.27.75.42.09.15.09.87-.18 1.71-.24.84-1.41 1.47-1.98 1.5z"/>
            </svg>
            Upgrade Now via WhatsApp
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Maybe Later
          </Button>
          
          <p className="text-center text-xs text-gray-400 mt-4">
            By upgrading, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
