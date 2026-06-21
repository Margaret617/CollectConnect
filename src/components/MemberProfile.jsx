import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MemberProfile = () => {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [requests, setRequests] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersRes = await axios.get('http://localhost:5000/members');
        const requestsRes = await axios.get('http://localhost:5000/contribution_requests');
        const contribRes = await axios.get('http://localhost:5000/member_contributions');
        
        const foundMember = membersRes.data.find(m => m.id === parseInt(id));
        setMember(foundMember);
        setRequests(requestsRes.data);
        setContributions(contribRes.data.filter(c => c.memberId === parseInt(id)));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (!member) {
    return <div className="text-center py-10 text-red-600">Member not found</div>;
  }

  // Calculate totals
  const totalPaid = contributions.reduce((sum, c) => sum + c.amount_paid, 0);
  const totalExpected = contributions.reduce((sum, c) => {
    const req = requests.find(r => r.id === c.requestId);
    return sum + (req?.amount_per_member || 0);
  }, 0);
  const totalBalance = totalExpected - totalPaid;

  return (
    <div className="space-y-6">
      <Link to="/members" className="text-chama-navy hover:underline">
        ← Back to Members
      </Link>

      {/* Profile Card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold">{member.name}</h2>
            <p className="text-gray-600">📱 {member.phone}</p>
            <p className="text-gray-600">✉️ {member.email}</p>
            <p className="text-gray-600">
              Family: <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                {member.family}
              </span>
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-indigo-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Overall Balance</p>
            <p className={`text-3xl font-bold ${totalBalance > 0 ? 'text-chama-orange' : 'text-chama-green'}`}>
              KSh {totalBalance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <p className="stat-label">Total Contributions Made</p>
          <p className="stat-value text-chama-green">KSh {totalPaid.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Balance Owed</p>
          <p className={`stat-value ${totalBalance > 0 ? 'text-chama-orange' : 'text-chama-green'}`}>
            KSh {totalBalance.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Contribution Requests */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">📊 Contribution Requests</h3>
        {contributions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No contributions yet</p>
        ) : (
          <div className="space-y-4">
            {contributions.map(contrib => {
              const request = requests.find(r => r.id === contrib.requestId);
              if (!request) return null;
              
              const paid = contrib.amount_paid;
              const required = request.amount_per_member;
              const balance = required - paid;
              const status = contrib.status || 'pending';

              return (
                <div key={contrib.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{request.title}</h4>
                      <p className="text-sm text-gray-500">For: {request.target_person}</p>
                    </div>
                    <span className={`${
                      status === 'paid' ? 'badge-paid' :
                      status === 'partial' ? 'badge-partial' :
                      'badge-pending'
                    }`}>
                      {status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Required</p>
                      <p className="font-semibold">KSh {required.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Paid</p>
                      <p className="font-semibold text-chama-green">KSh {paid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Balance</p>
                      <p className={`font-semibold ${balance > 0 ? 'text-chama-orange' : 'text-chama-green'}`}>
                        KSh {balance.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {balance > 0 && request.status === 'active' && (
                    <div className="mt-2">
                      <Link 
                        to={`/pay?request=${request.id}&member=${member.id}`}
                        className="btn-primary text-sm w-full text-center block"
                      >
                        Pay Balance (KSh {balance.toLocaleString()})
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberProfile;