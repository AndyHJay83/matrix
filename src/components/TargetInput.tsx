import React, { useState } from 'react';

interface TargetInputProps {
  target: number;
  onTargetChange: (target: number) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

const TargetInput: React.FC<TargetInputProps> = ({
  target,
  onTargetChange,
  onGenerate,
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(target.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Allow empty value during typing
    if (value === '') {
      return;
    }
    
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      onTargetChange(numValue);
    }
  };

  const handleBlur = () => {
    // Apply validation when user finishes editing
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 1) {
      setInputValue(target.toString());
    } else {
      const validValue = Math.max(1, Math.min(9999999, numValue));
      setInputValue(validValue.toString());
      onTargetChange(validValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
      onGenerate();
    }
  };

  const isValidTarget = target >= 1 && target <= 9999999;

  return (
    <div className="target-section">
      <div className="target-input-group">
        <label htmlFor="target-input" className="target-label">
          Target Number
        </label>
        <input
          id="target-input"
          type="number"
          className="target-input"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          min="1"
          max="9999999"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label="Enter target number"
        />
        <button
          className="btn btn-primary"
          onClick={onGenerate}
          disabled={disabled || !isValidTarget}
        >
          Generate Matrix
        </button>
      </div>
    </div>
  );
};

export default TargetInput; 