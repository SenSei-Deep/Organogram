import React, { useState, useRef, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./OrgChart.css";

const OrgChart = ({ data, onNodeClick }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [zoomLevel, setZoomLevel] = useState(1); // Zoom level state
  const chartRef = useRef();

  const handleNodeClick = (node) => {
    if (!node.EMPLOYEE_LEGAL_NAME) {
      console.error("Node does not have a Name property:", node);
      return;
    }

    const sanitizedNodeName = node.EMPLOYEE_LEGAL_NAME.replace(/\s+/g, "_");
    const isExpanded = expandedNodes.includes(node.EMPLOYEE_LEGAL_NAME);

    if (isExpanded) {
      setExpandedNodes(expandedNodes.filter((name) => name !== node.EMPLOYEE_LEGAL_NAME));
    } else {
      setExpandedNodes([...expandedNodes, node.EMPLOYEE_LEGAL_NAME]);
    }
    onNodeClick(node);

    const currentNodeRef = chartRef.current.querySelector(`#${sanitizedNodeName}`);
    if (currentNodeRef) {
      currentNodeRef.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  };

  const handleSearch = () => {
    if (!searchQuery) return;

    const sanitizedQuery = searchQuery.toLowerCase();
    const matchingNode = findNode(data, (node) =>
      node.EMPLOYEE_LEGAL_NAME.toLowerCase().includes(sanitizedQuery)
    );

    if (matchingNode) {
      const sanitizedNodeName = matchingNode.EMPLOYEE_LEGAL_NAME.replace(/\s+/g, "_");
      const currentNodeRef = chartRef.current.querySelector(`#${sanitizedNodeName}`);
      if (currentNodeRef) {
        currentNodeRef.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
        setExpandedNodes([...expandedNodes, matchingNode.EMPLOYEE_LEGAL_NAME]);
      }
    } else {
      alert("No match found!");
    }
  };

  const findNode = (nodes, predicate) => {
    for (const node of nodes) {
      if (predicate(node)) return node;
      if (node.children) {
        const found = findNode(node.children, predicate);
        if (found) return found;
      }
    }
    return null;
  };

  const handleZoom = (direction) => {
    setZoomLevel((prevZoom) => Math.min(2, Math.max(0.5, prevZoom + direction)));
  };

  const fitToView = () => {
    if (!chartRef.current) return;

    const container = chartRef.current.parentElement;
    const visibleNodes = Array.from(chartRef.current.querySelectorAll(".org-node")).filter((node) =>
      expandedNodes.includes(node.id)
    );

    if (visibleNodes.length === 0) return;

    const boundingBox = visibleNodes.reduce(
      (acc, node) => {
        const rect = node.getBoundingClientRect();
        return {
          left: Math.min(acc.left, rect.left),
          top: Math.min(acc.top, rect.top),
          right: Math.max(acc.right, rect.right),
          bottom: Math.max(acc.bottom, rect.bottom),
        };
      },
      { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
    );

    const boundingBoxWidth = boundingBox.right - boundingBox.left;
    const boundingBoxHeight = boundingBox.bottom - boundingBox.top;

    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    const zoomX = containerWidth / boundingBoxWidth;
    const zoomY = containerHeight / boundingBoxHeight;
    const zoom = Math.min(zoomX, zoomY, 1);

    setZoomLevel(zoom);

    const scrollLeft = boundingBox.left + boundingBoxWidth / 2 - containerWidth / (2 * zoom);
    const scrollTop = boundingBox.top + boundingBoxHeight / 2 - containerHeight / (2 * zoom);

    container.scrollTo({
      left: scrollLeft,
      top: scrollTop,
      behavior: "smooth",
    });
  };

  const [activeTooltips, setActiveTooltips] = useState([]); // State to track active tooltips

  const renderNode = (node) => {
    const isExpanded = expandedNodes.includes(node.EMPLOYEE_LEGAL_NAME);
    const isVerticalLayout = node.children && node.children.length > 10;
  
    const placeholderPhoto =
      node.PERSONAL_GENDER === "Female"
        ? "https://via.placeholder.com/50/FFC0CB/000000?text=♀"
        : "https://via.placeholder.com/50/87CEEB/000000?text=♂";
  
    const toggleTooltip = (e, nodeName) => {
      e.stopPropagation();
      setActiveTooltips((prev) =>
        prev.includes(nodeName) ? prev.filter((name) => name !== nodeName) : [...prev, nodeName]
      );
    };
  
    return (
      <div
        id={node.EMPLOYEE_LEGAL_NAME}
        className={`org-node ${isExpanded ? "expanded-node expanded-box" : ""} ${
          isVerticalLayout ? "vertical-layout" : ""
        }`}
        key={node.EMPLOYEE_LEGAL_NAME}
      >
        <div
          onClick={() => handleNodeClick(node)}
          className={`org-node-content ${isExpanded ? "expanded" : ""}`}
        >
          <div className="org-node-header">
            {node.children && node.children.length > 0 && (
              <span className="expand-collapse">{isExpanded ? "-" : "+"}</span>
            )}
            <div>
              <img
                src={placeholderPhoto}
                alt={`${node.PERSONAL_GENDER === "Female" ? "Female" : "Male"} Placeholder`}
                className="employee-photo"
              />
              <p className="org-node-title">{node.EMPLOYEE_LEGAL_NAME}</p>
              <p className="org-node-title">({node.EMPLOYEE_DEPARTMENT_NAME})</p>
              <p className="org-node-subtitle">{node["Job Title"]}</p>
            </div>
            <button
              className="tooltip-button"
              onClick={(e) => toggleTooltip(e, node.EMPLOYEE_LEGAL_NAME)}
            >
              Details
            </button>
          </div>
          {activeTooltips.includes(node.EMPLOYEE_LEGAL_NAME) && (
            <div className="tooltip">
              <p>
                <strong>Name:</strong> {node.EMPLOYEE_LEGAL_NAME}
              </p>
              <p>
                <strong>Designation:</strong> {node.EMPLOYEE_DESIGNATION_NAME || "Unknown"}
              </p>
              <p>
                <strong>Department:</strong> {node.EMPLOYEE_DEPARTMENT_NAME || "Unknown"}
              </p>
              <p>
                <strong>CTC:</strong> {node.EMPLOYEE_CTC || "Not Available"}
              </p>
              <p>
                <strong>Reports To:</strong> {node.EMPLOYEE_REPORTING_TO || "No Manager"}
              </p>
            </div>
          )}
            {node.children && node.children.length > 0 && (
            <span className="child-count">{node.children.length}</span>
          )}
        </div>
        {isExpanded && node.children && (
          <div className="org-children">
            <TransitionGroup component={null}>
              {node.children.map((child) => (
                <CSSTransition key={child.EMPLOYEE_LEGAL_NAME} timeout={300} classNames="fade">
                  <div>{renderNode(child)}</div>
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        )}
      </div>
    );
  };
  
  
  return (
    <div>
      <div className="zoom-controls">
        <button onClick={fitToView}>Fit to View</button>
      </div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="scroll-container">
        <div className="org-chart-container" ref={chartRef} style={{ transform: `scale(${zoomLevel})` }}>
          {data && data.length > 0 ? (
            data.map((node) => renderNode(node))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgChart;
