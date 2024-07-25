import React from 'react';

interface SearchBarProps {
    searchText: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, onSearchChange }) => {
    return (
        <div className="search">
            <input
                type="text"
                value={searchText}
                onChange={onSearchChange}
                placeholder="Enter..."
                className="search-input"
            />
        </div>
    );
};

export default SearchBar;
