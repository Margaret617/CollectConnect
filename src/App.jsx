import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MemberList from './components/MemberList';
import MemberProfile from './components/MemberProfile';
import CreateRequest from './components/CreateRequest';
import RequestDetail from './components/RequestDetail';
import PaymentForm from './components/PaymentForm';
import { 
  HomeIcon, 
  UsersIcon, 
  PlusCircleIcon, 
  CurrencyDollarIcon, 
  Bars3Icon, 
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-[#F8F6F4]">
        {/* Premium Navbar */}
        <nav className="gradient-primary text-white shadow-2xl sticky top-0 z-50 border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-20">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#FFA586] rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-[#FFA586] p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <div>
                  <span className="text-xl font-bold tracking-tight">CollectConnect</span>
                  <span className="block text-[10px] text-[#FFA586] font-medium tracking-widest uppercase">Premium</span>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1">
                <Link to="/" className="flex items-center space-x-2 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <HomeIcon className="h-5 w-5" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/members" className="flex items-center space-x-2 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <UsersIcon className="h-5 w-5" />
                  <span className="font-medium">Members</span>
                </Link>
                <Link to="/requests/create" className="flex items-center space-x-2 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105">
                  <PlusCircleIcon className="h-5 w-5" />
                  <span className="font-medium">New Request</span>
                </Link>
                <Link to="/pay" className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#FFA586] text-[#1A2634] hover:bg-[#F59575] transition-all duration-300 hover:scale-105 font-bold shadow-lg">
                  <CurrencyDollarIcon className="h-5 w-5" />
                  <span>Pay Now</span>
                </Link>
              </div>

              <button 
                className="md:hidden p-3 rounded-xl hover:bg-white/10 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>

            {isMobileMenuOpen && (
              <div className="md:hidden py-6 border-t border-white/10 space-y-2 animate-fade-in-up">
                <Link to="/" className="flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition" onClick={() => setIsMobileMenuOpen(false)}>
                  <HomeIcon className="h-5 w-5" /><span className="font-medium">Dashboard</span>
                </Link>
                <Link to="/members" className="flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition" onClick={() => setIsMobileMenuOpen(false)}>
                  <UsersIcon className="h-5 w-5" /><span className="font-medium">Members</span>
                </Link>
                <Link to="/requests/create" className="flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/10 transition" onClick={() => setIsMobileMenuOpen(false)}>
                  <PlusCircleIcon className="h-5 w-5" /><span className="font-medium">New Request</span>
                </Link>
                <Link to="/pay" className="flex items-center space-x-3 px-4 py-3.5 rounded-xl bg-[#FFA586] text-[#1A2634] font-bold transition" onClick={() => setIsMobileMenuOpen(false)}>
                  <CurrencyDollarIcon className="h-5 w-5" /><span>Pay Now</span>
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="container mx-auto px-4 py-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<MemberList />} />
            <Route path="/members/:id" element={<MemberProfile />} />
            <Route path="/requests/create" element={<CreateRequest />} />
            <Route path="/requests/:id" element={<RequestDetail />} />
            <Route path="/pay" element={<PaymentForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;