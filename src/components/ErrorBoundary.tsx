import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface for debugging; wire to a logging service later.
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: undefined });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-5xl text-charcoal">Oops ✨</h1>
          <h2 className="mt-4 font-display text-2xl">Something went sideways.</h2>
          <p className="mt-2 text-sm text-mid-gray">
            This section hit an unexpected error. Try again, or head back home.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={this.handleReset} className="btn-secondary">
              Try again
            </button>
            <Link to="/" className="btn-primary" onClick={this.handleReset}>
              Go home
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
