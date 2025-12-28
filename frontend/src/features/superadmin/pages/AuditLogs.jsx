import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@shared/components/layout';
import { getMenuItemsByRole, ROLE_CONFIG } from '@shared/constants/dashboardConfig';
import { PageLoader } from '@shared/components/ui';
import SuperAdminService from '../services';
import { useNotification } from '@shared/hooks';

const AuditLogs = () => {
  const [activeRoute, setActiveRoute] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);
  const { showError } = useNotification();
  const roleConfig = ROLE_CONFIG.superadmin;
  const menuItems = useMemo(() => getMenuItemsByRole('superadmin'), []);

  useEffect(() => {
    fetchAuditLogs();
  }, [limit, offset]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const data = await SuperAdminService.getAuditLogs(limit, offset);
      setLogs(data);
    } catch (error) {
      showError(error.message || 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Audit Logs"
      pageSubtitle="System activity and audit trail"
      userRole="Super Admin"
      userName="Admin"
    >
      <div style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
          Audit Logs
        </h2>

        {loading ? (
          <PageLoader message="Loading audit logs..." />
        ) : (
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Timestamp</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Action</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Entity</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#94a3b8' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log, index) => (
                    <tr key={log.id || index} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '12px', color: '#e2e8f0' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '12px', color: '#e2e8f0' }}>{log.userId || 'System'}</td>
                      <td style={{ padding: '12px', color: '#e2e8f0' }}>{log.action}</td>
                      <td style={{ padding: '12px', color: '#e2e8f0' }}>
                        {log.entityType} #{log.entityId}
                      </td>
                      <td style={{ padding: '12px', color: '#94a3b8', fontSize: '14px' }}>
                        {log.oldValues && <div>Old: {JSON.stringify(log.oldValues).substring(0, 50)}...</div>}
                        {log.newValues && <div>New: {JSON.stringify(log.newValues).substring(0, 50)}...</div>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                style={{
                  padding: '8px 16px',
                  background: offset === 0 ? '#334155' : '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: offset === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={logs.length < limit}
                style={{
                  padding: '8px 16px',
                  background: logs.length < limit ? '#334155' : '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: logs.length < limit ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
