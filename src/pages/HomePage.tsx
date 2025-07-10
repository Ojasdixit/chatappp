import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">
            <span className="text-blue-400">Connect</span>Chat
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="hover:text-blue-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-400 transition">How It Works</a>
            <a href="#safety" className="hover:text-blue-400 transition">Safety</a>
            <Link to="/blog" className="hover:text-blue-400 transition font-medium">
              Blog
            </Link>
          </div>
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            Start Chatting
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Connect with People Around the World
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Join thousands of users having meaningful conversations. No registration required - just start chatting!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
          >
            Start Chatting Now
          </Link>
          <a 
            href="#how-it-works" 
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Platform</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-750 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-400">Your privacy is our priority. Chat anonymously without sharing personal information.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-750 p-6 rounded-xl">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Connections</h3>
              <p className="text-gray-400">Get matched with new people instantly. No waiting, no complicated setup.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-750 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Community</h3>
              <p className="text-gray-400">Connect with people from around the world and discover new perspectives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/3 text-5xl font-bold text-blue-400 mb-4 md:mb-0">1</div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-semibold mb-2">Choose a Username</h3>
                <p className="text-gray-400">Create a unique username to identify yourself. No personal information required.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/3 text-5xl font-bold text-blue-400 mb-4 md:mb-0">2</div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-semibold mb-2">Start Chatting</h3>
                <p className="text-gray-400">Get connected with another user instantly and start your conversation.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 text-5xl font-bold text-blue-400 mb-4 md:mb-0">3</div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-semibold mb-2">Respect & Enjoy</h3>
                <p className="text-gray-400">Follow our community guidelines and enjoy meaningful conversations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Your Safety Matters</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            We're committed to creating a safe and respectful environment for all users.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="bg-gray-750 p-6 rounded-lg">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Stay Anonymous</h3>
              <p className="text-sm text-gray-400">No need to share personal information with strangers.</p>
            </div>

            <div className="bg-gray-750 p-6 rounded-lg">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Block & Report</h3>
              <p className="text-sm text-gray-400">Easily block or report any inappropriate behavior.</p>
            </div>

            <div className="bg-gray-750 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Verified Users</h3>
              <p className="text-sm text-gray-400">Our team works to maintain a safe community.</p>
            </div>

            <div className="bg-gray-750 p-6 rounded-lg">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">No Payment Required</h3>
              <p className="text-sm text-gray-400">Basic features are completely free to use.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Chatting?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users having meaningful conversations right now.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold mb-4 md:mb-0">
              <span className="text-blue-400">Connect</span>Chat
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link>
              <Link to="/community-guidelines" className="text-gray-400 hover:text-white transition">Community Guidelines</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition">Contact Us</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ConnectChat. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
