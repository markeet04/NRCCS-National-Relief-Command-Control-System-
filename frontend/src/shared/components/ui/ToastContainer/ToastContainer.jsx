import Toast from '../Toast/Toast';
import './ToastContainer.css';

const ToastContainer = ({ notifications, onClose }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
