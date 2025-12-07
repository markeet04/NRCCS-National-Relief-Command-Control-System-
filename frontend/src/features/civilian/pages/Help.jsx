import { useState } from 'react';
import './Help.css';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'All', label: 'All Topics', icon: '📚' },
    { id: 'SOS', label: 'Emergency SOS', icon: '🚨' },
    { id: 'Shelters', label: 'Shelters', icon: '🏠' },
    { id: 'Missing', label: 'Missing Persons', icon: '👤' },
    { id: 'Alerts', label: 'Alerts', icon: '⚠️' },
    { id: 'Tracking', label: 'Track Status', icon: '🔍' },
    { id: 'Account', label: 'Account', icon: '👤' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'SOS',
      question: 'How do I send an emergency SOS?',
      answer: 'Go to the SOS page, fill in your location details, describe your emergency, and click "Send SOS Request". Your location will be automatically detected if you allow location access. Our rescue teams will be notified immediately and will respond based on the severity of your situation.',
      tags: ['emergency', 'sos', 'help']
    },
    {
      id: 2,
      category: 'SOS',
      question: 'What happens after I send an SOS?',
      answer: 'After sending an SOS: 1) Your request is logged with a unique tracking ID, 2) The nearest rescue team is notified, 3) You receive confirmation via SMS/notification, 4) You can track the status in real-time under "Track Status", 5) The rescue team will contact you using the provided phone number.',
      tags: ['sos', 'tracking', 'response']
    },
    {
      id: 3,
      category: 'SOS',
      question: 'Can I cancel an SOS request?',
      answer: 'Yes, you can cancel an SOS request if the situation has been resolved. Go to "Track Status", find your request, and click "Cancel Request". However, if a team has already been dispatched, they may still arrive to verify the situation.',
      tags: ['sos', 'cancel']
    },
    {
      id: 4,
      category: 'Shelters',
      question: 'How do I find the nearest shelter?',
      answer: 'Visit the "Find Shelters" page where you can view all available shelters on an interactive map. The map shows real-time availability, facilities, and contact information. You can filter by distance, capacity, and facilities. Enable location access for accurate distance calculations.',
      tags: ['shelter', 'location', 'map']
    },
    {
      id: 5,
      category: 'Shelters',
      question: 'How do I register for a shelter?',
      answer: 'On the shelter details page, click "Request Shelter Space". Fill in your family details, number of people, and any special requirements. You will receive a confirmation with check-in instructions. Bring your CNIC and the confirmation code when checking in.',
      tags: ['shelter', 'registration']
    },
    {
      id: 6,
      category: 'Shelters',
      question: 'What facilities are available at shelters?',
      answer: 'Shelters provide: basic accommodation, food and water, medical aid, sanitation facilities, charging stations, and children\'s play area. Specific facilities vary by shelter - check the shelter details page for exact amenities.',
      tags: ['shelter', 'facilities']
    },
    {
      id: 7,
      category: 'Missing',
      question: 'How do I report a missing person?',
      answer: 'Go to "Missing Persons" page, click "Report Missing Person", and provide: person\'s full details, recent photo, last known location, clothing description, and contact information. The report will be shared with authorities and displayed publicly to help locate the person.',
      tags: ['missing', 'report']
    },
    {
      id: 8,
      category: 'Missing',
      question: 'What information should I include in a missing person report?',
      answer: 'Include: Full name, age, gender, height, physical description, recent photo, clothing worn, last seen location and time, any medical conditions, contact information of reporter, and any other relevant details that can help identify the person.',
      tags: ['missing', 'report', 'details']
    },
    {
      id: 9,
      category: 'Missing',
      question: 'How can I search for a missing person?',
      answer: 'Use the search bar on the "Missing Persons" page to search by name, location, or description. You can also filter by date reported, age range, and location. If you have information about a missing person, click "I Have Information" on their report.',
      tags: ['missing', 'search']
    },
    {
      id: 10,
      category: 'Alerts',
      question: 'What types of alerts will I receive?',
      answer: 'You will receive: Critical alerts (immediate danger, evacuations), Warning alerts (potential hazards, weather warnings), Info alerts (general updates, safety tips). Alerts are categorized by severity and location relevance.',
      tags: ['alerts', 'notifications']
    },
    {
      id: 11,
      category: 'Alerts',
      question: 'How do I enable alert notifications?',
      answer: 'Go to Profile > Settings > Notifications. Enable push notifications and SMS alerts. You can customize which types of alerts you want to receive and set your preferred notification times. Make sure to allow notification permissions in your browser/device settings.',
      tags: ['alerts', 'notifications', 'settings']
    },
    {
      id: 12,
      category: 'Alerts',
      question: 'What should I do when I receive a critical alert?',
      answer: 'For critical alerts: 1) Read the full alert details immediately, 2) Follow evacuation or safety instructions, 3) Contact emergency services if needed, 4) Move to recommended safe areas, 5) Keep your phone charged and accessible, 6) Monitor for updates.',
      tags: ['alerts', 'emergency', 'safety']
    },
    {
      id: 13,
      category: 'Tracking',
      question: 'How do I track my requests?',
      answer: 'Go to "Track Status" and enter either your CNIC or the tracking ID provided when you submitted your request. You will see all your active and past requests with real-time status updates, assigned teams, and estimated response times.',
      tags: ['tracking', 'status', 'requests']
    },
    {
      id: 14,
      category: 'Tracking',
      question: 'What do the different status labels mean?',
      answer: '"In Progress" - Request is being actively worked on. "Under Investigation" - Authorities are gathering information. "Completed" - Request has been resolved. "Cancelled" - Request was cancelled by you or resolved independently.',
      tags: ['tracking', 'status']
    },
    {
      id: 15,
      category: 'Tracking',
      question: 'How often is tracking information updated?',
      answer: 'Tracking information is updated in real-time. Major status changes trigger immediate updates. You can refresh the page to see the latest information. You will also receive notifications for significant updates via SMS and app notifications.',
      tags: ['tracking', 'updates']
    },
    {
      id: 16,
      category: 'Account',
      question: 'How do I create an account?',
      answer: 'You don\'t need to create an account to access emergency services. However, creating an account allows you to save your information for faster future requests. Use your CNIC to register and verify your identity via OTP sent to your mobile number.',
      tags: ['account', 'registration']
    },
    {
      id: 17,
      category: 'Account',
      question: 'Is my personal information secure?',
      answer: 'Yes, all your data is encrypted and stored securely. We follow strict privacy policies and only use your information for emergency response purposes. Your data is never shared with third parties without your consent, except in emergency situations with authorized personnel.',
      tags: ['account', 'privacy', 'security']
    },
    {
      id: 18,
      category: 'Account',
      question: 'What if I forget my CNIC or tracking ID?',
      answer: 'If you forget your CNIC, you can retrieve it from your government-issued ID card. For tracking IDs, check your SMS messages or email confirmations sent when you submitted the request. You can also contact our helpline at 115 for assistance.',
      tags: ['account', 'tracking', 'help']
    }
  ];

  const quickLinks = [
    {
      icon: '🚨',
      title: 'Emergency SOS',
      description: 'Send immediate help request',
      link: '/civilian/sos',
      color: '#dc2626'
    },
    {
      icon: '📞',
      title: 'Emergency Helpline',
      description: 'Call 115 for assistance',
      link: 'tel:115',
      color: '#0284c7'
    },
    {
      icon: '🏠',
      title: 'Find Shelters',
      description: 'Locate nearby relief centers',
      link: '/civilian/shelters',
      color: '#16a34a'
    },
    {
      icon: '🔍',
      title: 'Track Requests',
      description: 'Check status of your requests',
      link: '/civilian/track',
      color: '#7c3aed'
    }
  ];

  const contactMethods = [
    {
      icon: '📞',
      title: 'Emergency Helpline',
      value: '115',
      description: '24/7 Emergency Support',
      link: 'tel:115'
    },
    {
      icon: '📧',
      title: 'Email Support',
      value: 'help@nrccs.gov.pk',
      description: 'Response within 24 hours',
      link: 'mailto:help@nrccs.gov.pk'
    },
    {
      icon: '💬',
      title: 'SMS Service',
      value: '8000',
      description: 'Text us for assistance',
      link: 'sms:8000'
    },
    {
      icon: '🌐',
      title: 'WhatsApp',
      value: '+92-300-1234567',
      description: 'Chat support available',
      link: 'https://wa.me/923001234567'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="help-page">
      <div className="help-header">
        <div className="help-header-content">
          <div className="help-icon-large">❓</div>
          <h1>Help Center</h1>
          <p>Find answers to your questions and get assistance</p>
        </div>

        <div className="search-bar-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for help topics, questions, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="help-search-input"
            />
            {searchQuery && (
              <button 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

    
      

      {/* Category Filters */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.label}</span>
              {cat.id === 'All' && (
                <span className="category-count">{faqs.length}</span>
              )}
              {cat.id !== 'All' && (
                <span className="category-count">
                  {faqs.filter(f => f.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        {filteredFaqs.length === 0 ? (
          <div className="no-results">
            <span className="no-results-icon">🔍</span>
            <h3>No results found</h3>
            <p>Try adjusting your search or browse by category</p>
            <button 
              className="reset-btn"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('All');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="faq-list">
            {filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className={`faq-item ${expandedFaq === faq.id ? 'expanded' : ''}`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <div className="faq-question-content">
                    <span className="faq-category-badge">
                      {categories.find(c => c.id === faq.category)?.icon}
                    </span>
                    <span className="faq-question-text">{faq.question}</span>
                  </div>
                  <span className={`faq-toggle ${expandedFaq === faq.id ? 'open' : ''}`}>
                    ▼
                  </span>
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                    <div className="faq-tags">
                      {faq.tags.map((tag, i) => (
                        <span key={i} className="faq-tag">#{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact Support Section */}
      <section className="contact-section">
        <div className="contact-header">
          <h2>Still Need Help?</h2>
          <p>Our support team is here to assist you 24/7</p>
        </div>

        <div className="contact-methods-grid">
          {contactMethods.map((method, index) => (
            <a
              key={index}
              href={method.link}
              className="contact-method-card"
            >
              <div className="contact-method-icon">{method.icon}</div>
              <h3>{method.title}</h3>
              <div className="contact-value">{method.value}</div>
              <p>{method.description}</p>
            </a>
          ))}
        </div>
      </section>

     

      {/* Feedback Section */}
      <section className="feedback-section">
        <div className="feedback-card">
          <h3>Was this helpful?</h3>
          <p>Help us improve our help center</p>
          <div className="feedback-buttons">
            <button className="feedback-btn positive">
              👍 Yes, helpful
            </button>
            <button className="feedback-btn negative">
              👎 Need more info
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Help;
