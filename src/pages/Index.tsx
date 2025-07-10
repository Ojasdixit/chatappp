import { ChatApp } from "@/components/ChatApp";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Navigation Header */}
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-400">
            ConnectChat
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/home" className="hover:text-blue-400 transition">Home</Link>
            <Link to="/privacy-policy" className="hover:text-blue-400 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition">Terms</Link>
            <Link to="/contact" className="hover:text-blue-400 transition">Contact</Link>
          </nav>
          <Link 
            to="/home" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
          >
            Back to Home
          </Link>
        </div>
      </header>
      
      {/* Main Chat Content */}
      <main className="flex-1">
        <ChatApp />
      </main>
    </div>
  );
};

export default Index;
