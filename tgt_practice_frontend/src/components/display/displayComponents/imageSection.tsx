import React from "react";

interface ImageSectionProps {
    img: string;
    sn: string;
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

const ImageSection: React.FC<ImageSectionProps> = ({ img, sn }) => (
    <div className="display-content-info-image">
        <img src={img} width={"100px"} alt={"alter image description"} />
        <div className="info-image-buttons">
            <button onClick={() => {handleImageExport(img, sn)}}>Export Image</button>
            <button>Import Image</button>
        </div>
    </div>
);

export default ImageSection;
