import React from 'react';
import { Clock, Plus, Trash2, Edit2, Search, Database } from 'lucide-react';

const ActivityLogPage = ({ logs }) => {
  const getActionIcon = (action) => {
    switch(action) {
      case 'CREATE': return <Plus size={16} />;
      case 'UPDATE': return <Edit2 size={16} />;
      case 'DELETE': return <Trash2 size={16} />;
      default: return <Database size={16} />;
    }
  };

  const getActionColor = (action) => {
    switch(action) {
      case 'CREATE': return 'var(--accent-green)';
      case 'UPDATE': return 'var(--accent-cyan)';
      case 'DELETE': return 'var(--accent-red)';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <div className="dashboard-content activity-log-page">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Activity Audit Log</h1>
          <p>Track all changes, additions, and deletions made across the system.</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} style={{ color: 'var(--text-muted)' }} /> System Activity
          </h3>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Showing {logs.length} log{logs.length !== 1 && 's'}
          </span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Entity Area</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Clock size={16} />
                      <span style={{ fontSize: '13px' }}>{log.timestamp}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      padding: '4px 8px', 
                      borderRadius: '6px', 
                      background: `rgba(255,255,255,0.05)`, 
                      color: getActionColor(log.action),
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {getActionIcon(log.action)}
                      {log.action}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{log.entity}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)' }}>{log.details}</span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No activity logs recorded yet. Any changes made to the system will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;
