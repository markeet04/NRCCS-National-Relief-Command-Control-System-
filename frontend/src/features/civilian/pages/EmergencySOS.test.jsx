/**
 * EmergencySOS Component Tests
 * NRCCS - National Relief Command & Control System
 * 
 * Tests for the emergency SOS request page
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import EmergencySOS from './EmergencySOS';

// Mock the hook
const mockHandleInputChange = vi.fn();
const mockHandleSOSClick = vi.fn();
const mockHandleConfirm = vi.fn();
const mockHandleCancel = vi.fn();
const mockHandleReset = vi.fn();

const defaultHookReturn = {
  gpsStatus: 'acquired',
  location: { lat: 33.6844, lng: 73.0479, accuracy: 10 },
  formData: {
    name: '',
    phone: '',
    emergencyType: '',
    description: '',
    provinceId: '',
    districtId: '',
  },
  errors: {},
  showConfirmModal: false,
  showSuccessScreen: false,
  isSubmitting: false,
  requestData: null,
  handleInputChange: mockHandleInputChange,
  handleSOSClick: mockHandleSOSClick,
  handleConfirm: mockHandleConfirm,
  handleCancel: mockHandleCancel,
  handleReset: mockHandleReset,
  provinces: [
    { id: 1, name: 'Punjab' },
    { id: 2, name: 'Sindh' },
  ],
  districts: [
    { id: 1, name: 'Lahore', provinceId: 1 },
    { id: 2, name: 'Karachi', provinceId: 2 },
  ],
  loadingProvinces: false,
  loadingDistricts: false,
};

vi.mock('../hooks', () => ({
  useSOSLogic: vi.fn(() => defaultHookReturn),
}));

// Mock child components
vi.mock('../components/EmergencySOS', () => ({
  GPSStatusBanner: ({ gpsStatus, location }) => (
    <div data-testid="gps-banner" data-status={gpsStatus}>
      GPS Status: {gpsStatus}
      {location && <span>Lat: {location.lat}, Lng: {location.lng}</span>}
    </div>
  ),
  SOSForm: ({ formData, errors, onInputChange, onSubmit, isSubmitting }) => (
    <form data-testid="sos-form" onSubmit={onSubmit}>
      <input
        data-testid="name-input"
        name="name"
        value={formData.name}
        onChange={(e) => onInputChange('name', e.target.value)}
        placeholder="Your Name"
      />
      <input
        data-testid="phone-input"
        name="phone"
        value={formData.phone}
        onChange={(e) => onInputChange('phone', e.target.value)}
        placeholder="Phone Number"
      />
      <select
        data-testid="emergency-type"
        name="emergencyType"
        value={formData.emergencyType}
        onChange={(e) => onInputChange('emergencyType', e.target.value)}
      >
        <option value="">Select Emergency Type</option>
        <option value="FLOOD">Flood</option>
        <option value="FIRE">Fire</option>
        <option value="MEDICAL">Medical</option>
      </select>
      <textarea
        data-testid="description-input"
        name="description"
        value={formData.description}
        onChange={(e) => onInputChange('description', e.target.value)}
        placeholder="Description"
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Send SOS'}
      </button>
      {errors.name && <span data-testid="name-error">{errors.name}</span>}
    </form>
  ),
  ConfirmationModal: ({ formData, onConfirm, onCancel }) => (
    <div data-testid="confirm-modal">
      <h2>Confirm SOS Request</h2>
      <p>Name: {formData.name}</p>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
  SuccessScreen: ({ requestData, onReset }) => (
    <div data-testid="success-screen">
      <h2>SOS Request Sent!</h2>
      <p>Request ID: {requestData.id}</p>
      <button onClick={onReset}>Send Another</button>
    </div>
  ),
}));

// Import the mocked hook to modify it
import { useSOSLogic } from '../hooks';

const renderEmergencySOS = () => {
  return render(
    <BrowserRouter>
      <EmergencySOS />
    </BrowserRouter>
  );
};

describe('EmergencySOS Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSOSLogic.mockReturnValue(defaultHookReturn);
  });

  // ============================================
  // Rendering Tests
  // ============================================
  
  describe('Rendering', () => {
    it('renders emergency SOS page', () => {
      renderEmergencySOS();
      expect(screen.getByTestId('gps-banner')).toBeInTheDocument();
      expect(screen.getByTestId('sos-form')).toBeInTheDocument();
    });

    it('renders GPS status banner', () => {
      renderEmergencySOS();
      expect(screen.getByTestId('gps-banner')).toBeInTheDocument();
    });

    it('renders SOS form', () => {
      renderEmergencySOS();
      expect(screen.getByTestId('sos-form')).toBeInTheDocument();
    });

    it('has sos-page container', () => {
      const { container } = renderEmergencySOS();
      expect(container.querySelector('.sos-page')).toBeInTheDocument();
    });

    it('has sos-container wrapper', () => {
      const { container } = renderEmergencySOS();
      expect(container.querySelector('.sos-container')).toBeInTheDocument();
    });
  });

  // ============================================
  // GPS Status Tests
  // ============================================
  
  describe('GPS Status', () => {
    it('displays acquired GPS status', () => {
      renderEmergencySOS();
      expect(screen.getByTestId('gps-banner')).toHaveAttribute('data-status', 'acquired');
    });

    it('displays location coordinates when available', () => {
      renderEmergencySOS();
      expect(screen.getByText(/Lat: 33.6844/)).toBeInTheDocument();
    });

    it('handles pending GPS status', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        gpsStatus: 'pending',
        location: null,
      });
      
      renderEmergencySOS();
      expect(screen.getByTestId('gps-banner')).toHaveAttribute('data-status', 'pending');
    });

    it('handles denied GPS status', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        gpsStatus: 'denied',
        location: null,
      });
      
      renderEmergencySOS();
      expect(screen.getByTestId('gps-banner')).toHaveAttribute('data-status', 'denied');
    });
  });

  // ============================================
  // Form Interaction Tests
  // ============================================
  
  describe('Form Interaction', () => {
    it('calls handleInputChange when typing in name field', async () => {
      const user = userEvent.setup();
      renderEmergencySOS();
      
      const nameInput = screen.getByTestId('name-input');
      await user.type(nameInput, 'John Doe');
      
      expect(mockHandleInputChange).toHaveBeenCalled();
    });

    it('calls handleInputChange when typing in phone field', async () => {
      const user = userEvent.setup();
      renderEmergencySOS();
      
      const phoneInput = screen.getByTestId('phone-input');
      await user.type(phoneInput, '03001234567');
      
      expect(mockHandleInputChange).toHaveBeenCalled();
    });

    it('calls handleInputChange when selecting emergency type', async () => {
      const user = userEvent.setup();
      renderEmergencySOS();
      
      const emergencySelect = screen.getByTestId('emergency-type');
      await user.selectOptions(emergencySelect, 'FLOOD');
      
      expect(mockHandleInputChange).toHaveBeenCalled();
    });

    it('calls handleSOSClick on form submit', async () => {
      const user = userEvent.setup();
      renderEmergencySOS();
      
      const form = screen.getByTestId('sos-form');
      fireEvent.submit(form);
      
      expect(mockHandleSOSClick).toHaveBeenCalled();
    });
  });

  // ============================================
  // Confirmation Modal Tests
  // ============================================
  
  describe('Confirmation Modal', () => {
    it('does not show confirmation modal by default', () => {
      renderEmergencySOS();
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    });

    it('shows confirmation modal when showConfirmModal is true', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        showConfirmModal: true,
        formData: {
          ...defaultHookReturn.formData,
          name: 'John Doe',
        },
      });
      
      renderEmergencySOS();
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    });

    it('calls handleConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup();
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        showConfirmModal: true,
      });
      
      renderEmergencySOS();
      
      const confirmButton = screen.getByText('Confirm');
      await user.click(confirmButton);
      
      expect(mockHandleConfirm).toHaveBeenCalled();
    });

    it('calls handleCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        showConfirmModal: true,
      });
      
      renderEmergencySOS();
      
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);
      
      expect(mockHandleCancel).toHaveBeenCalled();
    });
  });

  // ============================================
  // Success Screen Tests
  // ============================================
  
  describe('Success Screen', () => {
    it('shows success screen when request is complete', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        showSuccessScreen: true,
        requestData: { id: 'SOS-001' },
      });
      
      renderEmergencySOS();
      expect(screen.getByTestId('success-screen')).toBeInTheDocument();
    });

    it('displays request ID on success screen', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        showSuccessScreen: true,
        requestData: { id: 'SOS-12345' },
      });
      
      renderEmergencySOS();
      expect(screen.getByText('Request ID: SOS-12345')).toBeInTheDocument();
    });

    it('calls handleReset when send another is clicked', async () => {
      const user = userEvent.setup();
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        showSuccessScreen: true,
        requestData: { id: 'SOS-001' },
      });
      
      renderEmergencySOS();
      
      const resetButton = screen.getByText('Send Another');
      await user.click(resetButton);
      
      expect(mockHandleReset).toHaveBeenCalled();
    });

    it('hides form when success screen is shown', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        showSuccessScreen: true,
        requestData: { id: 'SOS-001' },
      });
      
      renderEmergencySOS();
      expect(screen.queryByTestId('sos-form')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Submitting State Tests
  // ============================================
  
  describe('Submitting State', () => {
    it('shows loading state when submitting', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        isSubmitting: true,
      });
      
      renderEmergencySOS();
      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });

    it('disables submit button when submitting', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        isSubmitting: true,
      });
      
      renderEmergencySOS();
      const submitButton = screen.getByRole('button', { name: /submitting/i });
      expect(submitButton).toBeDisabled();
    });
  });

  // ============================================
  // Error Display Tests
  // ============================================
  
  describe('Error Display', () => {
    it('displays validation errors', () => {
      useSOSLogic.mockReturnValue({
        ...defaultHookReturn,
        errors: { name: 'Name is required' },
      });
      
      renderEmergencySOS();
      expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required');
    });
  });

  // ============================================
  // Accessibility Tests
  // ============================================
  
  describe('Accessibility', () => {
    it('form has accessible inputs', () => {
      renderEmergencySOS();
      
      expect(screen.getByPlaceholderText('Your Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    });

    it('submit button is accessible', () => {
      renderEmergencySOS();
      expect(screen.getByRole('button', { name: /send sos/i })).toBeInTheDocument();
    });

    it('emergency type select is accessible', () => {
      renderEmergencySOS();
      expect(screen.getByTestId('emergency-type')).toBeInTheDocument();
    });
  });
});
