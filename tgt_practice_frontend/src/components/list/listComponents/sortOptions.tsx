import React from 'react';

interface SortOptionsProps {
    selectedSort: string;
    onCheckboxChange: (value: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ selectedSort, onCheckboxChange }) => {
    return (
        <div className="sort">
            <div className="sort-label">
                <p>Sort :</p>
            </div>
            <div className="sort-options">
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        name="sort"
                        value="novelty"
                        checked={selectedSort === 'novelty'}
                        onChange={() => onCheckboxChange('novelty')}
                    />
                    <span className="checkmark"></span>
                    <p>by novelty</p>
                </label>
                <label className="custom-checkbox">
                    <input
                        type="checkbox"
                        name="sort"
                        value="alphabet"
                        checked={selectedSort === 'alphabet'}
                        onChange={() => onCheckboxChange('alphabet')}
                    />
                    <span className="checkmark"></span>
                    <p>by alphabet</p>
                </label>
            </div>
        </div>
    );
};

export default SortOptions;
