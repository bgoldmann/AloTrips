import React, { useState } from 'react';
import { UserProfile, Booking } from '../types';
import { MOCK_USER_PROFILE, MOCK_BOOKINGS } from '../constants';
import { User, Mail, Phone, MapPin, CreditCard, Award, Edit2, Save, X, Calendar, Plane, Briefcase } from 'lucide-react';

const UserProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'settings'>('overview');

  const handleSave = () => {
    setIsEditing(false);
    // Simulate API call
    console.log('Saved profile:', profile);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const userBookings = MOCK_BOOKINGS.filter(b => b.customerName.includes(profile.firstName) || b.customerName.includes('Traveler'));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500"></div>
        <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-end -mt-12">
           <div className="relative">
              <img 
                src={profile.avatar} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white" 
              />
              <div className="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
           </div>
           
           <div className="flex-1 mb-2">
              <h1 className="text-3xl font-black text-gray-900">{profile.firstName} {profile.lastName}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                 <span className="flex items-center gap-1"><MapPin size={14}/> {profile.homeAirport}</span>
                 <span className="flex items-center gap-1"><Calendar size={14}/> Member since {profile.memberSince}</span>
              </div>
           </div>

           <div className="mb-4 flex gap-3">
              <div className="text-right px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
                 <p className="text-xs text-orange-600 font-bold uppercase">AloRewards</p>
                 <p className="text-xl font-black text-gray-900">{profile.points.toLocaleString()} <span className="text-xs font-normal text-gray-500">pts</span></p>
              </div>
              <div className="text-right px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                 <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                 <p className="text-xl font-black text-amber-500 flex items-center gap-1"><Award size={18}/> {profile.tier}</p>
              </div>
           </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-8 flex gap-8 border-t border-gray-100">
           {['overview', 'bookings', 'settings'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`py-4 text-sm font-bold border-b-2 transition-all capitalize ${
                 activeTab === tab 
                   ? 'border-orange-500 text-orange-600' 
                   : 'border-transparent text-gray-500 hover:text-gray-800'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Left Column (Personal Info) */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">Personal Details</h3>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="text-orange-600 hover:bg-orange-50 p-2 rounded-full transition-colors">
                       <Edit2 size={18} />
                    </button>
                  ) : (
                    <div className="flex gap-1">
                       <button onClick={handleSave} className="text-green-600 hover:bg-green-50 p-2 rounded-full transition-colors"><Save size={18}/></button>
                       <button onClick={() => setIsEditing(false)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"><X size={18}/></button>
                    </div>
                  )}
               </div>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                     {isEditing ? (
                       <div className="flex gap-2">
                         <input value={profile.firstName} onChange={(e) => handleChange('firstName', e.target.value)} className="w-full border rounded p-1 text-sm"/>
                         <input value={profile.lastName} onChange={(e) => handleChange('lastName', e.target.value)} className="w-full border rounded p-1 text-sm"/>
                       </div>
                     ) : (
                       <div className="flex items-center gap-2 text-gray-800 font-medium">
                          <User size={16} className="text-gray-400"/> {profile.firstName} {profile.lastName}
                       </div>
                     )}
                  </div>
                  
                  <div>
                     <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                     {isEditing ? (
                       <input value={profile.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full border rounded p-1 text-sm"/>
                     ) : (
                       <div className="flex items-center gap-2 text-gray-800 font-medium">
                          <Mail size={16} className="text-gray-400"/> {profile.email}
                       </div>
                     )}
                  </div>

                  <div>
                     <label className="text-xs font-bold text-gray-400 uppercase">Phone</label>
                     {isEditing ? (
                       <input value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full border rounded p-1 text-sm"/>
                     ) : (
                       <div className="flex items-center gap-2 text-gray-800 font-medium">
                          <Phone size={16} className="text-gray-400"/> {profile.phone}
                       </div>
                     )}
                  </div>

                  <div>
                     <label className="text-xs font-bold text-gray-400 uppercase">Home Airport</label>
                     {isEditing ? (
                       <input value={profile.homeAirport} onChange={(e) => handleChange('homeAirport', e.target.value)} className="w-full border rounded p-1 text-sm"/>
                     ) : (
                       <div className="flex items-center gap-2 text-gray-800 font-medium">
                          <Plane size={16} className="text-gray-400"/> {profile.homeAirport}
                       </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-lg text-white">
               <div className="flex justify-between items-start mb-8">
                  <CreditCard size={24} className="text-gray-400" />
                  <span className="bg-white/10 px-2 py-1 rounded text-xs font-bold">DEFAULT</span>
               </div>
               <div className="mb-4">
                  <p className="text-lg tracking-widest font-mono text-gray-300">•••• •••• •••• 4242</p>
               </div>
               <div className="flex justify-between text-sm text-gray-400">
                  <span>ALEX TRAVELER</span>
                  <span>12/26</span>
               </div>
            </div>
         </div>

         {/* Main Content Column */}
         <div className="lg:col-span-2">
            {activeTab === 'overview' && (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="font-bold text-gray-900 text-xl">Recent Activity</h3>
                  {userBookings.length > 0 ? (
                    <div className="space-y-4">
                       {userBookings.map((booking) => (
                          <div key={booking.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                             <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${
                                   booking.type === 'Flight' ? 'bg-blue-50 text-blue-600' :
                                   booking.type === 'Hotel' ? 'bg-purple-50 text-purple-600' :
                                   'bg-amber-50 text-amber-600'
                                }`}>
                                   {booking.type === 'Flight' ? <Plane size={20}/> : booking.type === 'Hotel' ? <Briefcase size={20}/> : <CreditCard size={20}/>}
                                </div>
                                <div>
                                   <h4 className="font-bold text-gray-900">{booking.itemTitle}</h4>
                                   <p className="text-xs text-gray-500">{booking.date} • {booking.provider}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="font-bold text-gray-900">${booking.amount}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                   booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                   booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                   'bg-red-100 text-red-700'
                                }`}>
                                   {booking.status}
                                </span>
                             </div>
                          </div>
                       ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 border-dashed">
                       <Briefcase size={40} className="mx-auto text-gray-300 mb-2"/>
                       <p className="text-gray-500">No recent bookings found.</p>
                    </div>
                  )}
               </div>
            )}
            
            {activeTab === 'bookings' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <h3 className="font-bold text-gray-900 text-xl mb-4">My Trips</h3>
                  <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-orange-800 text-sm mb-4">
                     All your past and upcoming trips are listed here. Need to make a change? Contact support.
                  </div>
                  {/* Reuse the booking list UI for simplicity */}
                  {userBookings.map((booking) => (
                      <div key={booking.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-orange-200 transition-all group">
                         <div className="flex justify-between items-start mb-4">
                            <div>
                               <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID: {booking.id}</span>
                               <h4 className="text-lg font-bold text-gray-900 mt-1">{booking.itemTitle}</h4>
                            </div>
                            <button className="text-sm font-bold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                               View Ticket
                            </button>
                         </div>
                         <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span className="flex items-center gap-2"><Calendar size={16}/> {booking.date}</span>
                            <span className="flex items-center gap-2"><CreditCard size={16}/> ${booking.amount}</span>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                               booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>{booking.status}</span>
                         </div>
                      </div>
                  ))}
               </div>
            )}

            {activeTab === 'settings' && (
               <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center animate-in fade-in slide-in-from-right-4">
                  <div className="max-w-md mx-auto">
                     <h3 className="font-bold text-gray-900 text-lg mb-2">Account Settings</h3>
                     <p className="text-gray-500 mb-6 text-sm">Manage your notifications, security, and privacy preferences.</p>
                     
                     <div className="space-y-3 text-left">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                           <span className="font-medium text-gray-700">Email Notifications</span>
                           <input type="checkbox" defaultChecked className="toggle-checkbox accent-orange-500 w-5 h-5"/>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                           <span className="font-medium text-gray-700">Two-Factor Auth</span>
                           <input type="checkbox" className="toggle-checkbox accent-orange-500 w-5 h-5"/>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                           <span className="font-medium text-gray-700">Public Profile</span>
                           <input type="checkbox" defaultChecked className="toggle-checkbox accent-orange-500 w-5 h-5"/>
                        </div>
                     </div>
                     
                     <button className="mt-8 text-red-600 font-bold text-sm hover:underline">Delete Account</button>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default UserProfilePage;