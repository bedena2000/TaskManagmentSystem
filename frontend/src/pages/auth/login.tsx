import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFieldError } from "@/helpers";
import { signIn } from "@/queries";
import { type RegistrationErrorMessageInterface } from "@/types";
import { Loader2, Mail, Lock, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<
    RegistrationErrorMessageInterface[]
  >([]);
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { mutate, isPending } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const errorsArray = error.response?.data?.errors || [];
        setLoginErrors(errorsArray);
        setServerError(message || "Login failed");
      } else {
        navigate("/404");
      }
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side: Form */}
      <div className="flex-[0.4] flex flex-col justify-center px-12 lg:px-24">
        <div className="max-w-sm w-full mx-auto">
          {/* Logo/Branding */}
          <div className="mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-200">
              T
            </div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Welcome back
            </h1>
            <p className="text-neutral-500 mt-2">
              New here?{" "}
              <Link
                to="/registration"
                className="text-blue-600 font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Server-wide Error Alert */}
            {serverError && !loginErrors.length && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {serverError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={18}
                />
                <Input
                  className="pl-10 h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="name@company.com"
                  required
                />
              </div>
              {getFieldError("email", loginErrors) && (
                <p className="text-xs text-red-500 ml-1">
                  {getFieldError("email", loginErrors)}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-700 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  size={18}
                />
                <Input
                  className="pl-10 h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:bg-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
              {getFieldError("password", loginErrors) && (
                <p className="text-xs text-red-500 ml-1">
                  {getFieldError("password", loginErrors)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Sign in <ChevronRight size={18} />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-xs text-neutral-400">
            By signing in, you agree to our Terms of Service.
          </p>
        </div>
      </div>

      {/* Right Side: Visual/Marketing */}
      <div className="hidden lg:flex flex-[0.6] bg-[#0A0A0B] m-4 rounded-[2.5rem] p-16 flex-col justify-between relative overflow-hidden text-white">
        {/* Background Decorative Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

        <div className="z-10">
          <p className="text-sm font-medium tracking-[0.2em] text-blue-400 uppercase">
            Task Management 2.0
          </p>
          <h2 className="text-5xl font-bold mt-6 leading-tight max-w-lg">
            Streamline your workflow in seconds.
          </h2>
        </div>

        <div className="z-10 max-w-md">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-3xl mb-8">
            <p className="text-lg text-neutral-300 italic">
              "This system has completely transformed how our team handles
              sprints. It's intuitive, fast, and beautiful."
            </p>
            <p className="mt-4 font-semibold">— Sarah Jenkins, Product Lead</p>
          </div>
          <p className="text-neutral-400">
            Authenticate to access your workspace, notes, and daily project
            timelines.
          </p>
        </div>
      </div>
    </div>
  );
}
