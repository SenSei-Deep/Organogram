import React, { useState, useRef, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./OrgChart.css";

const OrgChart = ({ data, onNodeClick }) => {
  const [expandedNodes, setExpandedNodes] = useState([]); // State for expanded nodes
  const chartRef = useRef(); // To refer to the entire chart container
  const isPanning = useRef(false); // Flag to track if panning is active
  const startPos = useRef({ x: 0, y: 0 }); // Starting mouse position for panning

  // Handle node click (expand/collapse)
  const handleNodeClick = (node) => {
    if (!node.EMPLOYEE_LEGAL_NAME) {
      console.error("Node does not have a Name property:", node);
      return; // Exit the function early if Name is undefined
  }
    const sanitizedNodeName = node.EMPLOYEE_LEGAL_NAME.replace(/\s+/g, "_"); // Replace spaces with underscores
    const isExpanded = expandedNodes.includes(node.EMPLOYEE_LEGAL_NAME);
    if (isExpanded) {
      setExpandedNodes(expandedNodes.filter((name) => name !== node.EMPLOYEE_LEGAL_NAME)); // Collapse node
    } else {
      setExpandedNodes([...expandedNodes, node.EMPLOYEE_LEGAL_NAME]); // Expand node
    }
    onNodeClick(node); // Callback for additional functionality

    // Scroll the node into the center of the viewport
    const currentNodeRef = chartRef.current.querySelector(`#${sanitizedNodeName}`);
    if (currentNodeRef) {
      currentNodeRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  // Function to start panning (on mousedown)
  const startPanning = (e) => {
    isPanning.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    chartRef.current.style.cursor = "grabbing"; // Change cursor to indicate panning
  };

  // Function to perform panning (on mousemove)
  const pan = (e) => {
    if (!isPanning.current) return;

    const dx = e.clientX - startPos.current.x; // Calculate horizontal movement
    const dy = e.clientY - startPos.current.y; // Calculate vertical movement

    // Update scroll position based on mouse movement
    chartRef.current.scrollLeft -= dx;
    chartRef.current.scrollTop -= dy;

    startPos.current = { x: e.clientX, y: e.clientY }; // Update start position for the next move
  };

  // Function to stop panning (on mouseup)
  const stopPanning = () => {
    isPanning.current = false;
    chartRef.current.style.cursor = "grab"; // Reset cursor to default
  };

  // Render a node (display expanded/collapsed nodes)
// Inside the renderNode function
const renderNode = (node) => {
  const isExpanded = expandedNodes.includes(node.EMPLOYEE_LEGAL_NAME);
  const isVerticalLayout = node.children && node.children.length > 10; // Check if more than 10 children

  return (
    <div
      id={node.EMPLOYEE_LEGAL_NAME}
      className={`org-node ${isExpanded ? "expanded-node expanded-box" : ""} ${isVerticalLayout ? "vertical-layout" : ""}`}
      key={node.EMPLOYEE_LEGAL_NAME}
    >
      <div
        onClick={() => handleNodeClick(node)}
        className={`org-node-content ${isExpanded ? "expanded" : ""}`}
      >
        <div className="org-node-header">
          {node.children && node.children.length > 0 && (
            <span className="expand-collapse">
              {isExpanded ? "-" : "+"}
            </span>
          )}
          <div>
            <p className="org-node-title">
              {node.EMPLOYEE_LEGAL_NAME} ({node.EMPLOYEE_DEPARTMENT_NAME})
            </p>
            <p className="org-node-subtitle">{node["Job Title"]}</p>
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <span className="child-count">{node.children.length}</span>
        )}
      </div>
      {isExpanded && node.children && (
        <div className="org-children">
          <TransitionGroup component={null}>
            {node.children.map((child) => (
              <CSSTransition key={child.Name} timeout={300} classNames="fade">
                <div>{renderNode(child)}</div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      )}
    </div>
  );
};

  useEffect(() => {
    const chartContainer = chartRef.current;

    // Attach mouse event listeners for panning
    chartContainer.addEventListener("mousedown", startPanning);
    chartContainer.addEventListener("mousemove", pan);
    chartContainer.addEventListener("mouseup", stopPanning);
    chartContainer.addEventListener("mouseleave", stopPanning); // Stop panning if mouse leaves the chart

    // Clean up event listeners
    return () => {
      chartContainer.removeEventListener("mousedown", startPanning);
      chartContainer.removeEventListener("mousemove", pan);
      chartContainer.removeEventListener("mouseup", stopPanning);
      chartContainer.removeEventListener("mouseleave", stopPanning);
    };
  }, []);

  return (
    <div className="org-chart-container" ref={chartRef}>
      {data && data.length > 0 ? (
        data.map((node) => renderNode(node))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default OrgChart;
