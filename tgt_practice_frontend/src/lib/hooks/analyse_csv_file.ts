import { useQuery } from "@apollo/client";
import { ANALYSE_CSV_FILE } from "src/graphql/queries/analyse_csv_file.ts";

interface AnalyseCsvFileProps {
    file: string | ArrayBuffer | FileReader;
}

export const useAnalyseCsvFile = ({ file } : AnalyseCsvFileProps) => {
    const {data, loading, error} = useQuery(ANALYSE_CSV_FILE, {variables: { file }});

    return {
        data,
        loading,
        error,
    };
};
