/**
 * Help Page Tests
 * Tests for FAQ and help center page
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Help from './Help';

// Mock the custom hook
const mockUseHelpLogic = {
  searchQuery: '',
  setSearchQuery: vi.fn(),
  activeCategory: 'all',
  setActiveCategory: vi.fn(),
  expandedFaq: null,
  toggleFaq: vi.fn(),
  handleReset: vi.fn(),
  categories: [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'emergency', label: 'Emergency', icon: '🚨' },
    { id: 'shelters', label: 'Shelters', icon: '🏠' },
  ],
  faqs: [
    { id: 1, question: 'How to report emergency?', answer: 'Use SOS button', category: 'emergency' },
    { id: 2, question: 'Where are shelters?', answer: 'Check Find Shelters page', category: 'shelters' },
  ],
  filteredFaqs: [
    { id: 1, question: 'How to report emergency?', answer: 'Use SOS button', category: 'emergency' },
    { id: 2, question: 'Where are shelters?', answer: 'Check Find Shelters page', category: 'shelters' },
  ],
  contactMethods: [
    { type: 'phone', value: '1166', label: 'Emergency Hotline' },
    { type: 'email', value: 'help@nrccs.gov.pk', label: 'Email Support' },
  ],
};

vi.mock('../hooks/useHelpLogic', () => ({
  useHelpLogic: () => mockUseHelpLogic,
}));

// Mock constants
vi.mock('../constants', () => ({
  SAFETY_TIPS: [
    'Stay calm during emergencies',
    'Keep emergency numbers handy',
  ],
}));

// Mock child components
vi.mock('../components/Help', () => ({
  HelpHeader: ({ searchQuery, setSearchQuery }) => (
    <header data-testid="help-header">
      <h1>Help Center</h1>
      <input
        data-testid="search-input"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search FAQs..."
      />
    </header>
  ),
  CategoryFilters: ({ categories, activeCategory, setActiveCategory, faqs }) => (
    <div data-testid="category-filters">
      {categories.map(cat => (
        <button
          key={cat.id}
          data-testid={`category-${cat.id}`}
          className={activeCategory === cat.id ? 'active' : ''}
          onClick={() => setActiveCategory(cat.id)}
        >
          {cat.icon} {cat.label}
        </button>
      ))}
    </div>
  ),
  FAQList: ({ filteredFaqs, expandedFaq, toggleFaq, categories }) => (
    <ul data-testid="faq-list">
      {filteredFaqs.map(faq => (
        <li key={faq.id} data-testid={`faq-${faq.id}`}>
          <button onClick={() => toggleFaq(faq.id)}>
            {faq.question}
          </button>
          {expandedFaq === faq.id && (
            <div data-testid={`faq-answer-${faq.id}`}>{faq.answer}</div>
          )}
        </li>
      ))}
    </ul>
  ),
  NoResults: ({ onReset }) => (
    <div data-testid="no-results">
      <p>No FAQs found</p>
      <button onClick={onReset}>Reset Search</button>
    </div>
  ),
  ContactSection: ({ contactMethods }) => (
    <div data-testid="contact-section">
      <h2>Contact Us</h2>
      {contactMethods.map((method, index) => (
        <div key={index} data-testid={`contact-${method.type}`}>
          <span>{method.label}</span>
          <span>{method.value}</span>
        </div>
      ))}
    </div>
  ),
  FeedbackSection: () => (
    <div data-testid="feedback-section">Feedback Form</div>
  ),
}));

describe('Help Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock values
    mockUseHelpLogic.searchQuery = '';
    mockUseHelpLogic.activeCategory = 'all';
    mockUseHelpLogic.expandedFaq = null;
    mockUseHelpLogic.filteredFaqs = mockUseHelpLogic.faqs;
  });

  describe('Rendering', () => {
    it('renders help header', () => {
      render(<Help />);
      
      expect(screen.getByTestId('help-header')).toBeInTheDocument();
      expect(screen.getByText('Help Center')).toBeInTheDocument();
    });

    it('renders FAQ section title', () => {
      render(<Help />);
      
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('renders category filters', () => {
      render(<Help />);
      
      expect(screen.getByTestId('category-filters')).toBeInTheDocument();
    });

    it('renders FAQ list', () => {
      render(<Help />);
      
      expect(screen.getByTestId('faq-list')).toBeInTheDocument();
    });

    it('renders contact section', () => {
      render(<Help />);
      
      expect(screen.getByTestId('contact-section')).toBeInTheDocument();
    });

    it('has help page class', () => {
      const { container } = render(<Help />);
      
      expect(container.querySelector('.help-page')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('renders search input', () => {
      render(<Help />);
      
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('calls setSearchQuery on input', async () => {
      const user = userEvent.setup();
      render(<Help />);
      
      await user.type(screen.getByTestId('search-input'), 'emergency');
      
      expect(mockUseHelpLogic.setSearchQuery).toHaveBeenCalled();
    });

    it('displays search placeholder', () => {
      render(<Help />);
      
      expect(screen.getByPlaceholderText('Search FAQs...')).toBeInTheDocument();
    });
  });

  describe('Category Filters', () => {
    it('renders all category buttons', () => {
      render(<Help />);
      
      expect(screen.getByTestId('category-all')).toBeInTheDocument();
      expect(screen.getByTestId('category-emergency')).toBeInTheDocument();
      expect(screen.getByTestId('category-shelters')).toBeInTheDocument();
    });

    it('calls setActiveCategory when category clicked', async () => {
      const user = userEvent.setup();
      render(<Help />);
      
      await user.click(screen.getByTestId('category-emergency'));
      
      expect(mockUseHelpLogic.setActiveCategory).toHaveBeenCalledWith('emergency');
    });

    it('displays category labels', () => {
      render(<Help />);
      
      expect(screen.getByText(/All/)).toBeInTheDocument();
      expect(screen.getByText(/Emergency/)).toBeInTheDocument();
      expect(screen.getByText(/Shelters/)).toBeInTheDocument();
    });

    it('displays category icons', () => {
      render(<Help />);
      
      expect(screen.getByText(/📋/)).toBeInTheDocument();
      expect(screen.getByText(/🚨/)).toBeInTheDocument();
      expect(screen.getByText(/🏠/)).toBeInTheDocument();
    });
  });

  describe('FAQ List', () => {
    it('renders all FAQs', () => {
      render(<Help />);
      
      expect(screen.getByText('How to report emergency?')).toBeInTheDocument();
      expect(screen.getByText('Where are shelters?')).toBeInTheDocument();
    });

    it('calls toggleFaq when question clicked', async () => {
      const user = userEvent.setup();
      render(<Help />);
      
      await user.click(screen.getByText('How to report emergency?'));
      
      expect(mockUseHelpLogic.toggleFaq).toHaveBeenCalledWith(1);
    });

    it('shows answer when FAQ is expanded', () => {
      mockUseHelpLogic.expandedFaq = 1;
      render(<Help />);
      
      expect(screen.getByTestId('faq-answer-1')).toBeInTheDocument();
      expect(screen.getByText('Use SOS button')).toBeInTheDocument();
    });

    it('does not show answer when FAQ is collapsed', () => {
      mockUseHelpLogic.expandedFaq = null;
      render(<Help />);
      
      expect(screen.queryByTestId('faq-answer-1')).not.toBeInTheDocument();
    });
  });

  describe('No Results State', () => {
    it('shows no results when filteredFaqs is empty', () => {
      mockUseHelpLogic.filteredFaqs = [];
      render(<Help />);
      
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
      expect(screen.getByText('No FAQs found')).toBeInTheDocument();
    });

    it('does not show FAQ list when no results', () => {
      mockUseHelpLogic.filteredFaqs = [];
      render(<Help />);
      
      expect(screen.queryByTestId('faq-list')).not.toBeInTheDocument();
    });

    it('calls handleReset when reset clicked', async () => {
      const user = userEvent.setup();
      mockUseHelpLogic.filteredFaqs = [];
      render(<Help />);
      
      await user.click(screen.getByText('Reset Search'));
      
      expect(mockUseHelpLogic.handleReset).toHaveBeenCalled();
    });
  });

  describe('Contact Section', () => {
    it('renders contact section title', () => {
      render(<Help />);
      
      expect(screen.getByText('Contact Us')).toBeInTheDocument();
    });

    it('renders phone contact', () => {
      render(<Help />);
      
      expect(screen.getByTestId('contact-phone')).toBeInTheDocument();
      expect(screen.getByText('Emergency Hotline')).toBeInTheDocument();
      expect(screen.getByText('1166')).toBeInTheDocument();
    });

    it('renders email contact', () => {
      render(<Help />);
      
      expect(screen.getByTestId('contact-email')).toBeInTheDocument();
      expect(screen.getByText('Email Support')).toBeInTheDocument();
      expect(screen.getByText('help@nrccs.gov.pk')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty categories', () => {
      mockUseHelpLogic.categories = [];
      render(<Help />);
      
      expect(screen.getByTestId('category-filters')).toBeInTheDocument();
    });

    it('handles many FAQs', () => {
      mockUseHelpLogic.filteredFaqs = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        question: `Question ${i}?`,
        answer: `Answer ${i}`,
        category: 'general',
      }));
      render(<Help />);
      
      expect(screen.getByTestId('faq-list')).toBeInTheDocument();
    });

    it('handles special characters in FAQ', () => {
      mockUseHelpLogic.filteredFaqs = [
        { id: 1, question: 'What is "NRCCS"?', answer: 'It\'s a <system>', category: 'general' },
      ];
      render(<Help />);
      
      expect(screen.getByText('What is "NRCCS"?')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('search input is accessible', () => {
      render(<Help />);
      
      const searchInput = screen.getByTestId('search-input');
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute('placeholder');
    });

    it('FAQ buttons are clickable', () => {
      render(<Help />);
      
      const faqButton = screen.getByText('How to report emergency?');
      expect(faqButton.tagName).toBe('BUTTON');
    });

    it('category buttons are accessible', () => {
      render(<Help />);
      
      const categories = screen.getAllByRole('button');
      expect(categories.length).toBeGreaterThan(0);
    });
  });
});
