import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFieldError } from "@/helpers";
import { signUp } from "@/queries";
import type { RegistrationErrorMessageInterface } from "@/types";
import { Loader2, Mail, Lock, UserPlus, Sparkles } from "lucide-react";
import backgroundLines from "@/assets/images/background_lines.png";

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationErrors, setRegistrationErrors] = useState<
    RegistrationErrorMessageInterface[]
  >([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      navigate("/login");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const errorsArray = error.response?.data?.errors || [];
        setRegistrationErrors(errorsArray);
        setServerError(message || "Registration failed");
      } else {
        navigate("/404");
      }
    },
  });

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Side: Visual / Info Card */}
      <div className="hidden lg:flex flex-[0.45] bg-[#040308] m-4 rounded-[2.5rem] p-16 flex-col justify-between relative overflow-hidden text-white">
        {/* Decorative Background */}
        <img
          src={backgroundLines}
          alt="decoration"
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40 pointer-events-none"
        />
        <div className="absolute top-1/4 right-[-10%] w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />

        <div className="z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium mb-8">
            <Sparkles size={14} className="text-blue-400" />
            <span>Join 2,000+ teams today</span>
          </div>
          <h2 className="text-5xl font-bold leading-tight">
            Start managing <br />
            <span className="text-blue-500">smarter</span>, not harder.
          </h2>
        </div>

        <div className="z-10 space-y-6">
          <div className="space-y-2">
            <p className="text-2xl font-semibold">Ready to scale?</p>
            <p className="text-neutral-400 max-w-sm">
              Create your projects, assign tasks, and track progress all in one
              unified workspace.
            </p>
          </div>

          {/* Progress Indicator Mock */}
          <div className="flex gap-2">
            <div className="h-1 w-12 bg-blue-600 rounded-full" />
            <div className="h-1 w-6 bg-white/20 rounded-full" />
            <div className="h-1 w-6 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-neutral-900">
              Create an account
            </h1>
            <p className="text-neutral-500 mt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Login here
              </Link>
            </p>
          </div>

          <form onSubmit={handleRegistration} className="space-y-6">
            {serverError && !registrationErrors.length && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
                {serverError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
              {getFieldError("email", registrationErrors) && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {getFieldError("email", registrationErrors)}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-neutral-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Min. 8 characters"
                  className="pl-10 h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
              {getFieldError("password", registrationErrors) && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {getFieldError("password", registrationErrors)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-[#040308] hover:bg-neutral-800 text-white font-semibold shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-400 leading-relaxed">
              By creating an account, you agree to our <br />
              <span className="underline cursor-pointer hover:text-neutral-600">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:text-neutral-600">
                Privacy Policy
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
