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
          Enter Target Number (1-9,999,999)
        </label>
        <input
          id="target-input"
          type="number"
          className="target-input"
          value={target}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          min="1"
          max="9999999"
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={disabled}
          aria-describedby="target-description"
        />
        <p id="target-description" className="subtitle">
          This number will be the sum of any combination of one number from each column
        </p>
        <button
          className="btn btn-primary"
          onClick={onGenerate}
          disabled={disabled || !isValidTarget}
        >
          {disabled ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            'Generate Matrix'
          )}
        </button>
      </div>
    </div>
  );
};

export default TargetInput; 