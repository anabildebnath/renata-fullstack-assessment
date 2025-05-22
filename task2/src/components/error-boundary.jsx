import React from 'react';

export class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Chart Error</h3>
            <p className="text-gray-500">There was an error loading this chart.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
