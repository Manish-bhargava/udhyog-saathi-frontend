import React from 'react';
import { Mail, Phone, MessageSquare, User, Shield, Rocket, Linkedin, Github, Code, Database, Cpu, Palette, Globe, Award, BookOpen, Lightbulb, Zap, Users, Target } from 'lucide-react';
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
      role: "Founder & Frontend Lead",
      futureRole: "Future CEO & Product Visionary",
      email: "krishnagoyal26112005@gmail.com",
      phone: "+91 9064700906",
      education: "B.Tech Computer Science (Specialization in Data Analytics)",
      university: "Vellore Institute of Technology, Andra Pradesh",
      skills: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "Figma", "UI/UX Design", "Product Strategy"],
      bio: "The visionary behind UdhyogSaathi. Krishna conceptualized the core idea of revolutionizing Indian manufacturing through technology. He combines technical expertise with business insight to drive the product vision forward.",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      },
      color: "from-blue-600 to-blue-500",
      icon: Lightbulb,
      currentFocus: "Product vision, user experience, and business strategy",
      contributions: [
        "Originated the UdhyogSaathi concept",
        "Defines product roadmap and vision",
        "Leads frontend development and design",
        "Drives business strategy and partnerships"
      ]
    },
    {
      id: 2,
      initials: "BM",
      name: "Bhargav Manish",
      role: "Co-founder & CTO",
      futureRole: "Future CTO & Technical Architect",
      email: "bhargavmanish908@gmail.com",
      phone: "+91 6376169979",
      education: "B.Tech Computer Science",
      university: "Vellore Institute of Technology, Andra Pradesh",
      skills: ["Node.js", "Python", "AWS", "Docker", "MongoDB", "System Design", "DevOps"],
      bio: "As Co-founder and CTO, Manish is responsible for technical implementation and strategies. He transforms Krishna's vision into scalable technical solutions, ensuring robust architecture and system reliability.",
      social: {
        linkedin: "#",
        github: "#",
        twitter: "#"
      },
      color: "from-green-600 to-green-500",
      icon: Zap,
      currentFocus: "Technical architecture, system scaling, and implementation strategies",
      contributions: [
        "Leads backend development and architecture",
        "Implements technical strategies",
        "Manages cloud infrastructure and DevOps",
        "Ensures system scalability and reliability"
      ]
    }
  ];

  const leadership = [
    {
      role: "Founder & Future CEO",
      name: "Krishna Goyal",
      description: "Originator of the UdhyogSaathi vision. Krishna combines technical expertise with entrepreneurial insight to drive business growth and strategic direction.",
      responsibilities: ["Product Vision & Strategy", "Business Development", "Investor Relations", "Team Leadership"],
      icon: Target,
      color: "from-blue-600 to-blue-500"
    },
    {
      role: "Co-founder & CTO",
      name: "Bhargav Manish",
      description: "Technical architect who transforms vision into reality. Responsible for implementation strategies, technical roadmap, and ensuring scalable solutions.",
      responsibilities: ["Technical Architecture", "Implementation Strategy", "System Scaling", "R&D Leadership"],
      icon: Cpu,
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
              UdhyogSaathi was born from Krishna's vision and brought to life through Manish's technical expertise. Together, they're revolutionizing Indian manufacturing.
            </p>
          </div>

          {/* Founders Collaboration Section */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 mb-12 border border-blue-100">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">How We Work Together</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  <span className="font-semibold text-blue-600">Krishna</span> originates the vision and product strategy, while 
                  <span className="font-semibold text-green-600"> Manish</span> architects the technical implementation. This complementary partnership 
                  ensures every feature balances user needs with technical excellence.
                </p>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Our Mantra: </span>
                  <span className="ml-2 italic">"Vision without execution is hallucination. Execution without vision is aimless."</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  KG
                </div>
                <div className="text-2xl font-bold text-gray-400">+</div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  BM
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
                  <h3 className="text-xl font-bold text-gray-900">Email the Founders</h3>
                  <p className="text-gray-600">Direct access to the visionaries behind UdhyogSaathi</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50/50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Krishna Goyal (Founder)</p>
                    <p className="text-sm text-gray-600">krishnagoyal26112005@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-green-50/50 rounded-xl">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manish Bhargav (Co-founder & CTO)</p>
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
                  <p className="text-gray-600">Connect directly for partnerships, technical queries, or collaborations</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold text-sm">KG</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Krishna Goyal (Founder)</p>
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
                      <span className="text-green-600 font-bold text-sm">BM</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Manish Bhargav (Co-founder & CTO)</p>
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
                <h2 className="text-3xl font-bold text-gray-900 mb-2">The Founders</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Two computer science students from VIT Andra Pradesh, united by a common vision to transform Indian manufacturing
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
                          <p className="text-white/90">{dev.role}</p>
                          <p className="text-white/80 text-sm mt-1">{dev.futureRole}</p>
                        </div>
                      </div>
                      <dev.icon className="w-10 h-10 text-white/80" />
                    </div>
                    <div className="flex items-center text-white/80">
                      <Shield className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium">
                        {dev.id === 1 ? "Visionary & Strategist" : "Technical Architect & Implementer"}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">Role in UdhyogSaathi</h4>
                      <p className="text-gray-700 mb-4">{dev.bio}</p>
                      
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h5 className="font-semibold text-gray-900 mb-2 text-sm">Key Contributions:</h5>
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
                      <h4 className="font-bold text-gray-900 mb-3">Technical Expertise</h4>
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
                        <a href={dev.social.linkedin} className="text-blue-600 hover:text-blue-700 transition-colors">
                          <Linkedin className="w-6 h-6" />
                        </a>
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
                  Working hand in hand to build India's most innovative manufacturing platform
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
                    <h4 className="font-bold text-white mb-3">Key Responsibilities:</h4>
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

            <div className="mt-10 text-center">
              {/* <div className="inline-flex items-center justify-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <Users className="w-5 h-5 mr-2 text-blue-400" />
                <span className="font-medium">
                  Krishna sets the direction, Manish builds the path. Together, they make the journey possible.
                </span>
              </div> */}
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
                <div className="text-sm font-medium px-3 py-1.5 bg-green-100 text-green-700 rounded-full">Execution</div>
                <div className="text-gray-400">=</div>
                <div className="text-sm font-medium px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full">Innovation</div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">The Vision</h4>
                <p className="text-gray-700 text-sm">
                  Krishna identified the challenges faced by Indian manufacturers and conceived UdhyogSaathi as a comprehensive solution for GST automation and business intelligence.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">The Execution</h4>
                <p className="text-gray-700 text-sm">
                  Manish joined as Co-founder and CTO, bringing technical expertise to transform the vision into a scalable, reliable platform with robust architecture.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">The Partnership</h4>
                <p className="text-gray-700 text-sm">
                  Working hand in hand, they combine strategic vision with technical excellence to build a platform that truly addresses the needs of Indian manufacturers.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl p-10 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Manufacturing Business?</h3>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Connect directly with the founders who understand both technology and manufacturing challenges.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="mailto:krishnagoyal26112005@gmail.com?subject=UdhyogSaathi Inquiry - Founder"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Email Krishna (Founder)
              </a>
              <a 
                href="mailto:bhargavmanish908@gmail.com?subject=UdhyogSaathi Technical Inquiry"
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm font-semibold px-6 py-3 rounded-xl border border-white/30 transition-colors"
              >
                Email Manish (Co-founder & CTO)
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