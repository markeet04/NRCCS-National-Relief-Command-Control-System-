import { useState } from 'react';
import { DashboardLayout } from '../../components/Layout';
import { MapPin, Calendar, AlertTriangle, TrendingUp, FileText } from 'lucide-react';

const DamageReports = () => {
  const [activeRoute, setActiveRoute] = useState('reports');
  
  const menuItems = [
    { route: 'dashboard', label: 'District Dashboard', icon: 'dashboard' },
    { route: 'sos', label: 'SOS Requests', icon: 'alerts', badge: 15 },
    { route: 'shelters', label: 'Shelter Management', icon: 'resources' },
    { route: 'rescue', label: 'Rescue Teams', icon: 'resources' },
    { route: 'reports', label: 'Damage Reports', icon: 'map' },
  ];

  const [reports] = useState([
    {
      id: 1,
      title: 'Road Infrastructure Damage',
      location: 'Block A, Sukkur',
      date: '3/15/2024',
      severity: 'critical',
      category: 'Infrastructure',
      description: 'Multiple roads severely damaged due to flooding. Main highway to Block B completely submerged.',
      estimatedCost: '₨ 50M',
      affectedArea: '5 km²',
      reportedBy: 'Ahmed Hassan',
      status: 'under assessment',
      images: 3
    },
    {
      id: 2,
      title: 'Residential Building Collapse',
      location: 'Block C, Sukkur',
      date: '3/15/2024',
      severity: 'high',
      category: 'Residential',
      description: '3 residential buildings partially collapsed. 12 families displaced.',
      estimatedCost: '₨ 30M',
      affectedArea: '0.5 km²',
      reportedBy: 'Fatima Ali',
      status: 'verified',
      images: 5
    },
    {
      id: 3,
      title: 'Agricultural Land Flooding',
      location: 'Rural Sukkur',
      date: '3/14/2024',
      severity: 'medium',
      category: 'Agriculture',
      description: 'Extensive farmland submerged affecting crop production.',
      estimatedCost: '₨ 20M',
      affectedArea: '15 km²',
      reportedBy: 'Hassan Malik',
      status: 'verified',
      images: 4
    },
    {
      id: 4,
      title: 'Power Distribution Damage',
      location: 'Block B, Sukkur',
      date: '3/14/2024',
      severity: 'high',
      category: 'Utilities',
      description: 'Major power transmission lines damaged. 5,000 households without electricity.',
      estimatedCost: '₨ 15M',
      affectedArea: '3 km²',
      reportedBy: 'Sara Khan',
      status: 'under assessment',
      images: 2
    }
  ]);

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return '#ef4444';
    if (severity === 'high') return '#fb923c';
    if (severity === 'medium') return '#fbbf24';
    return '#6b7280';
  };

  const getStatusColor = (status) => {
    if (status === 'verified') return '#10b981';
    if (status === 'under assessment') return '#3b82f6';
    return '#6b7280';
  };

  const totalDamage = reports.reduce((sum, report) => {
    const cost = parseInt(report.estimatedCost.replace(/[^\d]/g, ''));
    return sum + cost;
  }, 0);

  return (
    <DashboardLayout
      menuItems={menuItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      pageTitle="Damage Reports"
      pageSubtitle="Track and assess disaster damage reports"
      userRole="District Sukkur"
      userName="District Officer"
    >
      <div style={{ padding: '24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Total Reports
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>
              {reports.length}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Critical Reports
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>
              {reports.filter(r => r.severity === 'critical').length}
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Est. Total Damage
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#fb923c' }}>
              ₨ {totalDamage}M
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginBottom: '8px' }}>
              Under Assessment
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>
              {reports.filter(r => r.status === 'under assessment').length}
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#fff', marginBottom: '24px' }}>
          Damage Reports
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reports.map((report) => (
            <div
              key={report.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderLeft: `4px solid ${getSeverityColor(report.severity)}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#fff', marginBottom: '12px' }}>
                    {report.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: `${getSeverityColor(report.severity)}33`,
                      color: getSeverityColor(report.severity)
                    }}>
                      {report.severity} severity
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: `${getStatusColor(report.status)}33`,
                      color: getStatusColor(report.status)
                    }}>
                      {report.status}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#a78bfa'
                    }}>
                      {report.category}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
                {report.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <MapPin size={14} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>Location</span>
                  </div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                    {report.location}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <Calendar size={14} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>Date Reported</span>
                  </div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                    {report.date}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <TrendingUp size={14} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>Est. Cost</span>
                  </div>
                  <div style={{ color: '#fb923c', fontSize: '16px', fontWeight: '600' }}>
                    {report.estimatedCost}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <FileText size={14} style={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>Reported By</span>
                  </div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: '500' }}>
                    {report.reportedBy}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px' }}>
                  Affected Area: <span style={{ color: '#fff', fontWeight: '500' }}>{report.affectedArea}</span>
                  {' • '}
                  Images: <span style={{ color: '#fff', fontWeight: '500' }}>{report.images}</span>
                </div>
                <button
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DamageReports;
