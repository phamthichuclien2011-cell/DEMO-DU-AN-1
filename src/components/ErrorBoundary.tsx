import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Đã xảy ra lỗi không mong muốn.';
      let isJsonError = false;

      try {
        const parsed = JSON.parse(this.state.error?.message || '');
        if (parsed.error) {
          isJsonError = true;
          errorMessage = `Lỗi hệ thống: ${parsed.error}`;
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 text-center border border-red-100">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-800 mb-4">Rất tiếc! Có lỗi xảy ra</h1>
            <div className="bg-red-50 p-4 rounded-2xl mb-8 text-left">
              <p className="text-red-600 text-sm font-medium break-words">
                {errorMessage}
              </p>
              {isJsonError && (
                <p className="text-red-400 text-[10px] mt-2 font-mono uppercase tracking-wider">
                  Vui lòng kiểm tra cấu hình Firebase hoặc Firestore Rules.
                </p>
              )}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Thử lại ngay
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
