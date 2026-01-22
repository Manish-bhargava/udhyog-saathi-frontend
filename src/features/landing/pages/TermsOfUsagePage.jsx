import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, CheckCircle, AlertTriangle, Clock, Shield, FileText, Smartphone, CreditCard, XCircle, Users, Mail } from 'lucide-react';

const TermsOfUsage = () => {
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

      <header className="pt-32 pb-16 bg-gradient-to-b from-slate-50 to-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <Gavel className="w-12 h-12 text-gray-900 mx-auto mb-4" />
          <h1 className="text-4xl font-black text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Effective: January 22, 2026 | Governing Law: Laws of India</p>
        </div>
      </header>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-10">
            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-yellow-800 text-lg mb-2">Important Notice</h3>
                  <p className="text-yellow-700">
                    Please read these Terms of Service carefully. By accessing or using UdhyogSaathi, you agree to be bound by these terms. If you disagree with any part, you may not use our services.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                1. Agreement and Acceptance
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  These Terms of Service ("Terms") constitute a legally binding agreement between UdhyogSaathi Technologies ("Company," "we," "us," or "our") and you ("User," "you," or "your"). By registering for, accessing, or using the UdhyogSaathi platform (the "Service"), you acknowledge that you have read, understood, and agree to be bound by these Terms.
                </p>
                <p>
                  The Service is designed specifically for business-to-business (B2B) manufacturing entities operating in India, but as we are still improving so all type of business user are welcomed. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Eligibility Requirements:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>You must be at least 18 years old</li>
                    <li>You must have legal capacity to enter into contracts in India</li>
                    <li>You must provide accurate and complete registration information</li>
                    <li>You must have a valid GST registration if required by Indian law</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <CreditCard className="w-6 h-6 mr-3 text-blue-600" />
                2. Subscription Plans and Payment Terms
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Subscription Models</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                    //   {plan: "Free Trial", desc: "14-day trial with limited features"},
                      {plan: "Pro", desc: "Unlimited conversations with AI assistant and all other existing features"},
                    //   {plan: "Enterprise Plan", desc: "Custom pricing for large manufacturers"}
                    ].map((item, index) => (
                      <div key={index} className="border border-gray-200 p-4 rounded-lg">
                        <h4 className="font-bold text-gray-800">{item.plan}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment Terms</h3>
                  <ul className="space-y-3">
                    {[
                      {text: "All prices are exclusive of applicable GST (18%) unless specified otherwise", icon: CheckCircle},
                      {text: "Automatic renewal unless cancelled 7 days before billing cycle", icon: Clock},
                      {text: "Payments processed through Razorpay with PCI-DSS compliance", icon: Shield},
                      {text: "No refunds for partial months or unused services", icon: XCircle}
                    ].map((item, i) => (
                      <li key={i} className="flex items-start text-gray-600">
                        <item.icon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <h4 className="font-semibold text-yellow-800 mb-2">Late Payment Policy</h4>
                  <p className="text-yellow-700 text-sm">
                    Accounts overdue by more than 15 days may be suspended. A reinstatement fee may apply. Persistent non-payment may result in termination of service.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-blue-600" />
                3. User Responsibilities and Conduct
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Mandatory Obligations</h3>
                  <ul className="list-disc pl-5 space-y-3 text-gray-600">
                    <li><strong>Accuracy of Information:</strong> You are solely responsible for the accuracy and completeness of all data, including invoices, inventory records, and tax calculations entered into the platform.</li>
                    <li><strong>GST Compliance:</strong> You must ensure all invoices generated comply with the Goods and Services Tax Act, 2017, and relevant state regulations.</li>
                    <li><strong>Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.</li>
                    <li><strong>Legal Compliance:</strong> You must use the Service in compliance with all applicable Indian laws, including but not limited to the Companies Act, Income Tax Act, and FEMA regulations.</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-2">Prohibited Activities</h4>
                  <ul className="list-disc pl-5 space-y-1 text-red-700">
                    <li>Using the service for illegal or fraudulent activities</li>
                    <li>Attempting to bypass security measures or access unauthorized areas</li>
                    <li>Uploading malicious code or engaging in hacking attempts</li>
                    <li>Sharing account credentials with unauthorized users</li>
                    <li>Using the platform to generate fake or fraudulent invoices</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Shield className="w-6 h-6 mr-3 text-blue-600" />
                4. Intellectual Property Rights
              </h2>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  UdhyogSaathi and its licensors own all intellectual property rights in the platform, including but not limited to software, designs, logos, trademarks, and documentation. These Terms grant you a limited, non-exclusive, non-transferable license to use the Service for your internal business purposes only.
                </p>
                <p>
                  You retain ownership of your business data. However, you grant us a worldwide, royalty-free license to use, process, and store your data solely for the purpose of providing and improving the Service.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-700 font-medium">
                    Any feedback, suggestions, or improvements you provide may be used by UdhyogSaathi without obligation or compensation.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">5. Service Level Agreement (SLA) and Availability</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Uptime Commitment</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-2">No commitments as we still improving</p>
                    <p className="text-sm text-gray-600">Monthly uptime excluding scheduled maintenance</p>
                  </div>
                  
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Support Response</h4>
                    <p className="text-3xl font-bold text-blue-600 mb-2">24 hours</p>
                    <p className="text-sm text-gray-600">Maximum response time for critical issues</p>
                  </div>
                </div>
                
                {/* <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Scheduled Maintenance</h4>
                  <p className="text-gray-600">
                    We may perform scheduled maintenance during non-business hours (10:00 PM to 6:00 AM IST). We will provide at least 48 hours notice for any extended maintenance periods.
                  </p>
                </div> */}
              </div>
            </div>

            {/* Section 6 */}
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">6. Limitations of Liability and Disclaimers</h2>
              
              <div className="space-y-6 text-gray-600">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <h4 className="font-semibold text-red-800 mb-2">Important Disclaimer</h4>
                  <p className="text-red-700">
                    UdhyogSaathi is a business management tool and does not provide legal, tax, or financial advice yet (we are working on that). You should consult with qualified professionals for advice specific to your business circumstances.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>To the maximum extent permitted by law, our total liability shall not exceed the fees paid by you in the 6 months preceding the claim.</li>
                    <li>We are not liable for indirect, incidental, consequential, or punitive damages.</li>
                    <li>We are not responsible for losses due to factors beyond our reasonable control (force majeure).</li>
                    <li>We do not guarantee uninterrupted or error-free service.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">7. Termination and Suspension</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Grounds for Termination</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Breach of these Terms</li>
                      <li>Non-payment of fees</li>
                      <li>Illegal or fraudulent activity</li>
                      <li>At our discretion with 30 days notice</li>
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-800 mb-2">Upon Termination</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600">
                      <li>Immediate cessation of service access</li>
                      <li>Data retention per Privacy Policy</li>
                      <li>Outstanding fees become due immediately</li>
                      <li>Export data available for 30 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8 
            {/* <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6">8. Governing Law and Dispute Resolution</h2>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>
                <p>
                  Any disputes arising from these Terms shall first be attempted to be resolved through good faith negotiations. If unresolved within 30 days, the dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">Arbitration Details</h4>
                  <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>Venue: Jaipur, Rajasthan, India</li>
                    <li>Language: English</li>
                    <li>Number of Arbitrators: One</li>
                    <li>Arbitration costs shared equally</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 9 
            <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-blue-600" />
                9. Contact and Amendments
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-800 mb-1"><strong>Legal Department</strong></p>
                    <p className="text-gray-600 mb-1">UdhyogSaathi Technologies Private Limited</p>
                    <p className="text-gray-600 mb-1">Email: legal@udhyogsaathi.com</p>
                    <p className="text-gray-600">Phone: +91-XXXXXXXXXX</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Amendments to Terms</h3>
                  <p className="text-gray-600">
                    We reserve the right to modify these Terms at any time. Material changes will be communicated via email or platform notification at least 30 days before they take effect. Continued use of the Service after changes constitutes acceptance of the revised Terms.
                  </p>
                </div>
              </div>
            </div> */}

            {/* Acceptance */}
            <div className="bg-green-50 border border-green-200 p-8 rounded-3xl text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-4">Acceptance of Terms</h3>
              <p className="text-gray-600 mb-6">
                By clicking "I Agree" during registration or by using UdhyogSaathi, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service in their entirety.
              </p>
              <p className="text-sm text-gray-500">
                Last Updated: January 22, 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfUsage;