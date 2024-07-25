import React, { useState, useEffect } from 'react';
import './Header.css';
import { useQuery } from '@apollo/client';
import GET_CURRENT_USER from '../../graphql/queries/get_current_user';
import Cookies from 'js-cookie';
import { useUnitSystemsQuery } from '../../lib/hooks/useUnitSystemsQuery';
import { useUserUnitSystemQuery } from '../../lib/hooks/useUserUnitSystemQuery';
import { useUpdateProfileUnitSystem } from '../../lib/hooks/UnitSystem/useUpdateProfileUnitSystem';

interface HeaderProps {
    setSelectedUnitId: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ setSelectedUnitId }) => {
    const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
    const [isUsernameDropdownOpen, setIsUsernameDropdownOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('Choose the unit system..');

    const { loading: userLoading, error: userError, data: userData } = useQuery(GET_CURRENT_USER);
    const { loading: unitSystemsLoading, error: unitSystemsError, data: unitSystemsData } = useUnitSystemsQuery();
    const { error: userUnitSystemError, data: userUnitSystemData } = useUserUnitSystemQuery(userId);
    const { updateProfileUnitSystem } = useUpdateProfileUnitSystem();

    useEffect(() => {
        if (userData && userData.me) {
            setUsername(userData.me.username);
            setUserId(userData.me.id)
            Cookies.set("role", userData.me.groups[0].name);
        }
    }, [userData]);

    useEffect(() => {
        if (userUnitSystemData && userUnitSystemData.profileById) {
            const unitSystemName = userUnitSystemData.profileById.unitsystem?.name?.en;
            setSelectedUnit(unitSystemName || 'Choose the unit system..');
            const unitSystemId = userUnitSystemData.profileById.unitsystem?.id || '';
            setSelectedUnitId(unitSystemId);
        }
    }, [userUnitSystemData]);

    if (userLoading || unitSystemsLoading) console.log("Loading...");
    if (userError) console.log("Error:" + userError.message);
    if (unitSystemsError) console.log("Error:" + unitSystemsError.message);
    if (userUnitSystemError) console.log("Error:" + userUnitSystemError.message);

    const toggleUnitDropdown = () => {
        setIsUnitDropdownOpen(!isUnitDropdownOpen);
    };

    const toggleUsernameDropdown = () => {
        setIsUsernameDropdownOpen(!isUsernameDropdownOpen);
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
        window.location.href = 'https://172.20.10.6/api/logout'; // Redirect to login page
    };

    return (
        <div className="header">
            <div className="header-left">
                {/* You can add left-side content here if needed */}
            </div>

            <div className="header-center">
                <div className="choose-unit" onClick={toggleUnitDropdown}>
                    <p>{selectedUnit}</p>
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
                <div className="username" onClick={toggleUsernameDropdown}>
                    <p>{username}</p>
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
