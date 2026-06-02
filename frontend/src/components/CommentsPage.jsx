import React, { useState } from 'react';
import { 
  MessageSquare, User, Send, Trash2, Shield, Info, CheckCircle, 
  AlertCircle, ChevronRight, HelpCircle, CornerDownRight 
} from 'lucide-react';

const CommentsPage = ({ comments, onAddComment, onDeleteComment, onAddReply, onResolveComment }) => {
  const [roleMode, setRoleMode] = useState('admin'); // 'admin' or 'client'
  
  // Client new comment form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Pond Health');
  const [priority, setPriority] = useState('Medium');
  const [message, setMessage] = useState('');

  // Admin reply states (tracks input text by comment ID)
  const [replyTexts, setReplyTexts] = useState({});

  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    onAddComment({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      subject: subject.trim(),
      content: message.trim(),
      category,
      priority,
      authorName: 'Client User',
      authorRole: 'Client',
      timestamp: new Date().toLocaleString(),
      status: 'Pending',
      deletedByClient: false,
      replies: []
    });

    setSubject('');
    setMessage('');
    setPriority('Medium');
  };

  const handleAdminReplySubmit = (commentId) => {
    const text = replyTexts[commentId];
    if (!text || !text.trim()) return;

    onAddReply(commentId, {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
      authorName: 'Admin User',
      authorRole: 'Admin',
      content: text.trim(),
      timestamp: new Date().toLocaleString()
    });

    setReplyTexts(prev => ({ ...prev, [commentId]: '' }));
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Pond Health': return 'var(--accent-green)';
      case 'Feed Quality': return 'var(--accent-orange)';
      case 'Water Quality': return 'var(--accent-blue)';
      case 'Billing & Finance': return 'var(--accent-purple)';
      default: return 'var(--accent-cyan)';
    }
  };

  const getPriorityColor = (pri) => {
    switch (pri) {
      case 'High': return 'var(--accent-red)';
      case 'Medium': return 'var(--accent-orange)';
      default: return 'var(--accent-green)';
    }
  };

  // Filter comments based on current role view
  const visibleComments = comments.filter(c => {
    if (roleMode === 'client') {
      // Clients only see comments they haven't deleted
      return !c.deletedByClient;
    }
    // Admins see all comments, even if deleted by client (soft delete)
    return true;
  });

  return (
    <div className="dashboard-content comments-page">
      {/* Top Banner & Mode Toggle */}
      <div className="dashboard-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div className="dashboard-title">
          <h1>Comments & Client Feedback</h1>
          <p>Read client queries, review deleted activities, and publish manager responses.</p>
        </div>

        {/* Role switch toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface-elevated)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>View Perspective:</span>
          <div style={{ display: 'flex', background: 'var(--bg-base)', padding: '2px', borderRadius: '8px' }}>
            <button 
              onClick={() => setRoleMode('client')}
              style={{ 
                padding: '6px 16px', 
                borderRadius: '6px', 
                fontSize: '12px', 
                fontWeight: '600', 
                transition: 'var(--transition-fast)', 
                background: roleMode === 'client' ? 'rgba(0, 224, 255, 0.15)' : 'transparent', 
                color: roleMode === 'client' ? 'var(--accent-cyan)' : 'var(--text-secondary)' 
              }}
            >
              Client Mode
            </button>
            <button 
              onClick={() => setRoleMode('admin')}
              style={{ 
                padding: '6px 16px', 
                borderRadius: '6px', 
                fontSize: '12px', 
                fontWeight: '600', 
                transition: 'var(--transition-fast)', 
                background: roleMode === 'admin' ? 'rgba(0, 224, 255, 0.15)' : 'transparent', 
                color: roleMode === 'admin' ? 'var(--accent-cyan)' : 'var(--text-secondary)' 
              }}
            >
              Admin Mode
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left sidebar (Form or Info stats) + Right content (Feed list) */}
      <div className="main-grid">
        
        {/* Left Side: Dynamic Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {roleMode === 'client' ? (
            // Client Form to Submit comment
            <div className="card" style={{ border: '1px solid var(--accent-cyan)' }}>
              <div className="card-header" style={{ marginBottom: '16px' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} style={{ color: 'var(--accent-cyan)' }} /> Submit Feedback
                </h3>
              </div>
              <form onSubmit={handleClientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Subject / Topic</label>
                  <input
                    type="text"
                    placeholder="e.g., pH readings fluctuating too high"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    >
                      <option value="Pond Health">Pond Health</option>
                      <option value="Feed Quality">Feed Quality</option>
                      <option value="Water Quality">Water Quality</option>
                      <option value="Billing & Finance">Billing & Finance</option>
                      <option value="App Feedback">App Feedback</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High / Urgent</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Details / Description</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details about your query or comment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ padding: '12px', borderRadius: '6px', background: 'var(--accent-cyan)', color: 'black', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Send size={16} /> Send to Admin
                </button>

              </form>
            </div>
          ) : (
            // Admin Panel Statistics
            <div className="card">
              <div className="card-header" style={{ marginBottom: '16px' }}>
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} style={{ color: 'var(--accent-purple)' }} /> Admin Feedback Hub
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    {comments.filter(c => c.status === 'Pending').length}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pending Client Issues</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-red)' }}>
                    {comments.filter(c => c.deletedByClient).length}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Deleted by Client <span style={{ color: 'var(--accent-red)', fontWeight: '600' }}>(Tracked)</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-green)' }}>
                    {comments.filter(c => c.status === 'Resolved').length}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Resolved Feedbacks</div>
                </div>

                <div style={{ background: 'rgba(0, 224, 255, 0.03)', border: '1px solid rgba(0, 224, 255, 0.1)', padding: '12px', borderRadius: '8px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  <Info size={14} style={{ color: 'var(--accent-cyan)', marginRight: '4px', verticalAlign: 'middle' }} />
                  <strong>Audit Rule:</strong> Client deletion will hide comments in their panel but preserves them here under red safety banners. This ensures managers maintain a full chronological log of client activities.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Comments feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Active Feedback Feed</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {visibleComments.length} issue{visibleComments.length !== 1 && 's'}
            </span>
          </div>

          {visibleComments.map(c => {
            return (
              <div 
                key={c.id} 
                className="card"
                style={{ 
                  position: 'relative',
                  border: c.deletedByClient 
                    ? '1.5px solid var(--accent-red)' 
                    : c.status === 'Resolved' 
                      ? '1px solid rgba(16, 185, 129, 0.3)' 
                      : '1px solid var(--border-color)',
                  background: c.deletedByClient ? 'rgba(239, 68, 68, 0.02)' : 'var(--bg-surface)'
                }}
              >
                {/* Deletion flag banner */}
                {c.deletedByClient && (
                  <div style={{ 
                    background: 'var(--accent-red)', 
                    color: 'white', 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    padding: '4px 12px', 
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    borderBottomLeftRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <AlertCircle size={12} /> DELETED BY CLIENT (TRACKED BY ADMIN)
                  </div>
                )}

                {/* Comment header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'white', marginRight: '60px' }}>{c.subject}</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User size={12} /> {c.authorName} ({c.authorRole})
                      </span>
                      <span>•</span>
                      <span>{c.timestamp}</span>
                    </div>
                  </div>
                  
                  {/* Badges */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', background: `${getCategoryColor(c.category)}22`, color: getCategoryColor(c.category) }}>
                      {c.category}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '4px', background: `${getPriorityColor(c.priority)}22`, color: getPriorityColor(c.priority) }}>
                      {c.priority} Priority
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      background: c.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                      color: c.status === 'Resolved' ? 'var(--accent-green)' : 'var(--accent-orange)' 
                    }}>
                      {c.status}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div style={{ 
                  color: 'var(--text-primary)', 
                  fontSize: '14px', 
                  lineHeight: '1.6', 
                  marginBottom: '16px',
                  fontStyle: c.deletedByClient ? 'italic' : 'normal',
                  opacity: c.deletedByClient ? 0.75 : 1
                }}>
                  {c.content}
                </div>

                {/* Sub-Thread: Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                    {c.replies.map(r => (
                      <div key={r.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <CornerDownRight size={16} style={{ color: 'var(--accent-cyan)', marginTop: '2px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '600', color: r.authorRole === 'Admin' ? 'var(--accent-cyan)' : 'white' }}>{r.authorName} ({r.authorRole})</span>
                            <span>{r.timestamp}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                            {r.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Controls: Depends on Role mode */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    {roleMode === 'client' && (
                      <button
                        onClick={() => onDeleteComment(c.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--accent-red)', cursor: 'pointer', fontWeight: '500' }}
                      >
                        <Trash2 size={14} /> Delete Topic
                      </button>
                    )}
                    
                    {roleMode === 'admin' && (
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => onResolveComment(c.id, c.status === 'Resolved' ? 'Pending' : 'Resolved')}
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: c.status === 'Resolved' ? 'var(--text-secondary)' : 'var(--accent-green)', cursor: 'pointer', fontWeight: '500' }}
                        >
                          <CheckCircle size={14} /> {c.status === 'Resolved' ? 'Re-open issue' : 'Resolve issue'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Admin inline reply form */}
                  {roleMode === 'admin' && (
                    <div style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '400px', marginLeft: 'auto' }}>
                      <input
                        type="text"
                        placeholder="Write a response as admin..."
                        value={replyTexts[c.id] || ''}
                        onChange={(e) => setReplyTexts({ ...replyTexts, [c.id]: e.target.value })}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleAdminReplySubmit(c.id); }}
                        style={{ flex: 1, padding: '6px 12px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-elevated)', color: 'white' }}
                      />
                      <button
                        onClick={() => handleAdminReplySubmit(c.id)}
                        style={{ padding: '6px 12px', borderRadius: '4px', background: 'var(--accent-cyan)', color: 'black', fontWeight: '600', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Send size={12} /> Reply
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}

          {visibleComments.length === 0 && (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <HelpCircle size={32} style={{ marginBottom: '12px', color: 'var(--text-muted)' }} />
              <p>No comments found under this view perspective.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default CommentsPage;
