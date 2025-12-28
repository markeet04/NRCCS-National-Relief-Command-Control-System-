import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './Dropdown.css';

/**
 * Dropdown Component
 * Custom dropdown with fully styled dark theme dropdown menu
 * Matches NDMA design system
 */
const Dropdown = ({
    value,
    options = [],
    onChange,
    placeholder = 'Select...',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Find selected option label
    const selectedOption = options.find(opt => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : placeholder;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={`ndma-dropdown ${className}`} ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                className={`ndma-dropdown__trigger ${isOpen ? 'ndma-dropdown__trigger--open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="ndma-dropdown__label">{displayLabel}</span>
                {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="ndma-dropdown__menu">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`ndma-dropdown__item ${value === option.value ? 'ndma-dropdown__item--selected' : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
