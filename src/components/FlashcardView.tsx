import React, { useState } from 'react';

interface FlashcardViewProps {
  objects: string[][];
  onBack: () => void;
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ objects, onBack }) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const totalCards = 16;
  const currentRow = Math.floor(currentCard / 4);
  const currentCol = currentCard % 4;
  const currentObject = objects[currentRow][currentCol];

  const getRowObjects = (row: number): string[] => {
    return objects[row];
  };

  const getColumnObjects = (col: number): string[] => {
    return objects.map(row => row[col]);
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCard < totalCards - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const rowObjects = getRowObjects(currentRow);
  const columnObjects = getColumnObjects(currentCol);

  // Filter out the current object from row and column lists
  const rowObjectsFiltered = rowObjects.filter((_, index) => index !== currentCol);
  const columnObjectsFiltered = columnObjects.filter((_, index) => index !== currentRow);

  // Combine all other objects into a single list (removing duplicates)
  const allOtherObjects = new Set([...rowObjectsFiltered, ...columnObjectsFiltered]);

  return (
    <div className="flashcard-view">
      <div className="flashcard-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Back to Matrix
        </button>
        <h3>Flashcard {currentCard + 1} of {totalCards}</h3>
        <div className="flashcard-nav">
          <button 
            className="btn btn-secondary" 
            onClick={handlePrevCard}
            disabled={currentCard === 0}
          >
            ← Prev
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={handleNextCard}
            disabled={currentCard === totalCards - 1}
          >
            Next →
          </button>
        </div>
      </div>

      <div className="flashcard-container">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleCardClick}
        >
          <div className="flashcard-front">
            <h2>{currentObject}</h2>
            <p>Click to reveal other objects in same row and column</p>
          </div>
          <div className="flashcard-back">
            <div className="flashcard-content">
              <h3>Other Objects in Same Row & Column:</h3>
              <div className="object-list">
                {Array.from(allOtherObjects).map((obj, index) => (
                  <span 
                    key={index} 
                    className="object-item"
                  >
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flashcard-progress">
        <div className="progress-bar">
          {Array.from({ length: totalCards }, (_, index) => (
            <div
              key={index}
              className={`progress-dot ${index === currentCard ? 'active' : ''} ${index < currentCard ? 'completed' : ''}`}
              onClick={() => {
                setCurrentCard(index);
                setIsFlipped(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlashcardView; 