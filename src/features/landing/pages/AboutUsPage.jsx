import React from 'react';
import { Mail, Phone, MessageSquare, User, Shield, Rocket, Linkedin, Github, Code, Database, Cpu, Palette, Globe, Award, BookOpen, Lightbulb, Zap, Users, Target, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
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
    <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
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
          onClick={() => {/* Add mobile menu logic */}}
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
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
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

  const developers = [
    {
      id: 1,
      initials: "KG",
      name: "Krishna Goyal",
      role: "Founder & Director",
      futureRole: "Leading CMO Operations",
      email: "krishnagoyal26112005@gmail.com",
      phone: "+91 9064700906",
      education: "B.Tech Computer Science (Specialization in Data Analytics)",
      university: "Vellore Institute of Technology, Andra Pradesh",
      skills: ["Market Strategy", "Brand Development", "React.js", "UI/UX Design", "Growth Hacking"],
      bio: "As Founder and Director, Krishna currently spearheads all CMO operations. He drives the brand narrative, market expansion, and strategic partnerships, ensuring UdhyogSaathi reaches every manufacturer in India while maintaining the product's core vision.",
      social: {
        linkedin: "", // Left blank as requested
        github: "#",
        twitter: "#"
      },
      color: "from-blue-600 to-blue-500",
      icon: Megaphone,
      currentFocus: "Marketing strategy, brand growth, and user acquisition",
      contributions: [
        "Leads marketing and branding strategies",
        "Defines product roadmap and vision",
        "Manages investor and client relations",
        "Oversees user experience and design"
      ]
    },
    {
      id: 2,
      initials: "MB",
      name: "Manish Bhargava",
      role: "Founder & Director",
      futureRole: "Leading CTO Operations",
      email: "bhargavmanish908@gmail.com",
      phone: "+91 6376169979",
      education: "B.Tech Computer Science",
      university: "Vellore Institute of Technology, Andra Pradesh",
      skills: ["System Architecture", "Cloud Infrastructure", "Node.js", "Scalability", "Security"],
      bio: "As Founder and Director, Manish currently oversees all CTO operations. He acts as the technical backbone of the company, architecting scalable solutions, managing the engineering team, and ensuring the platform's security and reliability.",
      social: {
        linkedin: "", // Left blank as requested
        github: "#",
        twitter: "#"
      },
      color: "from-green-600 to-green-500",
      icon: Cpu,
      currentFocus: "Technical architecture, system scaling, and R&D",
      contributions: [
        "Leads overall technical strategy",
        "Architects scalable cloud infrastructure",
        "Manages development lifecycle and DevOps",
        "Drives technological innovation"
      ]
    }
  ];

  const leadership = [
    {
      role: "Founder & Director (CMO Ops)",
      name: "Krishna Goyal",
      description: "Driving the business forward through strategic marketing and vision. Krishna ensures that our technology meets real market needs and leads customer acquisition strategies.",
      responsibilities: ["Marketing Strategy", "Brand Management", "Business Development", "Product Vision"],
      icon: Target,
      color: "from-blue-600 to-blue-500"
    },
    {
      role: "Founder & Director (CTO Ops)",
      name: "Manish Bhargava",
      description: "Leading the technological evolution of the platform. Manish ensures robust engineering practices, system stability, and leads the technical direction of the company.",
      responsibilities: ["Tech Architecture", "Engineering Leadership", "System Security", "Product Development"],
      icon: Database,
      color: "from-green-600 to-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 via-white to-white font-sans text-gray-900">
      <Navbar />

      <main className="pt-28 pb-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-full text-white text-sm font-semibold mb-4">
              <Users className="w-4 h-4 mr-2" />
              Founded by Visionary Students
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
              Vision Meets <span className="text-blue-600">Execution</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              UdhyogSaathi is led by two dynamic Founders and Directors. Together, they combine market insight with technical excellence to revolutionize Indian manufacturing.
            </p>
          </div>

          {/* Founders Collaboration Section */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 mb-12 border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">A Unified Leadership</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold text-blue-600">Krishna (Director)</span> currently leads the   
                  <span className="font-bold"> CMO operations</span>, driving growth and market presence. 
                  <span className="font-semibold text-green-600"> Manish (Director)</span> currently heads the 
                  <span className="font-bold"> CTO operations</span>, ensuring the platform is robust and scalable.
                </p>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Our Synergy: </span>
                  <span className="ml-2 italic">"One drives the market vision, the other builds the reality."</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  KG
                </div>
                <div className="text-2xl font-bold text-gray-400">+</div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  MB
                </div>
                <div className="text-2xl font-bold text-gray-400">=</div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">US</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Email the Directors</h3>
                  <p className="text-gray-600">Direct access to the leadership team</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50/50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Megaphone className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Krishna Goyal (Director -CEO &  CMO Ops)</p>
                    <p className="text-sm text-gray-600">krishnagoyal26112005@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50/50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Cpu className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manish Bhargava (Director - CEO & CTO Ops)</p>
                    <p className="text-sm text-gray-600">bhargavmanish908@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">WhatsApp / Call</h3>
                  <p className="text-gray-600">Connect directly for partnerships and collaborations</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-sm">KG</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Krishna Goyal</p>
                      <p className="text-sm text-gray-600">+91 9064700906</p>
                    </div>
                  </div>
                  <a href="https://wa.me/919064700906" className="text-green-600 hover:text-green-700">
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600 font-bold text-sm">MB</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Manish Bhargava</p>
                      <p className="text-sm text-gray-600">+91 6376169979</p>
                    </div>
                  </div>
                  <a href="https://wa.me/916376169979" className="text-green-600 hover:text-green-700">
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Founders Section */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-10">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">The Directors</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Two computer science students from VIT Andra Pradesh, leading the company with distinct operational focuses.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {developers.map((dev) => (
                <div key={dev.id} className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <div className={`p-8 bg-gradient-to-r ${dev.color} text-white`}>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <span className="text-white font-black text-2xl">{dev.initials}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{dev.name}</h3>
                          <p className="text-white/90 font-semibold">{dev.role}</p>
                          <p className="text-white/80 text-sm mt-1 bg-white/10 px-2 py-0.5 rounded inline-block">{dev.futureRole}</p>
                        </div>
                      </div>
                      <dev.icon className="w-10 h-10 text-white/80" />
                    </div>
                    <div className="flex items-center text-white/80">
                      <Shield className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">
                        {dev.id === 1 ? "Driving Brand & Growth" : "Architecting Technology"}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">Role in UdhyogSaathi</h4>
                      <p className="text-gray-700 mb-4">{dev.bio}</p>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Key Responsibilities:</h5>
                        <ul className="space-y-2">
                          {dev.contributions.map((contribution, index) => (
                            <li key={index} className="flex items-start">
                              <div className={`w-2 h-2 mt-2 rounded-full ${dev.id === 1 ? 'bg-blue-500' : 'bg-green-500'} mr-3`}></div>
                              <span className="text-gray-700 text-sm">{contribution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <BookOpen className="w-5 h-5 text-gray-400 mr-2" />
                        <h4 className="font-bold text-gray-900">Education</h4>
                      </div>
                      <p className="text-gray-700 mb-2">{dev.education}</p>
                      <p className="text-sm text-gray-600">{dev.university}</p>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">Core Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {dev.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium ${dev.id === 1 ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <div className="flex space-x-4">
                        {dev.social.linkedin ? (
                          <a href={dev.social.linkedin} className="text-blue-600 hover:text-blue-700 transition-colors">
                            <Linkedin className="w-6 h-6" />
                          </a>
                        ) : (
                          <span className="text-gray-400 cursor-not-allowed" title="LinkedIn Profile Coming Soon">
                            <Linkedin className="w-6 h-6" />
                          </span>
                        )}
                        <a href={dev.social.github} className="text-gray-700 hover:text-gray-900 transition-colors">
                          <Github className="w-6 h-6" />
                        </a>
                        <a href={dev.social.twitter} className="text-blue-400 hover:text-blue-500 transition-colors">
                          <Globe className="w-6 h-6" />
                        </a>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Direct Contact:</p>
                        <p className="font-medium text-gray-900">{dev.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Roles Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white mb-12">
            <div className="flex items-center justify-center mb-10">
              <div className="text-center">
                <Rocket className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-3">Leadership & Collaboration</h2>
                <p className="text-gray-300 max-w-2xl mx-auto">
                  Two Directors working in sync to build India's most innovative manufacturing platform
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {leadership.map((leader, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${leader.color} flex items-center justify-center mr-4`}>
                      <leader.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{leader.role}</h3>
                      <p className="text-blue-300 font-medium">{leader.name}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">{leader.description}</p>
                  
                  <div>
                    <h4 className="font-bold text-white mb-3">Key Focus Areas:</h4>
                    <div className="space-y-2">
                      {leader.responsibilities.map((resp, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                          <span className="text-gray-300">{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Story Section */}
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-xl mb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div className="mb-6 md:mb-0">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">The UdhyogSaathi Story</h3>
                <p className="text-gray-700 max-w-2xl">
                  How two college students are building the future of Indian manufacturing
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">Vision</div>
                <div className="text-gray-400">×</div>
                <div className="text-sm font-medium px-3 py-1.5 bg-green-100 text-green-700 rounded-full">Tech</div>
                <div className="text-gray-400">=</div>
                <div className="text-sm font-medium px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full">Innovation</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Megaphone className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">The Marketing Vision</h4>
                <p className="text-gray-700 text-sm">
                  Krishna identified the market gap and spearheads the CMO operations, ensuring the product reaches the right audience and solves real-world problems.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">The Tech Backbone</h4>
                <p className="text-gray-700 text-sm">
                  Manish leads the CTO operations, bringing technical expertise to transform the vision into a scalable, reliable platform with robust architecture.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">The Shared Direction</h4>
                <p className="text-gray-700 text-sm">
                  As Directors, both founders work hand in hand, combining strategic market vision with technical excellence to build a platform that truly matters.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Manufacturing Business?</h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Connect directly with the directors who understand both technology and manufacturing challenges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:krishnagoyal26112005@gmail.com?subject=UdhyogSaathi Inquiry - Krishna"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Email Krishna (Director)
              </a>
              <a 
                href="mailto:bhargavmanish908@gmail.com?subject=UdhyogSaathi Technical Inquiry"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm font-semibold px-6 py-3 rounded-xl border border-white/30 transition-colors"
              >
                Email Manish (Director)
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;