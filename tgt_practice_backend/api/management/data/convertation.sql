CREATE TABLE toolmodule (
    id UUID PRIMARY KEY,
    r_module_type_id UUID,
    sn_ TEXT,
    dbdate_ DATE,
    dbversion_ TEXT,
    dbsn_ TEXT,
    dbcomment_ TEXT,
    dbtname_ TEXT,
    dbtlength DOUBLE PRECISION,
    dbtweight DOUBLE PRECISION,
    dbtmax_od_ DOUBLE PRECISION,
    dbtmax_od_collapsed_ DOUBLE PRECISION,
    dbtmax_od_opened_ DOUBLE PRECISION,
    dbtimage2d_ TEXT,
    dbtimage_h_shift DOUBLE PRECISION,
    dbtimage_h_scale DOUBLE PRECISION,
    dbtimage_h_y1 DOUBLE PRECISION,
    dbtimage_h_y2 DOUBLE PRECISION,
    dbtcomp_str DOUBLE PRECISION,
    image BYTEA,
    FOREIGN KEY (r_module_type_id) REFERENCES toolmoduletype(id)
);

INSERT INTO toolmodule (id, r_module_type_id, sn_, dbdate_, dbversion_, dbsn_, dbcomment_, dbtname_, dbtlength, dbtweight, dbtmax_od_, dbtmax_od_collapsed_, dbtmax_od_opened_, dbtimage2d_, dbtimage_h_shift, dbtimage_h_scale, dbtimage_h_y1, dbtimage_h_y2, dbtcomp_str)
SELECT ToolModules.id,
       ToolModules.r_module_type_id,
       ToolModules.sn_,
       ToolModuleDeviceBoard.date_ AS dbdate_,
       ToolModuleDeviceBoard.version_ AS dbversion_,
       ToolModuleDeviceBoard.sn_ AS dbsn_,
       ToolModuleDeviceBoard.comment_ AS dbcomment_,
       ToolModuleDeviceBoardType.name AS dbtname_,
       ToolModuleDeviceBoardType.length_ AS dbtlength,
       ToolModuleDeviceBoardType.weight_ AS dbtweight,
       ToolModuleDeviceBoardType.max_od_ AS dbtmax_od_,
       ToolModuleDeviceBoardType.max_od_collapsed_ AS dbtmax_od_collapsed_,
       ToolModuleDeviceBoardType.max_od_opened_ AS dbtmax_od_opened_,
       ToolModuleDeviceBoardType.image_2d_ AS dbtimage2d_,
       ToolModuleDeviceBoardType.image_h_shift AS dbtimage_h_shift,
       ToolModuleDeviceBoardType.image_h_scale AS dbtimage_h_scale,
       ToolModuleDeviceBoardType.image_h_y1 AS dbtimage_h_y1,
       ToolModuleDeviceBoardType.image_h_y2 AS dbtimage_h_y2,
       ToolModuleDeviceBoardType.comp_str AS dbtcomp_str
FROM ToolModules
LEFT JOIN
ToolModuleType ON ToolModuleType.id = ToolModules.r_module_type_id
LEFT JOIN
ToolModuleDeviceBoard ON ToolModules.r_tool_module_device_board_id = ToolModuleDeviceBoard.id
LEFT JOIN
ToolModuleDeviceBoardType ON ToolModuleDeviceBoardType.id = ToolModuleDeviceBoard.r_type_device_board_id;

CREATE TABLE toolinstalledsensor (
    id UUID PRIMARY KEY,
    r_toolmodule_id UUID,
    r_toolsensortype_id UUID,
    record_point_ DOUBLE PRECISION,
    FOREIGN KEY (r_toolmodule_id) REFERENCES toolmodule(id),
    FOREIGN KEY (r_toolsensortype_id) REFERENCES toolsensors(id)
);

INSERT INTO toolinstalledsensor (id, r_toolmodule_id, r_toolsensortype_id, record_point_)
SELECT toolsensorsinstalledsences.id as toolsensorsinstalledsences_id,
    ToolModules.id as r_toolmodule_id,
    toolsensorsinstalledsences.r_sensors_id as r_toolsensortype_id
 ,toolsensorsinstalledsences.record_point_
FROM ToolModules
LEFT JOIN
ToolModuleDeviceBoard ON ToolModules.r_tool_module_device_board_id = ToolModuleDeviceBoard.id
LEFT JOIN
ToolModuleDeviceBoardType ON ToolModuleDeviceBoardType.id = ToolModuleDeviceBoard.r_type_device_board_id
LEFT JOIN
toolsensorsinstalledsences on toolsensorsinstalledsences.r_device_board_type_id = ToolModuleDeviceBoardType.id
WHERE
    toolsensorsinstalledsences.id IS NOT NULL;

ALTER TABLE toolmodulegroup
DROP COLUMN group_id,
DROP COLUMN module_group_id;

ALTER TABLE toolmoduletype
DROP COLUMN tool_id_;