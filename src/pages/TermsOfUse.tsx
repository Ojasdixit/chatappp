import { Link } from 'react-router-dom';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
          <p className="text-gray-400">Effective date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">By accessing or using our service, you agree to be bound by these Terms of Use. If you disagree with any part of the terms, you may not access the service.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Conduct</h2>
            <p className="mb-2">You agree not to use the service to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Post or share illegal, harmful, or offensive content</li>
              <li>Harass, threaten, or intimidate other users</li>
              <li>Impersonate any person or entity</li>
              <li>Share personal or sensitive information</li>
              <li>Engage in spamming or phishing activities</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">You are responsible for maintaining the confidentiality of your account information. You agree to accept responsibility for all activities that occur under your account.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
            <p className="mb-4">The service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Termination</h2>
            <p className="mb-4">We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the service, us, or third parties, or for any other reason.</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-2">If you have any questions about these Terms, please contact us:</p>
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
