import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { useQuery } from '@apollo/client';
import GET_CURRENT_USER from '../../graphql/queries/get_current_user';
import Cookies from 'js-cookie';
import { useUnitSystemsQuery } from '../../lib/hooks/useUnitSystemsQuery';
import { useUserUnitSystemQuery } from '../../lib/hooks/useUserUnitSystemQuery';
import { useUpdateProfileUnitSystem } from '../../lib/hooks/UnitSystem/useUpdateProfileUnitSystem';
import { useUnitSystem } from 'src/contexts/UnitSystemContext';
import UploadCsvFileButton from "src/components/UploadToolModules/UploadCsvFileButton/UploadCsvFileButton.tsx";


interface HeaderProps {
    onFileProcessed: (data: any) => void;
}

const Header: React.FC<HeaderProps> = ({ onFileProcessed }) => {
    const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
    const [isUsernameDropdownOpen, setIsUsernameDropdownOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('Choose the unit system');
    const [role, setRole] = useState('');

    const { setSelectedUnitId } = useUnitSystem();

    const { loading: userLoading, error: userError, data: userData } = useQuery(GET_CURRENT_USER);
    const { loading: unitSystemsLoading, error: unitSystemsError, data: unitSystemsData } = useUnitSystemsQuery();
    const { error: userUnitSystemError, data: userUnitSystemData } = useUserUnitSystemQuery(userId);
    const { updateProfileUnitSystem } = useUpdateProfileUnitSystem();

    const unitDropdownRef = useRef<HTMLDivElement>(null);
    const usernameDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (userData && userData.me) {
            setUsername(userData.me.username);
            setUserId(userData.me.id);
            const userRole = capitalizeRole(userData.me.groups[0].name);
            setRole(userRole);
            Cookies.set("role", userRole);
        }
    }, [userData]);

    useEffect(() => {
        if (userUnitSystemData && userUnitSystemData.profileById) {
            const unitSystemName = userUnitSystemData.profileById.unitsystem?.name?.en;
            setSelectedUnit(unitSystemName || 'Choose the unit system');
            const unitSystemId = userUnitSystemData.profileById.unitsystem?.id || '';
            setSelectedUnitId(unitSystemId);
        }
    }, [userUnitSystemData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                unitDropdownRef.current &&
                !unitDropdownRef.current.contains(event.target as Node)
            ) {
                setIsUnitDropdownOpen(false);
            }
            if (
                usernameDropdownRef.current &&
                !usernameDropdownRef.current.contains(event.target as Node)
            ) {
                setIsUsernameDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (userLoading || unitSystemsLoading) console.log("Loading...");
    if (userError) console.log("Error:" + userError.message);
    if (unitSystemsError) console.log("Error:" + unitSystemsError.message);
    if (userUnitSystemError) console.log("Error:" + userUnitSystemError.message);

    const toggleUnitDropdown = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsUnitDropdownOpen(prevState => !prevState);
    };

    const toggleUsernameDropdown = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsUsernameDropdownOpen(prevState => !prevState);
    };

    const handleUnitSelection = async (unit: any) => {
        if (!unit || !unit.id || !unit.name || !unit.name.en) {
            console.error('Invalid unit data:', unit);
            return;
        }
        setSelectedUnit(unit.name.en);
        setSelectedUnitId(unit.id);
        setIsUnitDropdownOpen(false);

        try {
            await updateProfileUnitSystem({
                variables: {
                    input: {
                        userId: userId,
                        unitsystemId: unit.id
                    }
                }
            });
        } catch (e) {
            console.error('Error updating profile unit system:', e);
        }
    };

    const handleLogout = () => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('csrftoken');
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('refresh_token');
        window.location.href = import.meta.env.VITE_LOGOUT_USER_FRONTEND; // Redirect to login page
    };

    const capitalizeRole = (role: string) => {
        return role.charAt(0).toUpperCase() + role.slice(1);
    };

    return (
        <div className="header">
            <div className="header-left">
                <UploadCsvFileButton role={role} onFileProcessed={onFileProcessed}/>
            </div>

            <div className="header-center">
                <span className="heading">Unit System:</span>
                <div className="choose-unit" onClick={toggleUnitDropdown} ref={unitDropdownRef}>
                    <p>{selectedUnit} <span className={`arrow ${isUnitDropdownOpen ? 'open' : ''}`}></span></p>
                    {isUnitDropdownOpen && (
                        <div className="dropdown">
                            {unitSystemsData?.unitSystems.map((unit: any) => (
                                <button key={unit.id} onClick={() => handleUnitSelection(unit)}>
                                    {unit.name.en}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="header-right">
                <span className="heading">{capitalizeRole(role)}</span>
                <div className="username" onClick={toggleUsernameDropdown} ref={usernameDropdownRef}>
                    <p>{username} <span className={`arrow ${isUsernameDropdownOpen ? 'open' : ''}`}></span></p>
                    {isUsernameDropdownOpen && (
                        <div className="dropdown">
                            <button onClick={handleLogout}><p>LogOut</p></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
