import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeftIcon, CheckCircleIcon, XMarkIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const PaymentForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestId = searchParams.get('request');
  const memberId = searchParams.get('member') || '1';

  const [request, setRequest] = useState(null);
  const [member, setMember] = useState(null);
  const [currentContribution, setCurrentContribution] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Check if requestId is provided
        if (!requestId) {
          setError('No request specified. Please select a contribution to pay.');
          setLoading(false);
          return;
        }

        const [requestsRes, membersRes, contribRes] = await Promise.all([
          axios.get('http://localhost:5000/contribution_requests'),
          axios.get('http://localhost:5000/members'),
          axios.get('http://localhost:5000/member_contributions')
        ]);

        const foundRequest = requestsRes.data.find(r => r.id === parseInt(requestId));
        if (!foundRequest) {
          setError('Request not found. Please try again.');
          setLoading(false);
          return;
        }

        const foundMember = membersRes.data.find(m => m.id === parseInt(memberId));
        if (!foundMember) {
          setError('Member not found. Please try again.');
          setLoading(false);
          return;
        }

        const foundContrib = contribRes.data.find(
          c => c.requestId === parseInt(requestId) && c.memberId === parseInt(memberId)
        );

        setRequest(foundRequest);
        setMember(foundMember);
        setCurrentContribution(foundContrib);

        if (foundContrib && foundRequest) {
          const balance = foundRequest.amount_per_member - foundContrib.amount_paid;
          setAmount(balance.toString());
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error loading payment data. Please try again.');
        setLoading(false);
      }
    };
    fetchData();
  }, [requestId, memberId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const paymentAmount = parseFloat(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const required = request.amount_per_member;
    const paid = currentContribution?.amount_paid || 0;
    const balance = required - paid;

    if (paymentAmount > balance) {
      setError(`Amount exceeds balance of KSh ${balance.toLocaleString()}`);
      return;
    }

    try {
      const newAmount = paid + paymentAmount;
      const status = newAmount >= required ? 'paid' : 'partial';
      
      console.log('Payment Recorded:', { 
        requestId: parseInt(requestId), 
        memberId: parseInt(memberId), 
        oldAmount: paid, 
        newAmount, 
        status 
      });

      setMessage(`✅ Payment of KSh ${paymentAmount.toLocaleString()} recorded successfully!`);
      
      setTimeout(() => {
        navigate(`/requests/${requestId}`);
      }, 1500);

    } catch (error) {
      setError('Error recording payment. Please try again.');
      console.error(error);
    }
  };

  // Show error if no request ID
  if (!requestId) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-[#1B191A] mb-2">No Request Selected</h2>
          <p className="text-[#7A6B63] mb-6">Please select a contribution request to pay from the dashboard.</p>
          <Link to="/" className="btn-primary inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#943A1F] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#7A6B63] font-medium">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-[#1B191A] mb-2">Something Went Wrong</h2>
          <p className="text-[#7A6B63] mb-6">{error}</p>
          <Link to="/" className="btn-primary inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!request || !member) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in-up">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-[#1B191A] mb-2">Data Not Found</h2>
          <p className="text-[#7A6B63] mb-6">The requested payment data could not be found.</p>
          <Link to="/" className="btn-primary inline-block">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const paid = currentContribution?.amount_paid || 0;
  const required = request.amount_per_member;
  const balance = required - paid;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in-up">
      <Link to={`/requests/${requestId}`} className="inline-flex items-center gap-2 text-[#943A1F] hover:text-[#7A2F18] font-medium hover:underline mb-6">
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Request
      </Link>

      <div className="card p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-[#943A1F] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <CurrencyDollarIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#1B191A]">Record Payment</h2>
          <p className="text-[#7A6B63] mt-2">Record a contribution payment</p>
        </div>

        {message && (
          <div className="bg-[#943A1F]/10 border-2 border-[#943A1F]/20 text-[#943A1F] px-4 py-3 rounded-xl mb-4 flex items-center gap-3">
            <CheckCircleIcon className="h-6 w-6" />
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-3">
            <XMarkIcon className="h-6 w-6" />
            {error}
          </div>
        )}

        {/* Summary */}
        <div className="bg-[#E9E4E0] p-5 rounded-xl mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#7A6B63]">Member</p>
              <p className="font-bold text-[#1B191A]">{member.name}</p>
            </div>
            <div>
              <p className="text-sm text-[#7A6B63]">Request</p>
              <p className="font-bold text-[#1B191A]">{request.title}</p>
            </div>
            <div>
              <p className="text-sm text-[#7A6B63]">For</p>
              <p className="font-bold text-[#1B191A]">{request.target_person}</p>
            </div>
            <div>
              <p className="text-sm text-[#7A6B63]">Amount Required</p>
              <p className="font-bold text-[#1B191A]">KSh {required.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-[#7A6B63]">Amount Paid</p>
              <p className="font-bold text-[#943A1F]">KSh {paid.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-[#7A6B63]">Balance</p>
              <p className={`font-bold ${balance > 0 ? 'text-[#1B191A]' : 'text-[#943A1F]'}`}>
                KSh {balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="input-label">Payment Amount (KSh)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field text-2xl font-bold py-4"
              min="1"
              max={balance}
              required
            />
            <p className="text-xs text-[#7A6B63] mt-1">Maximum: KSh {balance.toLocaleString()}</p>
          </div>

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => navigate(`/requests/${requestId}`)} 
              className="flex-1 bg-[#E9E4E0] text-[#1B191A] py-3 rounded-xl font-semibold hover:bg-[#D4C9C0] transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 btn-primary text-lg py-3"
              disabled={balance <= 0}
            >
              💸 Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;