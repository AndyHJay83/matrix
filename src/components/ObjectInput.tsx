import React, { useState } from 'react';

interface ObjectInputProps {
  onObjectsSubmit: (objects: string[]) => void;
  disabled?: boolean;
}

const ObjectInput: React.FC<ObjectInputProps> = ({ onObjectsSubmit, disabled = false }) => {
  const [objects, setObjects] = useState<string[]>(Array(16).fill(''));
  const [showGrid, setShowGrid] = useState(false);

  const handleObjectChange = (index: number, value: string) => {
    const newObjects = [...objects];
    newObjects[index] = value;
    setObjects(newObjects);
  };

  const handleSubmit = () => {
    if (objects.every(obj => obj.trim() !== '')) {
      onObjectsSubmit(objects);
      setShowGrid(true);
    }
  };

  const handleReset = () => {
    setObjects(Array(16).fill(''));
    setShowGrid(false);
  };

  const isComplete = objects.every(obj => obj.trim() !== '');

  return (
    <div className="object-input">
      <h3>Enter Your 16 Objects</h3>
      
      <div className="object-grid">
        {objects.map((object, index) => (
          <div key={index} className="object-input-cell">
            <label htmlFor={`object-${index}`}>
              Object {index + 1}
            </label>
            <input
              id={`object-${index}`}
              type="text"
              value={object}
              onChange={(e) => handleObjectChange(index, e.target.value)}
              placeholder={`Object ${index + 1}`}
              disabled={disabled}
              className="object-input-field"
            />
          </div>
        ))}
      </div>

      <div className="object-controls">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={disabled || !isComplete}
        >
          Assign Objects to Matrix
        </button>
        
        {showGrid && (
          <button
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={disabled}
          >
            Reset Objects
          </button>
        )}
      </div>
    </div>
  );
};

export default ObjectInput; 