import React, { useState, useEffect } from 'react';
import OrgChart from './OrgChart';
import { transformDataToHierarchy } from './transformData'; // Import the transformation function
import ErrorBoundary from './ErrorBoundary'; // Import ErrorBoundary

// Import department-specific data
import cardiologyData from './data/cardiology.json'; // Cardiology data
import corporateOfficeData from './data/corporateOffice.json'; // Corporate Office data

const App = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [departmentData, setDepartmentData] = useState(cardiologyData); // Default to Cardiology data
  const [currentDepartment, setCurrentDepartment] = useState('Cardiology'); // Track current department

  // Function to get the manager's name based on Manager ID
  const getManagerName = (managerId, allEmployees) => {
    if (!managerId) return 'No Manager'; // Handle missing manager
    const manager = allEmployees.find(emp => emp["Employee ID"] === managerId);
    return manager ? manager.Name : 'No Manager';
  };

  const handleDepartmentChange = (department) => {
    // Clear selected employee details
    setSelectedEmployee(null);

    // Load the corresponding department data
    switch (department) {
      case 'Cardiology':
        setDepartmentData(cardiologyData);
        setCurrentDepartment('Cardiology');
        break;
      case 'Corporate Office':
        setDepartmentData(corporateOfficeData);
        setCurrentDepartment('Corporate Office');
        break;
      default:
        setDepartmentData([]);
        setCurrentDepartment('');
        break;
    }
  };

  const handleNodeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  // Transform data to hierarchy
  const hierarchyData = departmentData ? transformDataToHierarchy(departmentData) : [];

  // Debugging: Log data updates
  useEffect(() => {
    console.log('Selected Department:', currentDepartment);
    console.log('Department Data:', departmentData);
    console.log('Hierarchy Data:', hierarchyData);
  }, [departmentData, hierarchyData]);

  return (
    <ErrorBoundary>
      <div>
        <h1>Organogram</h1>

        {/* Navbar for department selection */}
        <nav>
          <button
            onClick={() => handleDepartmentChange('Cardiology')}
            style={{
              backgroundColor: currentDepartment === 'Cardiology' ? 'lightblue' : 'white',
              marginRight: '10px',
            }}
          >
            Cardiology
          </button>
          <button
            onClick={() => handleDepartmentChange('Corporate Office')}
            style={{
              backgroundColor: currentDepartment === 'Corporate Office' ? 'lightblue' : 'white',
            }}
          >
            Corporate Office
          </button>
        </nav>

        {/* Render org chart only if data is available */}
        {hierarchyData.length > 0 ? (
          <OrgChart data={hierarchyData} onNodeClick={handleNodeClick} />
        ) : (
          <p>No data available for this department.</p>
        )}

        {/* Employee details section */}
        {selectedEmployee && (
          <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Employee Details</h2>
            <p><strong>Name:</strong> {selectedEmployee.Name || 'Unknown'}</p>
            <p><strong>Department:</strong> {selectedEmployee.Department || 'Unknown Department'}</p>
            <p><strong>Job Title:</strong> {selectedEmployee["Job Title"] || 'No Title'}</p>
            <p><strong>Reports To:</strong> {getManagerName(selectedEmployee["Manager ID"], departmentData) || 'No Manager'}</p>
            <p><strong>Experience:</strong> {selectedEmployee.Experience || 'No Experience Info'}</p>
            <p><strong>Salary:</strong> {selectedEmployee.Salary || 'No Salary Info'}</p>
            <p><strong>Joining Date:</strong> {selectedEmployee["Joining Date"] || 'No Joining Date Info'}</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
