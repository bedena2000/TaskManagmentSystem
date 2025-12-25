import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Home, RefreshCcw } from "lucide-react";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon Container */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white border border-red-100 p-6 rounded-3xl shadow-sm">
              <AlertCircle size={48} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl font-bold text-neutral-900 mb-3">
          Something went wrong
        </h1>
        <p className="text-neutral-500 mb-10 leading-relaxed">
          We couldn't find the page you're looking for or an unexpected error
          occurred. Don't worry, your tasks are safe!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate(-1)}
            variant="default"
            className="w-full h-12 gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="h-12 gap-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-xl"
            >
              <Home size={18} />
              Dashboard
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="h-12 gap-2 border-neutral-200 text-neutral-600 hover:bg-neutral-50 rounded-xl"
            >
              <RefreshCcw size={18} />
              Reload
            </Button>
          </div>
        </div>

        {/* Subtle Footer */}
        <p className="mt-12 text-sm text-neutral-400">
          If this keeps happening, please contact support.
        </p>
      </div>
    </div>
  );
}
