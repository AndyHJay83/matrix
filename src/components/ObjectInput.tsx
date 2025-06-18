import React, { useState } from 'react';

interface ObjectInputProps {
  onObjectsSubmit: (objects: string[]) => void;
  disabled?: boolean;
}

const ObjectInput: React.FC<ObjectInputProps> = ({ onObjectsSubmit, disabled = false }) => {
  const [objects, setObjects] = useState<string[]>(Array(16).fill(''));
  const [showGrid, setShowGrid] = useState(false);

  const cities = [
    'Tokyo', 'New York', 'London', 'Paris', 'Sydney', 'Mumbai', 'Cairo', 'Rio de Janeiro',
    'Moscow', 'Toronto', 'Singapore', 'Berlin', 'Madrid', 'Rome', 'Amsterdam', 'Vienna'
  ];

  const householdObjects = [
    'Spoon', 'Book', 'Chair', 'Lamp', 'Phone', 'Keys', 'Watch', 'Glasses',
    'Wallet', 'Pen', 'Cup', 'Hat', 'Shoes', 'Bag', 'Mirror', 'Clock'
  ];

  const transport = [
    'Car', 'Boat', 'Train', 'Plane', 'Bicycle', 'Bus', 'Motorcycle', 'Helicopter',
    'Subway', 'Tram', 'Truck', 'Van', 'Ship', 'Jet', 'Rocket', 'Skateboard'
  ];

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

  const handleAutoFill = (items: string[]) => {
    // Shuffle the array to get random items
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    setObjects(shuffled.slice(0, 16));
  };

  const isComplete = objects.every(obj => obj.trim() !== '');

  return (
    <div className="object-input">
      <h3>Enter Your 16 Objects</h3>
      
      <div className="auto-fill-buttons">
        <button
          className="btn btn-secondary"
          onClick={() => handleAutoFill(cities)}
          disabled={disabled}
        >
          CITIES
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleAutoFill(householdObjects)}
          disabled={disabled}
        >
          OBJECTS
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => handleAutoFill(transport)}
          disabled={disabled}
        >
          TRANSPORT
        </button>
      </div>
      
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
          Assign Objects
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