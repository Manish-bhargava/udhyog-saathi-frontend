import React from 'react';
import Logo from './Logo';

const DeviceMockup = () => {
  return (
    <div className="relative mt-8 h-[300px] md:h-[650px] w-full max-w-6xl mx-auto flex items-end justify-center">
      
      {/* LAPTOP MOCKUP */}
      <div className="relative w-full md:w-[85%] z-10 transform transition-transform duration-500 hover:scale-[1.01]">
        {/* Lid / Screen Frame */}
        <div className="bg-gray-900 rounded-t-[0.5rem] md:rounded-t-[1.5rem] p-2 md:p-3 pb-0 shadow-2xl relative">
          {/* Camera */}
          <div className="absolute top-1 md:top-2 left-1/2 -translate-x-1/2 w-8 md:w-16 h-1 bg-black rounded-full z-20"></div>
          
          {/* SCREEN CONTENT */}
          <div className="bg-gray-100 aspect-[16/10] w-full rounded-t-sm md:rounded-t-lg overflow-hidden flex">
            
            {/* Sidebar (Dark Blue) */}
            <div className="w-[240px] hidden md:flex bg-slate-900 flex-col py-6 px-4 space-y-6">
              {/* Sidebar Logo */}
              <div className="flex items-center space-x-3 text-white mb-4">
                <Logo size="small" invert={true} />
                <span className="font-bold text-lg">UdhyogSaathi</span>
              </div>
              {/* Menu Items */}
              <div className="space-y-1">
                {['Dashboard', 'Kacha Bills', 'Pakka Bills', 'Inventory', 'Customers', 'AI Assistant'].map((item, i) => (
                  <div key={item} className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center cursor-pointer ${i === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                    <div className={`w-4 h-4 rounded mr-3 ${i===0 ? 'bg-white/30' : 'bg-slate-600'}`}></div>
                    {item}
                  </div>
                ))}
              </div>
              {/* Bottom User Profile */}
              <div className="mt-auto pt-6 border-t border-slate-700 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                <div className="text-xs text-slate-400">
                  <div className="text-white font-medium">John Doe</div>
                  <div>Admin</div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-8">
              {/* Top Header */}
              <div className="flex justify-between items-center mb-4 md:mb-8">
                <h2 className="text-lg md:text-2xl font-bold text-gray-800">Overview</h2>
                <div className="flex space-x-2 md:space-x-4">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 text-xs">🔔</div>
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white border flex items-center justify-center text-gray-400 text-xs">🔍</div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-8">
                <div className="bg-white p-2 md:p-5 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 text-[8px] md:text-xs font-bold uppercase mb-1 md:mb-2">Total Sales</div>
                  <div className="text-sm md:text-3xl font-black text-gray-900">₹1.42L</div>
                  <div className="text-green-500 text-[8px] md:text-xs mt-1 font-medium">↑ 12%</div>
                </div>
                <div className="bg-white p-2 md:p-5 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 text-[8px] md:text-xs font-bold uppercase mb-1 md:mb-2">Customers</div>
                  <div className="text-sm md:text-3xl font-black text-gray-900">102</div>
                  <div className="text-blue-500 text-[8px] md:text-xs mt-1 font-medium">+5 New</div>
                </div>
                <div className="bg-white p-2 md:p-5 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 text-[8px] md:text-xs font-bold uppercase mb-1 md:mb-2">Pending</div>
                  <div className="text-sm md:text-3xl font-black text-gray-900">12</div>
                  <div className="text-orange-500 text-[8px] md:text-xs mt-1 font-medium">Action</div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="bg-white p-3 md:p-6 rounded-lg md:rounded-xl shadow-sm border border-gray-100 mb-4 md:mb-8">
                <div className="flex justify-between items-center mb-2 md:mb-6">
                  <h3 className="font-bold text-gray-800 text-xs md:text-base">Order Summary</h3>
                  <span className="text-[8px] md:text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">2024</span>
                </div>
                <div className="h-20 md:h-40 flex items-end justify-between px-1 md:px-2 space-x-1 md:space-x-2">
                  {[30, 45, 25, 60, 75, 50, 80, 40, 55, 70, 65, 90].map((h, i) => (
                    <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group hover:bg-blue-600 transition-colors" style={{height: `${h}%`}}></div>
                  ))}
                </div>
              </div>

              {/* Recent Order Table */}
              <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-4 py-2 md:px-6 md:py-4 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 text-xs md:text-base">Recent Orders</h3>
                </div>
                <div className="p-0">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-[8px] md:text-xs uppercase font-semibold">
                      <tr>
                        <th className="px-2 py-2 md:px-6 md:py-3">ID</th>
                        <th className="px-2 py-2 md:px-6 md:py-3">Customer</th>
                        <th className="px-2 py-2 md:px-6 md:py-3 text-right">Amt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-[10px] md:text-sm">
                      {[
                        {id: '#001', name: 'Floyd Miles', amt: '4,800'},
                        {id: '#002', name: 'Arlene McCoy', amt: '2,400'},
                        {id: '#003', name: 'Theresa W', amt: '9,100'},
                      ].map((row, i) => (
                        <tr key={i}>
                          <td className="px-2 py-2 md:px-6 md:py-4 text-blue-600 font-medium">{row.id}</td>
                          <td className="px-2 py-2 md:px-6 md:py-4">{row.name}</td>
                          <td className="px-2 py-2 md:px-6 md:py-4 text-right font-mono">₹{row.amt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Laptop Bottom Chassis */}
        <div className="bg-gray-800 h-2 md:h-5 w-[102%] -ml-[1%] rounded-b-lg md:rounded-b-xl shadow-xl relative flex justify-center">
          <div className="w-1/4 h-1/2 bg-gray-700 rounded-b-md"></div>
        </div>
      </div>

      {/* PHONE MOCKUP */}
      <div className="hidden md:block absolute bottom-0 right-4 md:-right-4 z-20 w-[160px] md:w-[240px] transform hover:-translate-y-2 transition-transform duration-300">
        <div className="bg-gray-900 rounded-[2.5rem] p-2 md:p-3 shadow-2xl border-4 border-gray-800">
          <div className="bg-white rounded-[2rem] overflow-hidden h-[320px] md:h-[480px] relative flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-20"></div>
            
            {/* Phone Header */}
            <div className="pt-8 px-4 pb-4 flex justify-between items-center bg-white">
              <div>
                <p className="text-xs text-gray-500">Hello,</p>
                <h4 className="font-bold text-gray-800">John Doe</h4>
              </div>
              <Logo size="small" />
            </div>

            {/* Phone Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 no-scrollbar">
              
              {/* Total Orders Card */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 text-xs mb-1">Your Total Orders</p>
                <h2 className="text-4xl font-black text-blue-600">14</h2>
                <div className="flex justify-center space-x-4 mt-4 text-xs">
                  <div className="bg-green-50 text-green-700 px-2 py-1 rounded">12 Completed</div>
                  <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded">2 Pending</div>
                </div>
              </div>

              {/* Banner */}
              <div className="bg-gradient-to-r from-teal-400 to-emerald-500 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <p className="font-bold text-sm">Save Big on Time!</p>
                  <p className="text-xs opacity-90 mb-2">Use AI for auto-billing.</p>
                  <button className="bg-white text-teal-600 text-[10px] font-bold px-2 py-1 rounded">Try Now &gt;</button>
                </div>
                <div className="absolute right-0 bottom-0 w-16 h-16 bg-white opacity-20 rounded-full translate-x-4 translate-y-4"></div>
              </div>

              {/* Recent Orders List */}
              <div>
                <h5 className="font-bold text-gray-800 text-sm mb-2">Recent Order</h5>
                <div className="space-y-3">
                  {/* Order 1 */}
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-lg">🛢️</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-800">Order #1</p>
                      <p className="text-[10px] text-gray-500">2x Industrial Oil</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold">₹1000</p>
                      <p className="text-[10px] text-green-500 font-bold">Confirmed</p>
                    </div>
                  </div>
                  {/* Order 2 */}
                  <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">📦</div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-800">Order #2</p>
                      <p className="text-[10px] text-gray-500">5x Packaging</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold">₹2500</p>
                      <p className="text-[10px] text-orange-500 font-bold">Draft</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Bottom Nav */}
            <div className="bg-white border-t px-6 py-3 flex justify-between items-center text-2xl text-gray-300">
              <span className="text-blue-600">⌂</span>
              <span>🔍</span>
              <span>👤</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceMockup;