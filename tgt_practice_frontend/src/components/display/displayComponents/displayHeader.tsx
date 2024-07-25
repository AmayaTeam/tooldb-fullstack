import React from "react";

interface DisplayHeaderProps {
    sn: string;
    groupName: string;
    moduleName: string;
    housing: string;
}

const DisplayHeader: React.FC<DisplayHeaderProps> = ({ sn, groupName, moduleName, housing }) => (
    <div className="display-content-title">
        <div className="title">
            <div className="heading-of-param">
                <h4 className="heading-of-param">SN :</h4>
            </div>
            <input type="text" defaultValue={sn} disabled={true} />
        </div>
        <div className="title">
            <div className="display-content-titles">
                <div className="title">
                    <div className="heading-of-param">
                        <h4 className="heading-of-param">Group: </h4>
                    </div>
                    <input type="text" defaultValue={groupName} disabled={true} />
                </div>
                <div className="title">
                    <div className="heading-of-param">
                        <h4 className="heading-of-param">Module Type: </h4>
                    </div>
                    <input type="text" defaultValue={moduleName} disabled={true} />
                </div>
            </div>
        </div>
        <div className="title">
            <div className="heading-of-param">
                <h4 className="heading-of-param">Housing: </h4>
            </div>
            <input type="text" defaultValue={housing} disabled={true} />
        </div>
    </div>
);

export default DisplayHeader;
