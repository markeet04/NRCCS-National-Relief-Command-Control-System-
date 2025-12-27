// DistrictRequestsSection Component
// Displays resource requests from districts that PDMA can approve/reject

import { useState, useEffect, useCallback } from 'react';
import { Check, X, Clock, AlertTriangle, Package, Droplets, Home, Stethoscope, RefreshCw } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import { pdmaApi } from '../../../services';
import { useNotification } from '@shared/hooks';
import './DistrictRequestsSection.css';

const getResourceIcon = (name) => {
    if (!name) return Package;
    const nameLower = String(name).toLowerCase();
    if (nameLower.includes('food')) return Package;
    if (nameLower.includes('water')) return Droplets;
    if (nameLower.includes('shelter') || nameLower.includes('tent') || nameLower.includes('blanket')) return Home;
    if (nameLower.includes('medical') || nameLower.includes('medicine')) return Stethoscope;
    return Package;
};

const getPriorityColor = (priority) => {
    const colors = {
        urgent: '#dc2626',
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#22c55e',
    };
    return colors[priority] || colors.medium;
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const DistrictRequestsSection = () => {
    const { theme } = useSettings();
    const isLight = theme === 'light';
    const colors = getThemeColors(isLight);
    const notification = useNotification();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await pdmaApi.getDistrictRequests();
            setRequests(data || []);
        } catch (err) {
            console.error('Error fetching district requests:', err);
            setError(err.message || 'Failed to load district requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleApprove = async (requestId) => {
        try {
            setActionLoading(requestId);
            await pdmaApi.reviewDistrictRequest(requestId, { status: 'approved', notes: 'Approved via PDMA dashboard' });
            notification.success('Request approved successfully');
            fetchRequests();
        } catch (err) {
            console.error('Error approving request:', err);
            notification.error(err.message || 'Failed to approve request');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requestId) => {
        try {
            setActionLoading(requestId);
            await pdmaApi.reviewDistrictRequest(requestId, { status: 'rejected', notes: 'Rejected via PDMA dashboard' });
            notification.info('Request rejected');
            fetchRequests();
        } catch (err) {
            console.error('Error rejecting request:', err);
            notification.error(err.message || 'Failed to reject request');
        } finally {
            setActionLoading(null);
        }
    };

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const processedRequests = requests.filter(r => r.status !== 'pending');

    if (loading) {
        return (
            <div className="district-requests-section" style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <div className="section-header" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <h3 style={{ color: colors.textPrimary }}>District Resource Requests</h3>
                </div>
                <div className="loading-state" style={{ color: colors.mutedText }}>
                    <RefreshCw className="animate-spin" size={24} />
                    <span>Loading requests...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="district-requests-section" style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <div className="section-header" style={{ borderBottom: `1px solid ${colors.border}` }}>
                    <h3 style={{ color: colors.textPrimary }}>District Resource Requests</h3>
                    <button onClick={fetchRequests} className="refresh-btn" style={{ color: colors.primary }}>
                        <RefreshCw size={16} />
                    </button>
                </div>
                <div className="empty-state" style={{ color: colors.mutedText }}>
                    <Package size={48} />
                    <p>No district requests to display</p>
                    <span style={{ fontSize: '0.8rem' }}>Check backend connection</span>
                </div>
            </div>
        );
    }

    return (
        <div className="district-requests-section" style={{ background: colors.cardBg, border: `1px solid ${colors.border}` }}>
            <div className="section-header" style={{ borderBottom: `1px solid ${colors.border}` }}>
                <h3 style={{ color: colors.textPrimary }}>
                    District Resource Requests
                    {pendingRequests.length > 0 && (
                        <span className="pending-badge">{pendingRequests.length}</span>
                    )}
                </h3>
                <button onClick={fetchRequests} className="refresh-btn" style={{ color: colors.primary }}>
                    <RefreshCw size={16} />
                </button>
            </div>

            {pendingRequests.length === 0 && processedRequests.length === 0 ? (
                <div className="empty-state" style={{ color: colors.mutedText }}>
                    <Package size={48} />
                    <p>No district requests at this time</p>
                </div>
            ) : (
                <div className="requests-list">
                    {pendingRequests.length > 0 && (
                        <>
                            <h4 className="list-title" style={{ color: colors.textSecondary }}>Pending Requests</h4>
                            {pendingRequests.map((request) => (
                                <div key={request.id} className="request-card pending" style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                                    <div className="request-header">
                                        <div className="district-info">
                                            <span className="district-name" style={{ color: colors.textPrimary }}>
                                                {request.district?.name || 'Unknown District'}
                                            </span>
                                            <span className="request-date" style={{ color: colors.mutedText }}>
                                                <Clock size={12} />
                                                {formatDate(request.createdAt)}
                                            </span>
                                        </div>
                                        <span className="priority-badge" style={{ background: getPriorityColor(request.priority) }}>
                                            {request.priority === 'high' || request.priority === 'urgent' ? <AlertTriangle size={12} /> : null}
                                            {request.priority}
                                        </span>
                                    </div>

                                    <div className="request-items">
                                        {request.requestedItems?.map((item, idx) => {
                                            const Icon = getResourceIcon(item.name || item.resourceName || item.resourceType);
                                            return (
                                                <div key={idx} className="item-row">
                                                    <Icon size={14} style={{ color: colors.primary }} />
                                                    <span style={{ color: colors.textSecondary }}>
                                                        {item.name || item.resourceName || item.resourceType}:
                                                    </span>
                                                    <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
                                                        {item.quantity} {item.unit || 'units'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {request.reason && (
                                        <p className="request-reason" style={{ color: colors.mutedText }}>{request.reason}</p>
                                    )}

                                    <div className="request-actions">
                                        <button
                                            onClick={() => handleApprove(request.id)}
                                            disabled={actionLoading === request.id}
                                            className="action-btn approve"
                                        >
                                            <Check size={16} />
                                            {actionLoading === request.id ? 'Processing...' : 'Approve'}
                                        </button>
                                        <button
                                            onClick={() => handleReject(request.id)}
                                            disabled={actionLoading === request.id}
                                            className="action-btn reject"
                                        >
                                            <X size={16} />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    {processedRequests.length > 0 && (
                        <>
                            <h4 className="list-title" style={{ color: colors.textSecondary, marginTop: pendingRequests.length > 0 ? '16px' : 0 }}>
                                Processed Requests
                            </h4>
                            {processedRequests.slice(0, 5).map((request) => (
                                <div key={request.id} className={`request-card processed ${request.status}`} style={{ background: colors.bgSecondary, border: `1px solid ${colors.border}` }}>
                                    <div className="request-header">
                                        <div className="district-info">
                                            <span className="district-name" style={{ color: colors.textPrimary }}>
                                                {request.district?.name || 'Unknown District'}
                                            </span>
                                            <span className="request-date" style={{ color: colors.mutedText }}>
                                                <Clock size={12} />
                                                {formatDate(request.processedAt || request.updatedAt)}
                                            </span>
                                        </div>
                                        <span className={`status-badge ${request.status}`}>
                                            {request.status === 'approved' ? <Check size={12} /> : <X size={12} />}
                                            {request.status}
                                        </span>
                                    </div>
                                    
                                    {/* Show requested items for approved requests */}
                                    {request.status === 'approved' && request.requestedItems && (
                                        <div className="request-items" style={{ marginTop: '8px', opacity: 0.9 }}>
                                            {request.requestedItems.map((item, idx) => {
                                                const Icon = getResourceIcon(item.name || item.resourceName || item.resourceType);
                                                return (
                                                    <div key={idx} className="item-row">
                                                        <Icon size={14} style={{ color: '#22c55e' }} />
                                                        <span style={{ color: colors.textSecondary }}>
                                                            {item.name || item.resourceName || item.resourceType}:
                                                        </span>
                                                        <span style={{ color: colors.textPrimary, fontWeight: '600' }}>
                                                            {item.quantity} {item.unit || 'units'}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    
                                    {/* Show processed by info */}
                                    {request.processedByName && (
                                        <p className="request-reason" style={{ color: colors.mutedText, fontSize: '0.75rem', marginTop: '8px' }}>
                                            Processed by: {request.processedByName}
                                            {request.notes && ` — ${request.notes}`}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default DistrictRequestsSection;
