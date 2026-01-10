import React from 'react';
import Button from '../../auth/components/Button';

const HeroSection = ({ onCtaClick = () => {} }) => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 bg-white">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 clip-path-polygon hidden lg:block"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-tight mb-6">
            You have a business, <br />
            you need a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Saathi</span>.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The complete operating system for B2B manufacturers. Manage Kacha/Pakka bills, sales, and AI insights in one powerful dashboard.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={onCtaClick}
              variant="primary"
              size="lg"
              className="px-8 py-4 shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;