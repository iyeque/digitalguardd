import { Component } from "react";

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-red-100 text-red-800 font-mono text-sm max-w-xl mx-auto">
          <h3 className="font-bold text-lg mb-2">Something went wrong</h3>
          <pre className="whitespace-pre-wrap break-words">{this.state.error?.message}</pre>
          <pre className="whitespace-pre-wrap break-words text-xs mt-2">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
