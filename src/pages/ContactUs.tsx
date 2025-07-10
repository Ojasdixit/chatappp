import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-400">We'd love to hear from you</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-600 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Phone</h3>
                  <p className="text-gray-400">
                    <a href="tel:+18062407920" className="hover:text-blue-400 transition">
                      +1 (806) 240-7920
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Monday - Friday, 9am - 5pm EST</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-600 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">Email</h3>
                  <p className="text-gray-400">
                    <a href="mailto:support@connectchat.com" className="hover:text-blue-400 transition">
                      support@connectchat.com
                    </a>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 mt-6">
                <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/privacy-policy" className="text-blue-400 hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="text-blue-400 hover:underline">
                      Terms of Use
                    </Link>
                  </li>
                  <li>
                    <Link to="/community-guidelines" className="text-blue-400 hover:underline">
                      Community Guidelines
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="text-blue-400 hover:underline">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-8 rounded-xl">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="bg-green-900/30 border border-green-800 text-green-400 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
                <p>Thank you for contacting us. We'll get back to you soon.</p>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-blue-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-white"
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Report a Problem">Report a Problem</option>
                    <option value="Account Help">Account Help</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
                >
                  Send Message
                </button>
              </form>
            )}
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
