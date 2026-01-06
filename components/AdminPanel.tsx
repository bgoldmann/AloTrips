'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LayoutDashboard, Users, CreditCard, ShoppingBag, TrendingUp, Search, Filter, AlertCircle, CheckCircle, Edit, Trash2, Save, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminStats, Booking } from '../types';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  tier: 'Silver' | 'Gold' | 'Platinum';
  points: number;
  member_since?: string;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'users'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination states
  const [bookingsPage, setBookingsPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [usersTotal, setUsersTotal] = useState(0);
  
  // Search and filter states
  const [bookingsSearch, setBookingsSearch] = useState('');
  const [bookingsStatusFilter, setBookingsStatusFilter] = useState('');
  const [usersSearch, setUsersSearch] = useState('');
  const [usersTierFilter, setUsersTierFilter] = useState('');
  
  // Edit states
  const [editingBooking, setEditingBooking] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editBookingStatus, setEditBookingStatus] = useState<string>('');
  const [editUserData, setEditUserData] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes] = await Promise.all([
          fetch('/api/admin/stats'),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData.stats);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchBookings();
    }
  }, [activeTab, bookingsPage, bookingsSearch, bookingsStatusFilter]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, usersPage, usersSearch, usersTierFilter]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams({
        page: bookingsPage.toString(),
        limit: '50',
      });
      if (bookingsSearch) params.append('search', bookingsSearch);
      if (bookingsStatusFilter) params.append('status', bookingsStatusFilter);

      const response = await fetch(`/api/admin/bookings?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        setBookingsTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: usersPage.toString(),
        limit: '50',
      });
      if (usersSearch) params.append('search', usersSearch);
      if (usersTierFilter) params.append('tier', usersTierFilter);

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        setUsersTotal(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleUpdateBooking = async (id: string) => {
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: editBookingStatus }),
      });

      if (response.ok) {
        setEditingBooking(null);
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleUpdateUser = async (id: string) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editUserData }),
      });

      if (response.ok) {
        setEditingUser(null);
        setEditUserData({});
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen bg-gray-50/50 items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
         <div className="mb-8 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Management</span>
         </div>
         <nav className="space-y-1">
            <button 
               onClick={() => setActiveTab('dashboard')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                 activeTab === 'dashboard' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
               }`}
            >
               <LayoutDashboard size={18}/> Dashboard
            </button>
            <button 
               onClick={() => setActiveTab('bookings')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                 activeTab === 'bookings' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
               }`}
            >
               <ShoppingBag size={18}/> Bookings
            </button>
            <button 
               onClick={() => setActiveTab('users')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                 activeTab === 'users' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
               }`}
            >
               <Users size={18}/> Users
            </button>
         </nav>

         <div className="mt-8 px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">System</span>
         </div>
         <nav className="space-y-1 mt-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
               <AlertCircle size={18}/> Logs
            </button>
         </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
         {activeTab === 'dashboard' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
               <h1 className="text-2xl font-black text-gray-900 mb-6">Dashboard Overview</h1>
               
               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600"><CreditCard size={20}/></div>
                        <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full">+{stats.growth}%</span>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                     <h3 className="text-2xl font-black text-gray-900">${stats.totalRevenue.toLocaleString()}</h3>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><ShoppingBag size={20}/></div>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Total Bookings</p>
                     <h3 className="text-2xl font-black text-gray-900">{stats.totalBookings}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <div className="flex justify-between items-start mb-4">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Users size={20}/></div>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">Active Users</p>
                     <h3 className="text-2xl font-black text-gray-900">{stats.activeUsers.toLocaleString()}</h3>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 rounded-2xl shadow-lg text-white">
                     <p className="text-white/80 text-sm font-medium mb-1">System Health</p>
                     <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle size={20}/> Operational</h3>
                     <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-white w-[98%] h-full rounded-full"></div>
                     </div>
                     <p className="text-xs text-white/60 mt-2">99.9% Uptime</p>
                  </div>
               </div>

               {/* Charts Area */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-orange-500"/> Revenue Trends
                     </h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={stats.revenueHistory}>
                              <defs>
                                 <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6"/>
                              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10}/>
                              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} tickFormatter={(value) => `$${value}`}/>
                              <Tooltip 
                                 contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                  formatter={(value: number | undefined) => [`$${(value || 0).toLocaleString()}`, 'Revenue']}
                              />
                              <Area type="monotone" dataKey="value" stroke="#ea580c" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3}/>
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                     <h3 className="font-bold text-gray-900 mb-6">Traffic Sources</h3>
                     <div className="space-y-4">
                        {[
                           { name: 'Organic Search', val: 45, color: 'bg-orange-500' },
                           { name: 'Direct', val: 25, color: 'bg-blue-500' },
                           { name: 'Social', val: 20, color: 'bg-purple-500' },
                           { name: 'Referral', val: 10, color: 'bg-green-500' },
                        ].map((item) => (
                           <div key={item.name}>
                              <div className="flex justify-between text-sm mb-1">
                                 <span className="font-medium text-gray-600">{item.name}</span>
                                 <span className="font-bold text-gray-900">{item.val}%</span>
                              </div>
                              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                 <div className={`${item.color} h-full rounded-full`} style={{width: `${item.val}%`}}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}

         {activeTab === 'bookings' && (
            <div className="animate-in fade-in slide-in-from-right-4">
               <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-black text-gray-900">Bookings Management</h1>
                  <div className="flex gap-2">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                           type="text" 
                           placeholder="Search bookings..." 
                           value={bookingsSearch}
                           onChange={(e) => {
                              setBookingsSearch(e.target.value);
                              setBookingsPage(1);
                           }}
                           className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                     </div>
                     <select
                        value={bookingsStatusFilter}
                        onChange={(e) => {
                           setBookingsStatusFilter(e.target.value);
                           setBookingsPage(1);
                        }}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                     >
                        <option value="">All Status</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Pending">Pending</option>
                        <option value="Cancelled">Cancelled</option>
                     </select>
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Item</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking) => (
                           <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 text-sm font-mono text-gray-500">{booking.id.substring(0, 8)}...</td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-900 flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[10px] font-bold">
                                    {booking.customerName.charAt(0)}
                                 </div>
                                 {booking.customerName}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                 <span className="block font-medium">{booking.itemTitle}</span>
                                 <span className="text-xs text-gray-400">{booking.provider} • {booking.type}</span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{booking.date}</td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-900">${booking.amount}</td>
                              <td className="px-6 py-4">
                                 {editingBooking === booking.id ? (
                                    <select
                                       value={editBookingStatus}
                                       onChange={(e) => setEditBookingStatus(e.target.value)}
                                       className="px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                       <option value="Confirmed">Confirmed</option>
                                       <option value="Pending">Pending</option>
                                       <option value="Cancelled">Cancelled</option>
                                    </select>
                                 ) : (
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                       booking.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                                       booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                                       'bg-red-50 text-red-600'
                                    }`}>
                                       {booking.status}
                                    </span>
                                 )}
                              </td>
                              <td className="px-6 py-4">
                                 {editingBooking === booking.id ? (
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() => handleUpdateBooking(booking.id)}
                                          className="text-green-600 hover:text-green-700"
                                       >
                                          <Save size={16} />
                                       </button>
                                       <button
                                          onClick={() => {
                                             setEditingBooking(null);
                                             setEditBookingStatus('');
                                          }}
                                          className="text-gray-600 hover:text-gray-700"
                                       >
                                          <X size={16} />
                                       </button>
                                    </div>
                                 ) : (
                                    <button
                                       onClick={() => {
                                          setEditingBooking(booking.id);
                                          setEditBookingStatus(booking.status);
                                       }}
                                       className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                    >
                                       <Edit size={14} /> Edit
                                    </button>
                                 )}
                              </td>
                           </tr>
                        ))}
                        {bookings.length === 0 && (
                           <tr>
                              <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                 No bookings found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {bookingsTotal > 50 && (
                     <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                           Showing {((bookingsPage - 1) * 50) + 1} to {Math.min(bookingsPage * 50, bookingsTotal)} of {bookingsTotal} bookings
                        </div>
                        <div className="flex items-center gap-2">
                           <button
                              onClick={() => setBookingsPage(p => Math.max(1, p - 1))}
                              disabled={bookingsPage === 1}
                              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <ChevronLeft size={16} />
                           </button>
                           <span className="text-sm font-bold text-gray-700">Page {bookingsPage}</span>
                           <button
                              onClick={() => setBookingsPage(p => p + 1)}
                              disabled={bookingsPage * 50 >= bookingsTotal}
                              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <ChevronRight size={16} />
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}
         
         {activeTab === 'users' && (
            <div className="animate-in fade-in slide-in-from-right-4">
               <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-black text-gray-900">User Management</h1>
                  <div className="flex gap-2">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                           type="text" 
                           placeholder="Search users..." 
                           value={usersSearch}
                           onChange={(e) => {
                              setUsersSearch(e.target.value);
                              setUsersPage(1);
                           }}
                           className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                     </div>
                     <select
                        value={usersTierFilter}
                        onChange={(e) => {
                           setUsersTierFilter(e.target.value);
                           setUsersPage(1);
                        }}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                     >
                        <option value="">All Tiers</option>
                        <option value="Silver">Silver</option>
                        <option value="Gold">Gold</option>
                        <option value="Platinum">Platinum</option>
                     </select>
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tier</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Points</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                           <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                 {editingUser === user.id ? (
                                    <div className="flex flex-col gap-2">
                                       <input
                                          type="text"
                                          value={editUserData.first_name || user.first_name}
                                          onChange={(e) => setEditUserData({ ...editUserData, first_name: e.target.value })}
                                          className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                          placeholder="First Name"
                                       />
                                       <input
                                          type="text"
                                          value={editUserData.last_name || user.last_name}
                                          onChange={(e) => setEditUserData({ ...editUserData, last_name: e.target.value })}
                                          className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                          placeholder="Last Name"
                                       />
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-2">
                                       <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">
                                          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                                       </div>
                                       <span className="font-bold text-gray-900">{user.first_name} {user.last_name}</span>
                                    </div>
                                 )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                              <td className="px-6 py-4">
                                 {editingUser === user.id ? (
                                    <select
                                       value={editUserData.tier || user.tier}
                                       onChange={(e) => setEditUserData({ ...editUserData, tier: e.target.value as 'Silver' | 'Gold' | 'Platinum' })}
                                       className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                       <option value="Silver">Silver</option>
                                       <option value="Gold">Gold</option>
                                       <option value="Platinum">Platinum</option>
                                    </select>
                                 ) : (
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                       user.tier === 'Platinum' ? 'bg-purple-50 text-purple-600' :
                                       user.tier === 'Gold' ? 'bg-yellow-50 text-yellow-600' :
                                       'bg-gray-50 text-gray-600'
                                    }`}>
                                       {user.tier}
                                    </span>
                                 )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                 {editingUser === user.id ? (
                                    <input
                                       type="number"
                                       value={editUserData.points !== undefined ? editUserData.points : user.points}
                                       onChange={(e) => setEditUserData({ ...editUserData, points: parseInt(e.target.value) })}
                                       className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                 ) : (
                                    user.points.toLocaleString()
                                 )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                 {user.member_since ? new Date(user.member_since).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                 {editingUser === user.id ? (
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() => handleUpdateUser(user.id)}
                                          className="text-green-600 hover:text-green-700"
                                       >
                                          <Save size={16} />
                                       </button>
                                       <button
                                          onClick={() => {
                                             setEditingUser(null);
                                             setEditUserData({});
                                          }}
                                          className="text-gray-600 hover:text-gray-700"
                                       >
                                          <X size={16} />
                                       </button>
                                    </div>
                                 ) : (
                                    <div className="flex items-center gap-2">
                                       <button
                                          onClick={() => {
                                             setEditingUser(user.id);
                                             setEditUserData({});
                                          }}
                                          className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                                       >
                                          <Edit size={14} /> Edit
                                       </button>
                                       <button
                                          onClick={() => handleDeleteUser(user.id)}
                                          className="text-red-600 hover:text-red-700"
                                       >
                                          <Trash2 size={14} />
                                       </button>
                                    </div>
                                 )}
                              </td>
                           </tr>
                        ))}
                        {users.length === 0 && (
                           <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                 No users found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {usersTotal > 50 && (
                     <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                           Showing {((usersPage - 1) * 50) + 1} to {Math.min(usersPage * 50, usersTotal)} of {usersTotal} users
                        </div>
                        <div className="flex items-center gap-2">
                           <button
                              onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                              disabled={usersPage === 1}
                              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <ChevronLeft size={16} />
                           </button>
                           <span className="text-sm font-bold text-gray-700">Page {usersPage}</span>
                           <button
                              onClick={() => setUsersPage(p => p + 1)}
                              disabled={usersPage * 50 >= usersTotal}
                              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                              <ChevronRight size={16} />
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default AdminPanel;
