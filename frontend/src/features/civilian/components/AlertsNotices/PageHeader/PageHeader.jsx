const PageHeader = ({ unreadCount }) => {
  return (
    <div className="page-header">
      <div>
        <h1>Alerts & Notices</h1>
        <p>Stay informed about emergencies and important updates</p>
      </div>
      {unreadCount > 0 && (
        <div className="unread-badge">
          {unreadCount} Unread
        </div>
      )}
    </div>
  );
};

export default PageHeader;
