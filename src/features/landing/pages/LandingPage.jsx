import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import DeviceMockup from '../components/DeviceMockup';
import Footer from '../components/Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Kacha & Pakka Bills",
      description: "Create 'Kacha' drafts during negotiation. One click converts them to final 'Pakka' invoices, locking the data forever.",
      icon: "📄",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100"
    },
    {
      title: "Real-Time Sales Tracking",
      description: "Your dashboard updates instantly. Track revenue, pending payments, and profit margins without manual entry.",
      icon: "📊",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100"
    },
    {
      title: "AI Business Assistant",
      description: "Ask questions like 'Who is my best customer?' and get instant data-backed answers.",
      icon: "🤖",
      color: "bg-purple-50 text-purple-600",
      border: "border-purple-100"
    }
  ];

  const testimonials = [
    { name: "Rajesh Gupta", company: "Gupta Textiles", text: "I used to lose track of my Kacha bills. UdhyogSaathi solved this perfectly.", initial: "R" },
    { name: "Amit Patel", company: "Patel Polymers", text: "The AI assistant actually told me which customer was delaying payments.", initial: "A" },
    { name: "Sneha Reddy", company: "SR Manufacturing", text: "Finally, a simple dashboard. I check my sales on my phone every night.", initial: "S" }
  ];

  const navItems = [
    {
      label: "Features",
      onClick: () => {
        const element = document.getElementById('features');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      label: "Testimonials",
      onClick: () => {
        const element = document.getElementById('testimonials');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  ];

  const handleStartTrial = () => {
    // Navigate to signup page
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 overflow-x-hidden selection:bg-blue-100">
      
      {/* Navigation */}
      <Navbar 
        navItems={navItems}
        onCtaClick={handleStartTrial}
      />

      {/* Hero Section */}
      <HeroSection onCtaClick={handleStartTrial} />

      {/* Device Mockup */}
      <DeviceMockup />

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Core Features</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              UdhyogSaathi is built for simplicity. We don't overwhelm you with 100 buttons. We give you the 3 things your business actually needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Business Owners</h2>
            <p className="text-gray-500">Don't just take our word for it. Here is what other manufacturers say.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to transform your business?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of manufacturers who have streamlined their operations with UdhyogSaathi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStartTrial}
              className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-xl hover:bg-gray-100 transition-colors"
            >
              Start Free 14-Day Trial
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
            >
              Sign In to Account
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            No credit card required • Cancel anytime • Full access to all features
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;