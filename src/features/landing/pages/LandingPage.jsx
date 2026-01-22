import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Building } from 'lucide-react';

// Helper to load Razorpay Script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      title: "Kacha & Pakka Bills",
      description: "Create draft 'Kacha' bills during negotiation, convert to final 'Pakka' GST invoices with one click. Perfect for Indian manufacturing workflows.",
      icon: "📄",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100"
    },
    {
      title: "Real-Time Sales Dashboard",
      description: "Track revenue, pending payments, profit margins in real-time. Get instant insights without manual data entry.",
      icon: "📊",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100"
    },
    {
      title: "AI Business Assistant",
      description: "Ask questions like 'Who are my top customers?' or 'What products are selling best?' Get data-backed answers instantly.",
      icon: "🤖",
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100"
    },
    {
      title: "Inventory Management",
      description: "Track raw materials and finished goods. Get low-stock alerts and optimize your supply chain.",
      icon: "📦",
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100"
    },
    {
      title: "Customer Management",
      description: "Maintain complete customer profiles, track order history, and manage credit limits efficiently.",
      icon: "👥",
      color: "bg-indigo-50 text-indigo-600",
      border: "border-indigo-100"
    },
    {
      title: "Mobile & Desktop Sync",
      description: "Access your dashboard on any device. Create bills on desktop, check sales on mobile—everything stays in sync.",
      icon: "📱",
      color: "bg-rose-50 text-rose-600",
      border: "border-rose-100"
    }
  ];

  const testimonials = [
    { 
      name: "Rajesh Gupta", 
      company: "Gupta Textiles Pvt. Ltd.", 
      text: "As a textile manufacturer, I used to lose track of Kacha bills during client negotiations. UdhyogSaathi solved this perfectly. Now I can create drafts instantly and convert them to GST invoices with one click.",
      initial: "RG"
    },
    { 
      name: "Amit Patel", 
      company: "Patel Polymers & Packaging", 
      text: "The AI assistant actually helps me make decisions. Last month it identified a customer who was consistently delaying payments. We adjusted their credit terms and improved our cash flow by 22%.",
      initial: "AP"
    },
    { 
      name: "Sneha Reddy", 
      company: "SR Manufacturing Unit", 
      text: "Finally, a simple dashboard that actually works. I check my sales on my phone every night. The real-time tracking has helped us reduce inventory costs by 15%.",
      initial: "SR"
    },
    { 
      name: "Vikram Singh", 
      company: "Singh Engineering Works", 
      text: "The Kacha to Pakka conversion feature saves us hours each week. No more manual re-entry of data. The GST calculations are always accurate.",
      initial: "VS"
    },
    { 
      name: "Priya Sharma", 
      company: "Sharma Metal Fabrication", 
      text: "Being able to access everything on mobile has been a game-changer. I can create bills from the factory floor and send them immediately to clients.",
      initial: "PS"
    }
  ];

  const navItems = [
    {
      label: "Features",
      onClick: () => {
        const element = document.getElementById('features');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      label: "Testimonials",
      onClick: () => {
        const element = document.getElementById('testimonials');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      label: "Pricing",
      onClick: () => {
        const element = document.getElementById('pricing');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  ];

  const PLANS = [
    {
      id: "starter",
      name: "Starter",
      price: "₹1",
      period: "/month",
      description: "Perfect for small manufacturing units.",
      icon: Zap,
      color: "bg-blue-50 text-blue-600",
      features: ["Up to 100 bills/month", "Basic Inventory Tracking", "Email Support", "Mobile App Access"],
      recommended: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹99",
      period: "/month",
      description: "For growing manufacturing businesses.",
      icon: Crown,
      color: "bg-purple-50 text-purple-600",
      features: ["Unlimited Bills", "Advanced Inventory", "Priority Support", "AI Assistant", "Multi-User Access", "GST Reports"],
      recommended: true,
    },
    {
      id: "business",
      name: "Enterprise",
      price: "₹1,999",
      period: "/month",
      description: "For large manufacturing units & factories.",
      icon: Building,
      color: "bg-orange-50 text-orange-600",
      features: ["Everything in Pro", "Custom Workflows", "Dedicated Account Manager", "API Access", "On-Premise Deployment", "Training Sessions"],
      recommended: false,
    },
  ];

  const stats = [
    { value: "50+", label: "Active Manufacturers" },
    { value: "₹2.5Cr+", label: "Monthly Transactions" },
    { value: "10,000+", label: "Bills Created" },
    { value: "98%", label: "Customer Satisfaction" }
  ];

  const handleStartTrial = () => {
    navigate('/signup');
  };

  const handleScheduleDemo = () => {
    navigate('/demo-request');
  };

  const handleSubscribe = async (plan) => {
    setLoadingPlanId(plan.id);
    
    try {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      if (!userString) {
        alert("Please login first to subscribe!");
        navigate('/signup');
        setLoadingPlanId(null);
        return;
      }

      const user = JSON.parse(userString);
      
      // For demo purposes - in production, you'd integrate with your payment gateway
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Payment gateway failed to load.");
        setLoadingPlanId(null);
        return;
      }

      // Mock payment flow for demo
      setTimeout(() => {
        alert(`Successfully subscribed to ${plan.name} plan! You'll be redirected to setup.`);
        navigate('/dashboard');
        setLoadingPlanId(null);
      }, 1500);

    } catch (error) {
      console.error("Subscription Error:", error);
      alert("An error occurred. Please try again.");
      setLoadingPlanId(null);
    }
  };

  const handleChoosePlan = (plan) => {
    const user = localStorage.getItem("user");
    if (user) {
      handleSubscribe(plan);
    } else {
      navigate('/signup', { state: { selectedPlan: plan.id } });
    }
  };

  // Navbar Component
  const Navbar = () => (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">US</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-xl tracking-tight leading-none">
                UDHYOG<span className="text-blue-600">SAATHI</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                Business Partner
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button 
              onClick={handleStartTrial}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-all transform hover:-translate-y-0.5"
            >
              Get Started Free
            </button>
          </div>

          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full z-50 p-4 space-y-4">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                setIsMenuOpen(false);
              }}
              className="block w-full text-left font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={handleStartTrial}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Start now!
          </button>
        </div>
      )}
    </nav>
  );

  // HeroSection Component
  const HeroSection = () => (
    <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-white to-blue-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/30 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
            <span className="flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Trusted by 50+ B2B Manufacturers
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            Stop Managing Bills, Start
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Growing Your Business
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            UdhyogSaathi is the complete operating system for Indian manufacturers. 
            Seamlessly manage Kacha drafts, convert to GST invoices, track sales in real-time, 
            and get AI-powered insights—all in one intuitive dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
              onClick={handleStartTrial}
              className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
            >
              Start now!
            </button>
            <button
              onClick={handleScheduleDemo}
              className="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all"
            >
              View Live Demo
            </button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              No credit card required
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Full access to all features
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // FeatureCard Component
  const FeatureCard = ({ feature, index }) => {
    const { title, description, icon, color, border } = feature;
    
    return (
      <div className={`bg-white rounded-xl p-6 border ${border} shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 text-2xl shadow-sm`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
      </div>
    );
  };

  // TestimonialCard Component
  const TestimonialCard = ({ testimonial }) => {
    const { name, company, text, initial } = testimonial;
    
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
            {initial}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{name}</h4>
            <p className="text-xs text-gray-500">{company}</p>
          </div>
        </div>
        <p className="text-gray-600 leading-relaxed text-sm">"{text}"</p>
        <div className="mt-3 flex text-yellow-400 text-sm">★★★★★</div>
      </div>
    );
  };

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">US</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              UDHYOG<span className="text-blue-400">SAATHI</span>
            </span>
          </div>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} UdhyogSaathi Technologies. Made with ❤️ in India.
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-2 md:p-0">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Everything You Need to Run Your Manufacturing Business</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Designed specifically for Indian manufacturers. No complex features, just what you actually need to manage your business efficiently.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">See It In Action</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              A unified dashboard that works seamlessly across all your devices
            </p>
          </div>
          
          {/* Desktop Preview Container */}
          <div className="hidden lg:block mb-8 md:mb-12">
            <div className="relative max-w-5xl mx-auto">
              {/* Browser Frame */}
              <div className="bg-gray-800 rounded-t-lg pt-2">
                <div className="flex items-center px-4 pb-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1 text-center text-xs text-gray-300">
                    app.udhyogsaathi.com/dashboard
                  </div>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="bg-white rounded-b-lg shadow-2xl overflow-hidden">
                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-48 md:w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-3 md:p-4">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-6 md:mb-8">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                        <span className="text-lg md:text-xl font-bold">U</span>
                      </div>
                      <div>
                        <div className="font-bold uppercase text-xs md:text-sm">Udhyog Saathi</div>
                        <div className="text-xs text-slate-400">Business Suite</div>
                      </div>
                    </div>
                    
                    <nav className="space-y-1 md:space-y-2">
                      {['📊 Dashboard', '📄 Bills', '🤖 AI Assistant', '📈 Reports', '₹ Billing'].map((item) => (
                        <div key={item} className="flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer">
                          <span className="text-sm md:text-base">{item.split(' ')[0]}</span>
                          <span className="text-xs md:text-sm">{item.split(' ')[1]}</span>
                        </div>
                      ))}
                    </nav>
                  </div>
                  
                  {/* Main Content */}
                  <div className="flex-1 p-4 md:p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-2">
                      <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
                      <div className="flex space-x-2 md:space-x-4">
                        <button className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-900 text-white rounded-lg text-xs md:text-sm">
                          New Bill
                        </button>
                      </div>
                    </div>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                      <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs md:text-sm text-gray-500 mb-1">Total Revenue</div>
                        <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">₹1.42L</div>
                        <div className="text-xs text-green-600 mt-1">↑ 12% this month</div>
                      </div>
                      <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs md:text-sm text-gray-500 mb-1">Customers</div>
                        <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">102</div>
                        <div className="text-xs text-blue-600 mt-1">+5 new</div>
                      </div>
                      <div className="bg-white p-3 md:p-4 rounded-lg border border-gray-200 shadow-sm">
                        <div className="text-xs md:text-sm text-gray-500 mb-1">Pending Bills</div>
                        <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">12</div>
                        <div className="text-xs text-amber-600 mt-1">Action needed</div>
                      </div>
                    </div>
                    
                    {/* Recent Orders Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 text-sm md:text-base">Recent Orders</h3>
                      </div>
                      <div className="p-0">
                        <table className="w-full text-xs md:text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs text-gray-500">ID</th>
                              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs text-gray-500">Customer</th>
                              <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs text-gray-500">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {id: '#001', name: 'Floyd Miles', amt: '4,800'},
                              {id: '#002', name: 'Arlene McCoy', amt: '2,400'},
                              {id: '#003', name: 'Theresa W', amt: '9,100'},
                            ].map((row, i) => (
                              <tr key={i} className="border-b border-gray-100 last:border-0">
                                <td className="px-3 md:px-6 py-2 md:py-4 text-blue-600 font-medium">{row.id}</td>
                                <td className="px-3 md:px-6 py-2 md:py-4">{row.name}</td>
                                <td className="px-3 md:px-6 py-2 md:py-4 font-mono">₹{row.amt}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Preview Container */}
          <div className="lg:hidden mb-8 md:mb-12">
            <div className="flex justify-center">
              <div className="relative w-72">
                {/* Phone Frame */}
                <div className="bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-2 shadow-2xl border-4 border-gray-800">
                  <div className="bg-white rounded-4xl overflow-hidden relative flex flex-col h-[400px] md:h-[500px]">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-20 h-4 md:h-5 bg-black rounded-b-xl z-20"></div>
                    
                    {/* Phone Header */}
                    <div className="pt-6 md:pt-8 px-3 md:px-4 pb-3 md:pb-4 bg-white border-b">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Hello,</p>
                          <h4 className="font-bold text-gray-800 text-sm md:text-base">John Doe</h4>
                        </div>
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                          US
                        </div>
                      </div>
                    </div>

                    {/* Phone Content */}
                    <div className="flex-1 overflow-y-auto px-3 md:px-4 py-3 md:py-4 space-y-3 md:space-y-4">
                      {/* Stats Card */}
                      <div className="bg-blue-50 p-3 md:p-4 rounded-xl md:rounded-2xl border border-blue-100">
                        <p className="text-gray-500 text-xs mb-1">Your Total Orders</p>
                        <h2 className="text-2xl md:text-3xl font-black text-blue-600">14</h2>
                        <div className="flex justify-between mt-2 md:mt-3 text-xs">
                          <div className="bg-green-100 text-green-700 px-2 py-1 rounded">12 Completed</div>
                          <div className="bg-amber-100 text-amber-700 px-2 py-1 rounded">2 Pending</div>
                        </div>
                      </div>

                      {/* Recent Order */}
                      <div>
                        <h5 className="font-bold text-gray-800 text-xs md:text-sm mb-2 md:mb-3">Recent Order</h5>
                        <div className="space-y-2 md:space-y-3">
                          <div className="bg-white p-2 md:p-3 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-2 md:space-x-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              📦
                            </div>
                            <div className="flex-1">
                              <p className="text-xs md:text-sm font-bold text-gray-800">Order #001</p>
                              <p className="text-xs text-gray-500">Industrial Oil × 2</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs md:text-sm font-bold">₹1000</p>
                              <p className="text-xs text-green-600 font-bold">Paid</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Nav */}
                    <div className="bg-white border-t px-4 md:px-6 py-2 md:py-3 flex justify-between items-center text-lg md:text-xl text-gray-400">
                      <span className="text-blue-600">⌂</span>
                      <span>📄</span>
                      <span>🔍</span>
                      <span>👤</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Trusted by Indian Manufacturers</h2>
            <p className="text-gray-600 text-sm md:text-base">See what business owners like you are saying</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">
              Choose the perfect plan for your manufacturing business. No hidden fees, no surprises.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {PLANS.map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-2xl border flex flex-col transition-all duration-300 hover:-translate-y-1
                  ${plan.recommended 
                    ? "border-blue-200 shadow-lg shadow-blue-600/10 md:scale-105 z-10" 
                    : "border-gray-100 shadow-sm"
                  }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-6 md:p-8 flex-1">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${plan.color}`}>
                    <plan.icon className="w-6 h-6" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 leading-relaxed">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl md:text-4xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-400 font-medium">{plan.period}</span>
                  </div>

                  {/* Features List */}
                  <div className="w-full h-px bg-gray-100 mb-6" />
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="p-6 md:p-8 pt-0 mt-auto">
                  <button
                    onClick={() => handleChoosePlan(plan)}
                    disabled={loadingPlanId !== null}
                    className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center
                      ${plan.recommended 
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg" 
                        : "bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200"
                      }
                      ${loadingPlanId === plan.id ? "opacity-75 cursor-not-allowed" : ""}
                    `}
                  >
                    {loadingPlanId === plan.id ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : plan.recommended ? (
                      "Start now!"
                    ) : (
                      "Choose Plan"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Note */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              All plans include 14-day free trial • No credit card required • Cancel anytime
            </p>
            <p className="text-gray-400 text-xs mt-2">
              GST applicable as per Indian tax regulations
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready to Transform Your Manufacturing Business?
          </h2>
          <p className="text-blue-100 text-base md:text-lg mb-6 md:mb-8">
            Join 50+ manufacturers who have streamlined their operations with UdhyogSaathi
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={handleStartTrial}
              className="px-6 md:px-8 py-3 md:py-4 bg-white text-blue-600 font-bold rounded-lg md:rounded-xl shadow-xl hover:bg-gray-50 transition-all text-sm md:text-base"
            >
              Start Free
            </button>
            <button
              onClick={handleScheduleDemo}
              className="px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg md:rounded-xl hover:bg-white/10 transition-all text-sm md:text-base"
            >
              Schedule a Demo
            </button>
          </div>
          <p className="text-blue-200 text-xs md:text-sm mt-4 md:mt-6">
            No credit card required • Full access to all features • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;