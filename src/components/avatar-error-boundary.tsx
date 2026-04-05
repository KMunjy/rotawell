'use client';

import { Component, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AvatarErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Avatar component error:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
          <AlertCircle className="h-10 w-10 text-[#E8705A] mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {this.props.fallbackTitle || 'Something went wrong'}
          </h3>
          <p className="text-gray-600 text-sm mb-4 max-w-sm">
            The AI assistant encountered an unexpected error. Please try again.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-full bg-[#0A7E72] px-6 py-2 text-white text-sm font-medium hover:bg-[#096b61] transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
