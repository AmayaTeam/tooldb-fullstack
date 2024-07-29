import React from "react";

interface ImageSectionProps {
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

const ImageSection: React.FC<ImageSectionProps> = ({ img, sn, role}) => (
    <div className="display-content-info-image">
        {img && img.length > 'data:image/png;base64,'.length ? (
            <img src={img} width={"100px"} alt={"Изображение отсутствует"}/>
        ) : (
            <div className="no-image-message">Изображение отсутствует</div>
        )}
        <div className="info-image-buttons">
            <button onClick={() => {handleImageExport(img, sn)}}
                    disabled={!(img && img.length > 'data:image/png;base64,'.length)}>Export Image</button>
            <button disabled={role === 'user' || !(img && img.length > 'data:image/png;base64,'.length)}>Import Image</button>
        </div>
    </div>
);

export default ImageSection;
