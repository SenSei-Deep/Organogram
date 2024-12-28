import React, { useState, useEffect } from 'react';
import OrgChart from './OrgChart';
import { transformDataToHierarchy } from './transformData'; // Import the transformation function
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary

// Import Corporate Office data
import corporateOfficeData from './data/Corporate_data.json'; // Corporate Office data

const App = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [departmentData, setDepartmentData] = useState(corporateOfficeData); // Default to Corporate Office data

  const handleNodeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // Transform data to hierarchy
  const hierarchyData = departmentData ? transformDataToHierarchy(departmentData) : [];

  // Debugging: Log data updates
  useEffect(() => {
    console.log('Department Data:', departmentData);
    console.log('Hierarchy Data:', hierarchyData);
  }, [departmentData, hierarchyData]);

  return (
    <ErrorBoundary>
      <div>
        <h1>Organogram</h1>

        {/* Render org chart only if data is available */}
        {hierarchyData.length > 0 ? (
          <OrgChart data={hierarchyData} onNodeClick={handleNodeClick} />
        ) : (
          <p>No data available for this department.</p>
        )}

        Employee details section
        {/* {selectedEmployee && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Employee Details</h2>
            <p><strong>Name:</strong> {selectedEmployee.EMPLOYEE_LEGAL_NAME || 'Unknown'}</p>
            <p><strong>Designation:</strong> {selectedEmployee.EMPLOYEE_DESIGNATION_NAME || 'Unknown Designation'}</p>
            <p><strong>Reports To:</strong> {selectedEmployee.EMPLOYEE_REPORTING_TO || 'No Manager'}</p>
            <p><strong>Department:</strong> {selectedEmployee.EMPLOYEE_DEPARTMENT_NAME || 'Unknown Department'}</p>
            <p><strong>CTC:</strong> {selectedEmployee.EMPLOYEE_CTC || 'Not Available'}</p>
          </div>
        )} */}
      </div>
    </ErrorBoundary>
  );
};

export default App;
