import React, { useState } from "react";
import ReactFileReader from 'react-file-reader';
import { useAnalyseCsvFile } from "src/lib/hooks/analyse_csv_file.ts";
import { useModal } from "src/contexts/ModalContext.tsx";

interface UploadCsvFileButtonProps {
    role: string | undefined;
    onFileProcessed: (data: any) => void;
}

const UploadCsvFileButton: React.FC<UploadCsvFileButtonProps> = ({ role, onFileProcessed }) => {
    const [fileContent, setFileContent] = useState<string | null>(null);
    const { setModal, setModalContent } = useModal();
    const { data, loading, error } = useAnalyseCsvFile({ file: fileContent });

    const showMessageModal = (message: string) => {
        setModalContent(<div>{message}</div>);
        setModal(true);
    };

    const handleFileChange = async (files: File[]) => {
        if (!files || files.length === 0) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target?.result;
            if (content) {
                setFileContent(content.toString()); // Store the file content in state
            }
        };
        reader.readAsText(files[0]);
    };

    // Effect to handle the loading state and data after file content is set
    React.useEffect(() => {
        if (loading) {
            console.log("Analyzing CSV file...");
        }

        if (error) {
            console.log("Error occurred while analyzing the CSV file.");
        }

        if (data) {
            onFileProcessed(data);
        }
    }, [loading, error, data]);

    return (
        <div className="display-content-info-csv">
            <div className="info-csv-buttons">
                <ReactFileReader handleFiles={handleFileChange} fileTypes={'.csv'} disabled={role === 'User'}>
                    <button className='btn'>Import CSV</button>
                </ReactFileReader>
            </div>
        </div>
    );
};

export default UploadCsvFileButton;
