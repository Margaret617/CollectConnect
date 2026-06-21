import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, contribRes, requestsRes] = await Promise.all([
          axios.get('http://localhost:5000/members'),
          axios.get('http://localhost:5000/member_contributions'),
          axios.get('http://localhost:5000/contribution_requests')
        ]);
        setMembers(membersRes.data);
        setContributions(contribRes.data);
        setRequests(requestsRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMemberBalance = (memberId) => {
    const memberContribs = contributions.filter(c => c.memberId === memberId);
    const totalPaid = memberContribs.reduce((sum, c) => sum + c.amount_paid, 0);
    const totalExpected = memberContribs.reduce((sum, c) => {
      const request = requests.find(r => r.id === c.requestId);
      return sum + (request?.amount_per_member || 0);
    }, 0);
    return totalExpected - totalPaid;
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-500 font-medium">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">👥 Members</h2>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <UserGroupIcon className="h-4 w-4" />
            {members.length} total members
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="input-field pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member, index) => {
          const balance = getMemberBalance(member.id);
          return (
            <div 
              key={member.id}
              className="glass-card p-5 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl mb-3 shadow-lg">
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{member.name}</h3>
                  <p className="text-sm text-gray-500">📱 {member.phone}</p>
                  <p className="text-sm text-gray-500">✉️ {member.email}</p>
                  <div className="mt-2">
                    <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                      {member.family} Family
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Balance</p>
                  <p className={`text-lg font-bold ${balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    KSh {balance.toLocaleString()}
                  </p>
                </div>
              </div>
              <Link to={`/members/${member.id}`} className="btn-primary text-sm w-full text-center block mt-4">
                View Profile
              </Link>
            </div>
          );
        })}
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-gray-400 glass-card p-12">
          <MagnifyingGlassIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-semibold">No members found</p>
          <p className="text-sm">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
};

export default MemberList;