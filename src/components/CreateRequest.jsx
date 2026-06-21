import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  CalendarIcon,
  InformationCircleIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_person: '',
    amount_per_member: '',
    deadline: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/members');
        setMembers(res.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setIsSubmitting(true);

    if (!formData.title || !formData.description || !formData.target_person || 
        !formData.amount_per_member || !formData.deadline) {
      setError('Please fill all fields');
      setIsSubmitting(false);
      return;
    }

    const amount = parseFloat(formData.amount_per_member);
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      setIsSubmitting(false);
      return;
    }

    try {
      const requestsRes = await axios.get('http://localhost:5000/contribution_requests');
      const currentRequests = requestsRes.data;
      const totalExpected = amount * members.length;

      const newRequest = {
        id: currentRequests.length + 1,
        title: formData.title,
        description: formData.description,
        target_person: formData.target_person,
        amount_per_member: amount,
        total_expected: totalExpected,
        status: 'active',
        created_date: new Date().toISOString().split('T')[0],
        deadline: formData.deadline
      };

      const contribRes = await axios.get('http://localhost:5000/member_contributions');
      const currentContribs = contribRes.data;
      const newContributions = members.map((member, index) => ({
        id: currentContribs.length + index + 1,
        requestId: newRequest.id,
        memberId: member.id,
        amount_paid: 0,
        status: 'pending'
      }));

      console.log('New Request:', newRequest);
      console.log('New Contributions:', newContributions);

      setMessage(`✅ Request "${formData.title}" created! ${members.length} members need to contribute KSh ${amount.toLocaleString()} each.`);
      setIsSubmitting(false);
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      setError('Error creating request. Please try again.');
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <SparklesIcon className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Request</h2>
          <p className="text-gray-500 mt-2">Start a new fundraising drive for your chama</p>
        </div>

        {message && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6" />
            {message}
          </div>
        )}
        {error && (
          <div className="bg-rose-50 border-2 border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-3">
            <XMarkIcon className="h-6 w-6" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="input-label">Request Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Funeral - Brenda"
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="input-label">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explain why this contribution is needed..."
              rows="3"
              className="input-field"
              required
            />
          </div>

          <div className="mb-4">
            <label className="input-label">Target Person *</label>
            <input
              type="text"
              name="target_person"
              value={formData.target_person}
              onChange={handleChange}
              placeholder="Who is this for? (e.g., Brenda, Sarah)"
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="input-label">Amount Per Member (KSh) *</label>
              <input
                type="number"
                name="amount_per_member"
                value={formData.amount_per_member}
                onChange={handleChange}
                placeholder="1100"
                className="input-field"
                min="1"
                required
              />
            </div>
            <div>
              <label className="input-label">Deadline *</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
          </div>

          {formData.amount_per_member && members.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl mb-6 border border-purple-100">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <InformationCircleIcon className="h-5 w-5 text-purple-600" />
                Summary
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Members</p>
                  <p className="font-bold text-gray-800 flex items-center gap-1">
                    <UserGroupIcon className="h-4 w-4" />
                    {members.length}
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Per Member</p>
                  <p className="font-bold text-gray-800 flex items-center gap-1">
                    <CurrencyDollarIcon className="h-4 w-4" />
                    KSh {parseFloat(formData.amount_per_member || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/70 rounded-lg p-3 col-span-2">
                  <p className="text-xs text-gray-500">Total Expected</p>
                  <p className="font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-lg">
                    KSh {(parseFloat(formData.amount_per_member || 0) * members.length).toLocaleString()}
                  </p>
                </div>
              </div>
              {formData.deadline && (
                <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  Deadline: {new Date(formData.deadline).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary w-full text-lg py-3" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Create Request'
            )}
          </button>
        </form>
      </div>

    </div>
  );
};

export default CreateRequest;