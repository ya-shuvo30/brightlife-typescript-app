import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Shield, 
  Calendar, 
  CreditCard, 
  FileText, 
  LogOut, 
  Home,
  Award,
  Heart,
  Phone
} from 'lucide-react';
import logo from '../../assets/images/logo.png';

interface MemberSession {
  proposalNo: string;
  name: string;
  membershipType: string;
  status: string;
  validUntil: string;
  loggedInAt: string;
}

const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState<MemberSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for session data
    const sessionData = sessionStorage.getItem('memberSession') || localStorage.getItem('memberSession');
    
    if (sessionData) {
      try {
        const parsed = JSON.parse(sessionData);
        setMemberData(parsed);
      } catch {
        console.error('Failed to parse session data');
        navigate('/member-login');
      }
    } else {
      // No session, redirect to login
      navigate('/member-login');
    }
    
    setIsLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('memberSession');
    localStorage.removeItem('memberSession');
    navigate('/member-login');
  };

  const getMembershipColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'silver': return 'from-gray-300 to-gray-500';
      case 'bronze': return 'from-orange-400 to-orange-600';
      case 'executive': return 'from-purple-400 to-purple-600';
      default: return 'from-green-400 to-green-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!memberData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="BrightLife" className="w-12 h-12 rounded-full shadow" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Member Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {memberData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Membership Card */}
        <div className={`bg-gradient-to-r ${getMembershipColor(memberData.membershipType)} rounded-2xl shadow-xl p-6 mb-8 text-white`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-6 h-6" />
                <span className="text-lg font-semibold">{memberData.membershipType.toUpperCase()} MEMBER</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">{memberData.name}</h2>
              <p className="text-white/80">Member ID: {memberData.proposalNo}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(memberData.status)}`}>
                {memberData.status.toUpperCase()}
              </span>
              <p className="text-white/80 mt-2">Valid Until: {memberData.validUntil}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Coverage</p>
                <p className="text-xl font-bold text-gray-900">Active</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Network Hospitals</p>
                <p className="text-xl font-bold text-gray-900">100+</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-full">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className="text-xl font-bold text-gray-900">Paid</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="text-xl font-bold text-gray-900">2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group">
              <User className="w-8 h-8 text-gray-400 group-hover:text-green-600 mb-2" />
              <span className="text-sm text-gray-600 group-hover:text-green-700">View Profile</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group">
              <FileText className="w-8 h-8 text-gray-400 group-hover:text-green-600 mb-2" />
              <span className="text-sm text-gray-600 group-hover:text-green-700">Download Card</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group">
              <CreditCard className="w-8 h-8 text-gray-400 group-hover:text-green-600 mb-2" />
              <span className="text-sm text-gray-600 group-hover:text-green-700">Payment History</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors group">
              <Phone className="w-8 h-8 text-gray-400 group-hover:text-green-600 mb-2" />
              <span className="text-sm text-gray-600 group-hover:text-green-700">Contact Support</span>
            </button>
          </div>
        </div>

        {/* Member Details */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Membership Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Member ID</span>
                <span className="font-medium text-gray-900">{memberData.proposalNo}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Full Name</span>
                <span className="font-medium text-gray-900">{memberData.name}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Membership Type</span>
                <span className="font-medium text-gray-900">{memberData.membershipType}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(memberData.status)}`}>
                  {memberData.status}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Valid Until</span>
                <span className="font-medium text-gray-900">{memberData.validUntil}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-gray-500">Last Login</span>
                <span className="font-medium text-gray-900">
                  {new Date(memberData.loggedInAt).toLocaleString('en-GB')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-8 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          © 2024 Bright Life Bangladesh Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MemberDashboard;
