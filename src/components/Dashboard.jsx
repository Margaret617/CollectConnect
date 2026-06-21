import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  CurrencyDollarIcon, 
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsRes = await axios.get('http://localhost:5000/contribution_requests');
        const contribRes = await axios.get('http://localhost:5000/member_contributions');
        setRequests(requestsRes.data);
        setContributions(contribRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeRequests = requests.filter(r => r.status === 'active');
  const totalExpected = requests.reduce((sum, r) => sum + r.total_expected, 0);
  const totalCollected = contributions.reduce((sum, c) => sum + c.amount_paid, 0);
  const totalBalance = totalExpected - totalCollected;

  const memberId = 1;
  const myTotalExpected = activeRequests.reduce((sum, r) => sum + r.amount_per_member, 0);
  const myTotalPaid = contributions.filter(c => c.memberId === memberId).reduce((sum, c) => sum + c.amount_paid, 0);
  const myTotalBalance = myTotalExpected - myTotalPaid;

  const stats = [
    { 
      label: 'Active Requests', 
      value: activeRequests.length, 
      icon: DocumentTextIcon,
      bg: 'bg-[#FFA586]/10'
    },
    { 
      label: 'Total Expected', 
      value: `KSh ${totalExpected.toLocaleString()}`, 
      icon: CurrencyDollarIcon,
      bg: 'bg-[#384358]/10'
    },
    { 
      label: 'Total Collected', 
      value: `KSh ${totalCollected.toLocaleString()}`, 
      icon: CheckCircleIcon,
      bg: 'bg-[#FFA586]/10'
    },
    { 
      label: 'My Balance', 
      value: `KSh ${myTotalBalance.toLocaleString()}`, 
      icon: ClockIcon,
      bg: 'bg-[#384358]/10'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#FFA586]/20 border-t-[#FFA586] rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <SparklesIcon className="h-8 w-8 text-[#FFA586] animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-[#7A8A9E] font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Premium Hero Section */}
      <div className="gradient-hero rounded-3xl p-10 text-white shadow-2xl animate-fade-in-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFA586]/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFA586]/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
          <div className="absolute top-10 right-20 w-2 h-2 bg-[#FFA586]/30 rounded-full"></div>
          <div className="absolute bottom-20 left-32 w-3 h-3 bg-[#FFA586]/20 rounded-full"></div>
          <div className="absolute top-32 left-10 w-4 h-4 bg-[#FFA586]/10 rounded-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFA586]/20 px-4 py-2 rounded-full mb-4">
                <SparklesIcon className="h-4 w-4 text-[#FFA586]" />
                <span className="text-sm font-medium text-[#FFA586]">Welcome back!</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-2">Great to see you 👋</h1>
              <p className="text-[#7A8A9E] text-lg">Here's your chama performance overview</p>
            </div>
            <div className="mt-4 lg:mt-0 bg-gradient-accent text-[#1A2634] px-8 py-4 rounded-2xl shadow-xl">
              <p className="text-sm font-medium uppercase tracking-wider opacity-80">Total Balance</p>
              <p className="text-3xl font-bold">KSh {totalBalance.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10 flex items-center gap-3">
              <UserGroupIcon className="h-5 w-5 text-[#FFA586]" />
              <span className="font-medium">{requests.length} Total Requests</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10 flex items-center gap-3">
              <ArrowTrendingUpIcon className="h-5 w-5 text-[#FFA586]" />
              <span className="font-medium">{totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0}% Collected</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10 flex items-center gap-3">
              <CurrencyDollarIcon className="h-5 w-5 text-[#FFA586]" />
              <span className="font-medium">KSh {totalCollected.toLocaleString()} Raised</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="card-premium p-6 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-4 rounded-2xl`}>
                <stat.icon className="h-6 w-6 text-[#384358]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Progress */}
      <div className="card p-6 animate-fade-in-up">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-[#1A2634] text-lg">Overall Collection Progress</h3>
            <p className="text-sm text-[#7A8A9E]">Track your chama's fundraising progress</p>
          </div>
          <span className="text-2xl font-bold text-[#FFA586]">
            {totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0}%
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${totalExpected > 0 ? Math.min((totalCollected / totalExpected) * 100, 100) : 0}%` }}></div>
        </div>
        <div className="flex justify-between text-sm mt-3">
          <span className="text-[#7A8A9E]">Collected: <strong className="text-[#1A2634]">KSh {totalCollected.toLocaleString()}</strong></span>
          <span className="text-[#7A8A9E]">Remaining: <strong className="text-[#FFA586]">KSh {totalBalance.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Premium Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Requests */}
        <div className="card p-6 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1A2634]">📋 Active Requests</h2>
              <p className="text-sm text-[#7A8A9E]">Ongoing fundraising drives</p>
            </div>
            <Link to="/requests/create" className="btn-primary text-sm">
              + New Request
            </Link>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {activeRequests.length === 0 ? (
              <div className="text-center py-16 text-[#7A8A9E]">
                <DocumentTextIcon className="h-20 w-20 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No active requests</p>
                <p className="text-sm">Create your first contribution request</p>
              </div>
            ) : (
              activeRequests.map((request, index) => {
                const collected = contributions
                  .filter(c => c.requestId === request.id)
                  .reduce((sum, c) => sum + c.amount_paid, 0);
                const progress = (collected / request.total_expected) * 100;
                
                return (
                  <div 
                    key={request.id} 
                    className="bg-[#F8F6F4] rounded-xl p-5 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-[#E8ECF0]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#1A2634] text-lg">{request.title}</h3>
                        <p className="text-sm text-[#7A8A9E] mt-1">{request.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="bg-[#FFA586]/20 text-[#1A2634] text-xs px-3 py-1 rounded-full font-medium">👤 {request.target_person}</span>
                          <span className="bg-[#384358]/10 text-[#384358] text-xs px-3 py-1 rounded-full font-medium">KSh {request.amount_per_member.toLocaleString()} each</span>
                          <span className="bg-[#E8ECF0] text-[#7A8A9E] text-xs px-3 py-1 rounded-full font-medium">⏰ {new Date(request.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-[#FFA586]">KSh {collected.toLocaleString()}</p>
                        <p className="text-xs text-[#7A8A9E]">of KSh {request.total_expected.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="progress-bar h-2">
                        <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-medium text-[#FFA586]">{Math.round(progress)}% complete</span>
                        <Link to={`/requests/${request.id}`} className="text-[#FFA586] hover:text-[#F59575] text-sm font-medium transition">
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* My Contributions */}
        <div className="card p-6 animate-fade-in-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1A2634]">💰 My Contributions</h2>
            <p className="text-sm text-[#7A8A9E]">Your personal contribution status</p>
          </div>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {activeRequests.length === 0 ? (
              <div className="text-center py-16 text-[#7A8A9E]">
                <CheckCircleIcon className="h-20 w-20 mx-auto mb-4 opacity-20" />
                <p className="font-medium">No active contributions</p>
                <p className="text-sm">You're all caught up! 🎉</p>
              </div>
            ) : (
              activeRequests.map((request) => {
                const myContribution = contributions.find(c => c.requestId === request.id && c.memberId === memberId);
                const paid = myContribution?.amount_paid || 0;
                const required = request.amount_per_member;
                const balance = required - paid;
                const status = myContribution?.status || 'pending';

                return (
                  <div key={request.id} className="bg-[#F8F6F4] rounded-xl p-5 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-[#E8ECF0]">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-[#1A2634]">{request.title}</h4>
                        <p className="text-sm text-[#7A8A9E]">For: {request.target_person}</p>
                      </div>
                      <span className={`${
                        status === 'paid' ? 'badge-paid' :
                        status === 'partial' ? 'badge-partial' :
                        'badge-pending'
                      }`}>
                        {status.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-xs text-[#7A8A9E] font-medium">Required</p>
                        <p className="font-bold text-[#1A2634]">KSh {required.toLocaleString()}</p>
                      </div>
                      <div className="bg-[#FFA586]/10 rounded-lg p-3 text-center">
                        <p className="text-xs text-[#7A8A9E] font-medium">Paid</p>
                        <p className="font-bold text-[#FFA586]">KSh {paid.toLocaleString()}</p>
                      </div>
                      <div className={`rounded-lg p-3 text-center ${balance > 0 ? 'bg-[#1A2634]/5' : 'bg-[#FFA586]/10'}`}>
                        <p className="text-xs text-[#7A8A9E] font-medium">Balance</p>
                        <p className={`font-bold ${balance > 0 ? 'text-[#1A2634]' : 'text-[#FFA586]'}`}>
                          KSh {balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {balance > 0 && (
                      <Link to={`/pay?request=${request.id}`} className="btn-primary text-sm w-full text-center block mt-4">
                        Pay Balance (KSh {balance.toLocaleString()})
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;