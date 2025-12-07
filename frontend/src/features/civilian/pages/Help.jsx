import React from "react";
import { useHelpLogic } from "../hooks/useHelpLogic";
import {
  HelpHeader,
  CategoryFilters,
  FAQList,
  NoResults,
  ContactSection,
  FeedbackSection,
} from "../components/Help";
import { SAFETY_TIPS } from "../constants";
import "./Help.css";

const Help = () => {
  const {
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    expandedFaq,
    toggleFaq,
    handleReset,
    categories,
    faqs,
    filteredFaqs,
    contactMethods,
  } = useHelpLogic();

  return (
    <div className="help-page">
      <HelpHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <CategoryFilters
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          faqs={faqs}
        />

        {filteredFaqs.length === 0 ? (
          <NoResults onReset={handleReset} />
        ) : (
          <FAQList
            filteredFaqs={filteredFaqs}
            expandedFaq={expandedFaq}
            toggleFaq={toggleFaq}
            categories={categories}
          />
        )}
      </section>

      

      <ContactSection contactMethods={contactMethods} />

      <FeedbackSection />
    </div>
  );
};

export default Help;
