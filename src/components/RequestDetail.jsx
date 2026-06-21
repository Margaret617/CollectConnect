import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, CalendarIcon } from '@heroicons/react/24/outline';

const RequestDetail = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, membersRes, contribRes] = await Promise.all([
          axios.get('http://localhost:5000/contribution_requests'),
          axios.get('http://localhost:5000/members'),
          axios.get('http://localhost:5000/member_contributions')
        ]);
        const foundRequest = requestsRes.data.find(r => r.id === parseInt(id));
        setRequest(foundRequest);
        setMembers(membersRes.data);
        setContributions(contribRes.data.filter(c => c.requestId === parseInt(id)));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading request details...</p>
        </div>
      </div>
    );
  }
  
  if (!request) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-800">Request not found</h2>
        <Link to="/" className="text-purple-600 hover:underline mt-2 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const totalCollected = contributions.reduce((sum, c) => sum + c.amount_paid, 0);
  const progress = (totalCollected / request.total_expected) * 100;
  const balance = request.total_expected - totalCollected;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Link to="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium hover:underline">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="gradient-hero rounded-3xl p-8 text-white hero-pattern shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{request.title}</h1>
              <p className="text-white/80 mt-2">{request.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">👤 {request.target_person}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm">💰 KSh {request.amount_per_member.toLocaleString()} each</span>
                <span className={`${request.status === 'active' ? 'bg-emerald-500/30' : 'bg-gray-500/30'} px-3 py-1 rounded-full text-sm backdrop-blur-sm`}>
                  {request.status.toUpperCase()}
                </span>
              </div>
              <p className="text-white/60 text-sm mt-2 flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                Deadline: {new Date(request.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <p className="text-sm opacity-80">Progress</p>
              <p className="text-2xl font-bold">{Math.round(progress)}%</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="progress-bar bg-white/20">
              <div className="progress-fill bg-gradient-to-r from-white/80 to-white" style={{ width: `${Math.min(progress, 100)}%` }}></div>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Collected: <strong>KSh {totalCollected.toLocaleString()}</strong></span>
              <span>Expected: <strong>KSh {request.total_expected.toLocaleString()}</strong></span>
              <span>Balance: <strong>KSh {balance.toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Contributions Table */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">👥 Member Contributions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 rounded-xl">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Member</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Family</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Required</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Paid</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Balance</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => {
                const contrib = contributions.find(c => c.memberId === member.id);
                const paid = contrib?.amount_paid || 0;
                const required = request.amount_per_member;
                const memberBalance = required - paid;
                const status = contrib?.status || 'pending';

                return (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-white/30 transition">
                    <td className="px-4 py-3 font-medium text-gray-800">{member.name}</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">{member.family}</span>
                    </td>
                    <td className="px-4 py-3 text-right">KSh {required.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-emerald-600">KSh {paid.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-600">KSh {memberBalance.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`${status === 'paid' ? 'badge-paid' : status === 'partial' ? 'badge-partial' : 'badge-pending'}`}>
                        {status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {memberBalance > 0 && request.status === 'active' && (
                        <Link to={`/pay?request=${request.id}&member=${member.id}`} className="text-purple-600 hover:text-purple-700 text-sm font-medium hover:underline">
                          Pay
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;