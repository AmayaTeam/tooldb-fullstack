import React, { useRef, useState } from "react";
import imageCompression from 'browser-image-compression';
import { useUpdateToolModule } from "src/lib/hooks/ToolModule/useUpdateToolModule";

interface ImageSectionProps {
    toolModuleId: string,
    img: string;
    sn: string;
    role: string | undefined;
}

const handleImageExport = async (img: string, sn: string) => {
    if (img !== undefined) {
        const imgBlob = await fetch(img).then(res => res.blob());
        const imgUrl = URL.createObjectURL(imgBlob);
        const link = document.createElement('a');
        link.href = imgUrl;
        link.download = sn + '.png';
        link.click();
    }
};

const ImageSection: React.FC<ImageSectionProps> = ({ toolModuleId, img, sn, role }) => {
    const initImage = "data:image/png;base64," + img;
    const [displayImage, setDisplayImage] = useState<string>(initImage);


    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { updateToolModule } = useUpdateToolModule();

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const base64Image = await convertToBase64(file);

        const filteredBase64 = deleteStartingChars(base64Image);

        uploadImage(filteredBase64);

        setDisplayImage(base64Image);

    };

    const deleteStartingChars = (base64Image: string) => {
        return base64Image.slice(22);
    }

    const convertToBase64 = async (file: File): Promise<string> => {
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 800,
                useWebWorker: true,
                fileType: 'image/png',
            };

            const compressedFile = await imageCompression(file, options);
            const base64 = await imageCompression.getDataUrlFromFile(compressedFile);

            return base64;
        } catch (error) {
            throw new Error('Failed to convert file to base64');
        }
    };


    const uploadImage = async (base64Image: string) => {
        try {
            await updateToolModule({
                variables: {
                    "input": {
                        "id": toolModuleId,
                        "image": base64Image
                    }
                }
            });
        } catch (error) {
            throw new Error('Failed to save image');
        }
    };

    return (

        <div className="display-content-info-image">
            {displayImage && displayImage.length > 'data:image/png;base64,'.length &&
                displayImage.length > 'data:image/png;base64,null'.length ? (
                <img src={displayImage} width={"100px"} alt={"Изображение отсутствует"} />
            ) : (
                <div className="no-image-message">Изображение отсутствует</div>
            )}
            <div className="info-image-buttons">
                <button onClick={() => { handleImageExport(displayImage, sn) }}
                    disabled={!(displayImage && displayImage.length > 'data:image/png;base64,'.length)}>Export Image</button>
                <button onClick={handleButtonClick} disabled={role === 'User'}>Import Image</button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default ImageSection;
