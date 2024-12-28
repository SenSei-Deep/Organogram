// src/ErrorBoundary.js
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state to indicate an error occurred
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service here
    console.log('Error caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      // Customize the fallback UI when an error occurs
      return <div>Error occurred: {this.state.errorMessage}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
