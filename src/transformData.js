export const transformDataToHierarchy = (data) => {
  console.log('Transforming Data:', data); // Debugging: Check the data being passed

  const employeesMap = {};

  // Create a map of employees by their EMPLOYEE_EMPLOYEE_ID
  data.forEach(employee => {
    employeesMap[employee["EMPLOYEE_EMPLOYEE_ID"]] = { ...employee, children: [] };
  });

  const hierarchy = [];

  data.forEach(employee => {
    const managerName = employee["EMPLOYEE_REPORTING_TO"];
    if (managerName) {
      // Find the manager by their EMPLOYEE_LEGAL_NAME
      const manager = Object.values(employeesMap).find(emp => emp["EMPLOYEE_LEGAL_NAME"] === managerName);
      if (manager) {
        manager.children.push(employeesMap[employee["EMPLOYEE_EMPLOYEE_ID"]]);
      } else {
        // If manager is not found, consider it a root node
        hierarchy.push(employeesMap[employee["EMPLOYEE_EMPLOYEE_ID"]]);
      }
    } else {
      // If no manager is specified, this is a root node
      hierarchy.push(employeesMap[employee["EMPLOYEE_EMPLOYEE_ID"]]);
    }
  });

  console.log('Hierarchy Data:', hierarchy); // Debugging: Check the transformed hierarchy
  return hierarchy;
};
