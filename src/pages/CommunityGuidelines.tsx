import { Link } from 'react-router-dom';

export default function CommunityGuidelines() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="mb-8">
            <p className="mb-6 text-lg">
              Our community is built on respect, kindness, and positive interactions. 
              These guidelines help ensure a safe and enjoyable experience for everyone.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Be Respectful</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Treat all members with kindness and respect</li>
              <li>Be mindful of cultural differences</li>
              <li>Respect others' privacy and boundaries</li>
              <li>Use appropriate language</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Prohibited Content</h2>
            <p className="mb-2">Do not share or post:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Hate speech or discrimination</li>
              <li>Harassment or bullying</li>
              <li>Sexually explicit content</li>
              <li>Violent or graphic content</li>
              <li>Illegal activities or substances</li>
              <li>Misinformation or fake news</li>
              <li>Spam or scams</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Privacy & Safety</h2>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Never share personal information</li>
              <li>Be cautious when sharing photos or videos</li>
              <li>Report suspicious behavior immediately</li>
              <li>Use the block feature if needed</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Consequences</h2>
            <p className="mb-4">
              Violations of these guidelines may result in:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Content removal</li>
              <li>Temporary suspension</li>
              <li>Permanent ban</li>
              <li>Legal action in severe cases</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Reporting</h2>
            <p className="mb-4">
              Help us maintain a positive community by reporting any violations or concerns.
            </p>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-2">For questions or to report violations:</p>
            <p>Phone: <a href="tel:+18062407920" className="text-blue-400 hover:underline">+1 (806) 240-7920</a></p>
            <p className="mt-2 text-sm text-gray-400">
              We take all reports seriously and will respond as soon as possible.
            </p>
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
