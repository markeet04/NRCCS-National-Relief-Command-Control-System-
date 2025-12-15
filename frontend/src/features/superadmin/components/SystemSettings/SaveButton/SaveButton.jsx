import './SaveButton.css';

const SaveButton = ({ onSave }) => {
  return (
    <div className="save-button-container">
      <button onClick={onSave} className="save-button">
        Save Changes
      </button>
    </div>
  );
};

export default SaveButton;
