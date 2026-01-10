import React, { useState } from 'react';
import Logo from './Logo';
import { useScroll } from '../hooks/useScroll';

const Navbar = ({ 
  navItems = [],
  onLogoClick = () => window.scrollTo(0, 0),
  onCtaClick = () => {}
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrolled } = useScroll(20);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={onLogoClick}>
            <Logo />
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-xl tracking-tight leading-none">
                UDHYOG<span className="text-blue-600">SAATHI</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mt-0.5">
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
              onClick={onCtaClick}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-lg shadow-blue-600/20 transition-transform transform hover:-translate-y-0.5"
            >
              Start Free Trial
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
              className="block w-full text-left font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {item.label}
            </button>
          ))}
          <button 
            onClick={onCtaClick}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;