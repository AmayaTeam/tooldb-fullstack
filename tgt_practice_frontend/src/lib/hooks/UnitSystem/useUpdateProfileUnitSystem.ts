import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE_UNIT_SYSTEM} from "../../../graphql/mutations/UnitSystem/updateProfileUnitSystem.ts";

export const useUpdateProfileUnitSystem = () => {
    const [updateProfileUnitSystem, { data, loading, error }] = useMutation(UPDATE_PROFILE_UNIT_SYSTEM);

    return {
        updateProfileUnitSystem,
        data,
        loading,
        error,
    };
};
