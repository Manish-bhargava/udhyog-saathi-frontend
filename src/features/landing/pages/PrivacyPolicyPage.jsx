import React from 'react';
import { Shield, Lock, Eye, FileText, Globe, Database, Users, ShieldCheck, AlertTriangle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Features",
      onClick: () => navigate('/')
    },
    {
      label: "Pricing",
      onClick: () => navigate('/')
    },
    {
      label: "Home",
      onClick: () => navigate('/')
    }
  ];

  const handleStartTrial = () => {
    navigate('/signup');
  };

  const Navbar = () => (
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-lg">US</span>
          </div>
          <span className="font-bold text-gray-900 text-xl tracking-tight">UDHYOG<span className="text-blue-600">SAATHI</span></span>
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
          onClick={() => {/* Add mobile menu logic if needed */}}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );

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
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => navigate('/about-us')} className="hover:text-white transition-colors">About Us</button>
            <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Pricing</button>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} UdhyogSaathi Technologies. Made with ❤️ in India.
        </div>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />

      <header className="pt-32 pb-16 bg-gradient-to-b from-blue-50 to-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-black text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Effective Date: January 22, 2026 | Last Updated: January 22, 2026</p>
        </div>
      </header>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-blue max-w-none">
            <div className="space-y-12">
              {/* Introduction */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction and Scope</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Welcome to UdhyogSaathi ("we," "our," or "us"). This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our manufacturing management platform and services. We are committed to protecting your privacy and handling your data with transparency and care in compliance with applicable Indian laws, including the Information Technology Act, 2000, and its associated rules.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  This policy applies to all users of our platform, including visitors, registered businesses, and their authorized personnel. By accessing or using UdhyogSaathi, you consent to the practices described in this Privacy Policy.
                </p>
              </div>

              {/* Information Collection */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-3 text-blue-600" />
                  2. Information We Collect
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal and Business Information</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li><strong>Account Information:</strong> Name, email address, phone number, business name, and contact details.</li>
                      <li><strong>Business Details:</strong> GST number, PAN, business address, type of manufacturing unit, and industry classification.</li>
                      <li><strong>Financial Data:</strong> Bank account details for payment processing, transaction history, and invoice records.</li>
                      <li><strong>KYC Documents:</strong> Business registration certificates, partnership deeds, or incorporation documents as required.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Operational and Transactional Data</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li><strong>Invoice Data:</strong> Details of "Kacha" (provisional) and "Pakka" (final) bills including product details, quantities, prices, and tax calculations.</li>
                      <li><strong>Inventory Data:</strong> Raw material stock, finished goods inventory, and supply chain information.</li>
                      <li><strong>Customer/Vendor Data:</strong> Contact information of your business partners entered into the system.</li>
                      <li><strong>Usage Data:</strong> Log files, IP addresses, browser type, device information, and pages visited on our platform.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Purpose of Data Use */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-3 text-blue-600" />
                  3. How We Use Your Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  {[
                    {title: "Service Delivery", desc: "To provide and maintain our manufacturing management services"},
                    {title: "Invoice Generation", desc: "To create, manage, and store business invoices compliant with GST regulations"},
                    // {title: "Payment Processing", desc: "To facilitate transactions through integrated payment gateways"},
                    {title: "AI Analytics", desc: "To provide business insights and predictive analytics based on your data"},
                    {title: "Customer Support", desc: "To respond to inquiries and provide technical assistance"},
                    {title: "Platform Improvement", desc: "To enhance features and develop new functionality"}
                  ].map((item, index) => (
                    <div key={index} className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-blue-700">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Security */}
              <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200">
                <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
                  <ShieldCheck className="w-6 h-6 mr-3" />
                  4. Data Security Measures
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">Technical Safeguards</h3>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
                      <li>256-bit SSL encryption for data in transit</li>
                      <li>AES-256 encryption for data at rest</li>
                      <li>Regular security audits and vulnerability assessments</li>
                      {/* <li>Multi-factor authentication for administrative access</li> */}
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-2">Organizational Measures</h3>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
                      <li>Restricted access to sensitive data on a need-to-know basis</li>
                      <li>Regular employee training on data protection</li>
                      <li>Data protection impact assessments for new features</li>
                      <li>Incident response and breach notification procedures</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Data Sharing */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">When We Share Your Data</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li><strong>Service Providers:</strong> With trusted third parties like cloud hosting (AWS/Azure), payment processors (Razorpay), and analytics providers, under strict contractual agreements.</li>
                      <li><strong>Legal Requirements:</strong> When required by law, court order, or government authorities under applicable Indian laws.</li>
                      <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with appropriate privacy protections.</li>
                      <li><strong>With Your Consent:</strong> When you explicitly authorize us to share specific information.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      What We Never Do
                    </h3>
                    <p className="text-yellow-700">
                      We do not sell, rent, or trade your personal or business data to third parties for marketing purposes. We do not use your data for purposes unrelated to our services without your explicit consent.
                    </p>
                  </div>
                </div>
              </div>

              {/* User Rights */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {right: "Access Right", desc: "Request access to your personal data we hold"},
                    {right: "Correction Right", desc: "Request correction of inaccurate or incomplete data"},
                    {right: "Deletion Right", desc: "Request deletion of your data under certain conditions"},
                    {right: "Data Portability", desc: "Request transfer of your data to another service"},
                    {right: "Withdraw Consent", desc: "Withdraw consent for data processing where applicable"},
                    {right: "Object to Processing", desc: "Object to certain types of data processing"}
                  ].map((item, index) => (
                    <div key={index} className="border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">{item.right}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
                
                <p className="mt-6 text-gray-600 text-sm">
                  To exercise any of these rights, please contact our Data Protection Officer at <span className="text-blue-600 font-medium">krishnagoyal26112005@gmail.com</span>. We will respond within 30 days as required by law.
                </p>
              </div>

              {/* Data Retention */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention and Deletion</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Retention Periods</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-600">
                      <li><strong>Business Records:</strong> Retained for 8 years as required by Indian tax laws (GST and Income Tax)</li>
                      <li><strong>Account Information:</strong> Retained while your account is active and for 3 years after deactivation</li>
                      <li><strong>Transaction Data:</strong> Retained for 7 years for financial audit purposes</li>
                      <li><strong>Log Files:</strong> Retained for 1 year for security monitoring</li>
                    </ul>
                  </div>
                  
                  <p className="text-gray-600">
                    Upon account closure, we will anonymize or delete your data in accordance with our retention policy, except where retention is required by law or for legitimate business purposes.
                  </p>
                </div>
              </div>

              {/* International Data Transfer */}
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-blue-600" />
                  8. International Data Transfers
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Your data is primarily processed and stored on servers located in India. In cases where data needs to be transferred outside India (for example, for certain cloud services), we ensure adequate safeguards are in place through Standard Contractual Clauses or other approved mechanisms, and we comply with Indian data protection requirements.
                </p>
              </div>

              {/* Updates and Contact */}
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Policy Updates</h2>
                    <p className="text-gray-600">
                      We may update this Privacy Policy periodically. We will notify you of significant changes by email or through platform notifications. The "Last Updated" date at the top indicates when revisions were made.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <Mail className="w-6 h-6 mr-3 text-blue-600" />
                      10. Contact Us
                    </h2>
                    <p className="text-gray-600 mb-2">
                      For privacy-related questions or concerns:
                    </p>
                    <p className="text-blue-600 font-medium">
                      {/* Data Protection Officer<br /> */}
                      UdhyogSaathi Technologies<br />
                      Email: krishnagoyal26112005@gmail.com<br />
                      Phone: +91-9064700906
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;