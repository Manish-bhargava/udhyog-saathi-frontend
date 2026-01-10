import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <Logo size="small" />
            <span className="font-bold text-xl tracking-tight">
              UDHYOG<span className="text-blue-500">SAATHI</span>
            </span>
          </div>
          <div className="flex space-x-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} UdhyogSaathi Technologies. Made in India.
        </div>
      </div>
    </footer>
  );
};

export default Footer;