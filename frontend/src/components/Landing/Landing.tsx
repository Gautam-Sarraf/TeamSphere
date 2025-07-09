import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Users, 
  Shield, 
  Zap, 
  FileText, 
  Video, 
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Smartphone,
  Lock
} from 'lucide-react';
import './Landing.css';

const Landing: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <MessageCircle size={32} />,
      title: "Real-time Messaging",
      description: "Instant communication with your team members across different channels and servers."
    },
    {
      icon: <Users size={32} />,
      title: "Team Collaboration",
      description: "Organize your teams into servers and channels for better project management."
    },
    {
      icon: <FileText size={32} />,
      title: "File Sharing",
      description: "Share documents, images, and files seamlessly with drag-and-drop functionality."
    },
    {
      icon: <Shield size={32} />,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and admin controls."
    },
    {
      icon: <Video size={32} />,
      title: "Voice Channels",
      description: "High-quality voice communication for team meetings and discussions."
    },
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description: "Optimized performance for smooth communication without delays."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      content: "WorkChat has revolutionized how our team communicates. The interface is intuitive and the features are exactly what we needed.",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=6366f1&color=fff"
    },
    {
      name: "Michael Chen",
      role: "Engineering Lead",
      company: "StartupXYZ",
      content: "The file sharing and channel organization features have made our development process so much more efficient.",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=10b981&color=fff"
    },
    {
      name: "Emily Rodriguez",
      role: "HR Director",
      company: "GlobalInc",
      content: "Perfect for our distributed team. The security features give us peace of mind when discussing sensitive topics.",
      avatar: "https://ui-avatars.com/api/?name=Emily+Rodriguez&background=f59e0b&color=fff"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "500+", label: "Companies" },
    { number: "99.9%", label: "Uptime" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="landing">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="nav-brand">
            <MessageCircle size={32} className="brand-icon" />
            <span className="brand-text">TeamSphere</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className={`hero-content ${isVisible ? 'animate-fade-in' : ''}`}>
            <h1 className="hero-title">
              Transform Your Team
              <span className="gradient-text"> Communication</span>
            </h1>
            <p className="hero-description">
              The modern workplace communication platform that brings your team together. 
              Secure, fast, and designed for productivity.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`stat-item animate-slide-in-up animate-delay-${(index + 1) * 100}`}
                >
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={`hero-visual ${isVisible ? 'animate-slide-in-right' : ''}`}>
            <div className="floating-card card-1 animate-float">
              <MessageCircle size={24} />
              <span>New message from John</span>
            </div>
            <div className="floating-card card-2 animate-float animate-delay-200">
              <Users size={24} />
              <span>5 members online</span>
            </div>
            <div className="floating-card card-3 animate-float animate-delay-400">
              <FileText size={24} />
              <span>Document shared</span>
            </div>
            <div className="hero-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="mockup-sidebar">
                  <div className="sidebar-item active">
                    <div className="sidebar-icon"></div>
                    <span>General</span>
                  </div>
                  <div className="sidebar-item">
                    <div className="sidebar-icon"></div>
                    <span>Development</span>
                  </div>
                  <div className="sidebar-item">
                    <div className="sidebar-icon"></div>
                    <span>Design</span>
                  </div>
                </div>
                <div className="mockup-chat">
                  <div className="chat-message">
                    <div className="message-avatar"></div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-name">Alex</span>
                        <span className="message-time">2:30 PM</span>
                      </div>
                      <div className="message-text">Great work on the new feature!</div>
                    </div>
                  </div>
                  <div className="chat-message">
                    <div className="message-avatar"></div>
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-name">Sarah</span>
                        <span className="message-time">2:32 PM</span>
                      </div>
                      <div className="message-text">Thanks! Ready for the demo tomorrow.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything you need to collaborate</h2>
            <p className="section-description">
              Powerful features designed to enhance team productivity and communication
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card animate-scale-in animate-delay-${index * 100}`}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="benefits-title">Why teams choose WorkChat</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <CheckCircle size={24} className="benefit-icon" />
                  <div>
                    <h4>Increased Productivity</h4>
                    <p>Streamlined communication reduces email clutter and speeds up decision making</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <Globe size={24} className="benefit-icon" />
                  <div>
                    <h4>Global Accessibility</h4>
                    <p>Connect with team members anywhere in the world with real-time synchronization</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <Smartphone size={24} className="benefit-icon" />
                  <div>
                    <h4>Mobile Ready</h4>
                    <p>Fully responsive design works perfectly on desktop, tablet, and mobile devices</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <Lock size={24} className="benefit-icon" />
                  <div>
                    <h4>Enterprise Security</h4>
                    <p>Advanced encryption and security features to protect your sensitive data</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="benefits-mockup">
                <div className="mockup-screen">
                  <div className="screen-header">
                    <div className="header-title">Team Dashboard</div>
                    <div className="header-actions">
                      <div className="action-dot"></div>
                      <div className="action-dot"></div>
                      <div className="action-dot"></div>
                    </div>
                  </div>
                  <div className="screen-content">
                    <div className="content-row">
                      <div className="content-block active"></div>
                      <div className="content-block"></div>
                    </div>
                    <div className="content-row">
                      <div className="content-block"></div>
                      <div className="content-block active"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Loved by teams worldwide</h2>
            <p className="section-description">
              See what our customers have to say about WorkChat
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`testimonial-card animate-slide-in-up animate-delay-${index * 200}`}
              >
                <div className="testimonial-content">
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="star-filled" />
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to transform your team communication?</h2>
            <p className="cta-description">
              Join thousands of teams already using WorkChat to collaborate more effectively
            </p>
            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                Start Free Trial
                <ArrowRight size={20} />
              </Link>
              <div className="cta-note">
                No credit card required • 14-day free trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <MessageCircle size={32} className="brand-icon" />
              <span className="brand-text">TeamSphere</span>
            </div>
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <a href="#">Features</a>
                <a href="#">Pricing</a>
                <a href="#">Security</a>
              </div>
              <div className="footer-section">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
              </div>
              <div className="footer-section">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Documentation</a>
                <a href="#">Status</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 TeamSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;