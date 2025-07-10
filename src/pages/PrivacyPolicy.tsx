import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Username and chat preferences</li>
              <li>IP address and device information</li>
              <li>Chat logs and timestamps</li>
              <li>Usage data and analytics</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Provide and maintain our service</li>
              <li>Improve user experience</li>
              <li>Monitor usage and prevent abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
            <p className="mb-4">We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
            <p className="mb-4">We may employ third-party companies to facilitate our service, provide service on our behalf, or assist us in analyzing how our service is used.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Changes to This Policy</h2>
            <p className="mb-4">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-2">If you have any questions about this Privacy Policy, please contact us:</p>
            <p>Phone: <a href="tel:+18062407920" className="text-blue-400 hover:underline">+1 (806) 240-7920</a></p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-blue-400 hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
