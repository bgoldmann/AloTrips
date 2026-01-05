import React, { useState } from 'react';
import { MOCK_ADMIN_STATS, MOCK_BOOKINGS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LayoutDashboard, Users, CreditCard, ShoppingBag, TrendingUp, Search, Filter, AlertCircle, CheckCircle } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'users'>('dashboard');
  const stats = MOCK_ADMIN_STATS;

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
                                 formatter={(value: number) => [`$${value}`, 'Revenue']}
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
                        <input type="text" placeholder="Search bookings..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                     </div>
                     <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"><Filter size={18} className="text-gray-500"/></button>
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
                        {MOCK_BOOKINGS.map((booking) => (
                           <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 text-sm font-mono text-gray-500">{booking.id}</td>
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
                                 <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                                    booking.status === 'Confirmed' ? 'bg-green-50 text-green-600' :
                                    booking.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                                    'bg-red-50 text-red-600'
                                 }`}>
                                    {booking.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-blue-600 font-bold hover:underline cursor-pointer">Edit</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
         
         {activeTab === 'users' && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-in fade-in">
               <div className="bg-orange-50 p-6 rounded-full mb-4">
                  <Users size={48} className="text-orange-400" />
               </div>
               <h2 className="text-xl font-bold text-gray-900">User Management</h2>
               <p className="text-gray-500 max-w-sm mt-2">This module is under construction. It will feature full CRUD operations for the user base.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default AdminPanel;