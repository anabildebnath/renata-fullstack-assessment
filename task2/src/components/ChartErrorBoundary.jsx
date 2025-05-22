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
        <div className="w-full p-4 rounded-lg bg-gray-50 flex items-center justify-center min-h-[300px]">
          <p className="text-gray-500">Unable to load chart</p>
        </div>
      );
    }

    return this.props.children;
  }
}
