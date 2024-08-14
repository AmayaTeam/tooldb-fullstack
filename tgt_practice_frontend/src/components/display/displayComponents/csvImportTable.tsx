import React, { useState } from "react";
import { Parameter, ToolModule } from "src/types/interfaces.ts";
import { useUploadToolModule } from "../../../lib/hooks/ToolModule/useUploadToolModule";

interface CsvImportTableProps {
  data: any;
}

const renderTableRows = (modules: ToolModule[], params: Parameter[]) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ODOO ID</th>
          <th>SN</th>
          <th>Group</th>
          <th>Module Type</th>
          {params.slice(0, 2).map((param: Parameter) => (
            <th key={param.id}>{param.parameterType.parameterName}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {modules.map((module: ToolModule) => {
          const weightIndex = params.findIndex(
            (parameter: Parameter) =>
              parameter.toolmodule.id === module.id &&
              parameter.parameterType.parameterName === "Weight"
          );

          const odIndex = params.findIndex(
            (parameter: Parameter) =>
              parameter.toolmodule.id === module.id &&
              parameter.parameterType.parameterName === "OD"
          );

          const weightValue =
            weightIndex !== -1
              ? params[weightIndex].parameterValue +
                " " +
                params[weightIndex].unit.name.en
              : "N/A";
          const odValue =
            odIndex !== -1
              ? params[odIndex].parameterValue +
                " " +
                params[odIndex].unit.name.en
              : "N/A";

          return (
            <tr key={module.id}>
              <td>{module.odooId}</td>
              <td>{module.sn}</td>
              <td>{module.rModuleType.rModulesGroup.name}</td>
              <td>{module.rModuleType.name}</td>
              <td>{weightValue}</td>
              <td>{odValue}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const CsvImportTable: React.FC<CsvImportTableProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const { uploadToolModule, loading: mutationLoading } = useUploadToolModule();

  const handleUpload = async () => {
    try {
      setLoading(true);
      await uploadToolModule({
        variables: {
          input: {
            data: JSON.stringify(data.analyseCsvFile)
          },
        },
      });
      console.log("Tool modules updated successfully!");
    } catch (err) {
      // Handle errors (e.g., show an error message)
      console.error("Error updating tool modules:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h4>Analysis CSV File</h4>
      <strong>New Modules</strong>
      {renderTableRows(
        data.analyseCsvFile.newModuleList,
        data.analyseCsvFile.newParameters
      )}
      <strong>Modified Modules</strong>
      {renderTableRows(
        data.analyseCsvFile.modifiedModuleList,
        data.analyseCsvFile.modifiedParameters
      )}
      <strong>Errors</strong>
      {/*{renderTableRows(data.analyseCsvFile.errorsList)}*/}
      <div className="display-content-buttons">
        <button onClick={handleUpload} disabled={loading || mutationLoading}>
          {loading || mutationLoading ? "Loading..." : "Upload"}
        </button>
      </div>
    </>
  );
};
export default CsvImportTable;
