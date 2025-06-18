import React from 'react';

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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    onTargetChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
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
          value={target}
          onChange={handleChange}
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
          disabled={disabled || target < 1 || target > 9999999}
        >
          Generate Matrix
        </button>
      </div>
    </div>
  );
};

export default TargetInput; 