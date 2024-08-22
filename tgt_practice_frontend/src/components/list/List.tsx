import React, { useState, useEffect } from 'react';
import './List.css';
import useTreeQuery from "src/lib/hooks/tree.ts";
import { ToolModuleGroup } from 'src/types/interfaces';
import SearchBar from './listComponents/searchBar';
import SortOptions from './listComponents/sortOptions';
import LevelList from './listComponents/levelList';

interface ListProps {
    onItemClick: (itemId: string) => void;
    refetchTrigger: boolean; // New prop for refetch trigger
}

const List: React.FC<ListProps> = ({ onItemClick, refetchTrigger }) => {
    const [refetchKey, setRefetchKey] = useState<number>(0);
    const { loading, error, data } = useTreeQuery(refetchKey);

    const [searchText, setSearchText] = useState<string>('');
    const [selectedSort, setSelectedSort] = useState<string>('novelty');
    const [sortedData, setSortedData] = useState<ToolModuleGroup[]>([]);

    // Refetch data when refetchTrigger changes
    useEffect(() => {
        setRefetchKey(prevKey => prevKey + 1);
    }, [refetchTrigger]);

    useEffect(() => {
        if (data) {
            setSortedData(sortData(data.toolModuleGroups, selectedSort));
        }
    }, [data, selectedSort]);

    useEffect(() => {
        if (data) {
            setSortedData(
                sortData(data.toolModuleGroups, selectedSort).map(group => ({
                    ...group,
                    toolmoduletypeSet: group.toolmoduletypeSet.map(type => ({
                        ...type,
                        toolmoduleSet: type.toolmoduleSet.filter(module =>
                            module.sn.toLowerCase().includes(searchText.toLowerCase())
                        )
                    })).filter(type => type.toolmoduleSet.length > 0)
                })).filter(group => group.toolmoduletypeSet.length > 0)
            );
        }
    }, [data, selectedSort, searchText]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleCheckboxChange = (value: string) => {
        setSelectedSort(value);
    };

    const sortData = (data: ToolModuleGroup[], sortBy: string) => {
        if (sortBy === 'novelty') {
            return [...data].sort((a, b) => {
                const aDate = a.toolmoduletypeSet?.[0]?.toolmoduleSet?.[0]?.dbdate;
                const bDate = b.toolmoduletypeSet?.[0]?.toolmoduleSet?.[0]?.dbdate;
                return new Date(bDate).getTime() - new Date(aDate).getTime();
            });
        } else if (sortBy === 'alphabet') {
            return [...data].sort((a, b) => a.name.localeCompare(b.name));
        }
        return data;
    };

    const updateList = () => {
        setRefetchKey(prevKey => prevKey + 1);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="list-container">
            <SearchBar searchText={searchText} onSearchChange={handleSearchChange} />
            <SortOptions selectedSort={selectedSort} onCheckboxChange={handleCheckboxChange} />
            <LevelList
                sortedData={sortedData}
                updateListData={updateList}
                onItemClick={onItemClick}
                searchText={searchText}
            />
        </div>
    );
};

export default List;
