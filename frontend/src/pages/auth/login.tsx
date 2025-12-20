import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getFieldError } from "@/helpers";
import { signIn, signUp } from "@/queries";
import type { RegistrationErrorMessageInterface } from "@/types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [serverError, setServerError] = useState<string | null>(null);
  const [loginErrors, setLoginErrors] = useState<
    RegistrationErrorMessageInterface[] | []
  >([]);

  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      setServerError(null);
      setLoginErrors([]);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        const errorsArray: RegistrationErrorMessageInterface[] =
          error.response?.data?.errors;

        setLoginErrors(errorsArray);

        // if (errorsArray.length === 0 && message) {
        //   setLoginErrors([{ field: "password", message }]);
        // } else {
        //   setLoginErrors(errorsArray);
        // }
        if (message === "Password is incorrect") {
          setPasswordErrorMessage(message);
        }

        if (status && status < 500) {
          setServerError(message);
          return;
        }
      }

      navigate("/404");
    },
  });

  const handleLogin = () => {
    setServerError(null);
    mutate({ email, password });
  };

  console.log(passwordErrorMessage);

  return (
    <div className="min-h-screen grid gap-4 grid-cols-12">
      <div className="col-span-5 p-24">
        <div className="mt-18">
          <div className="flex flex-col gap-2.5">
            <p className="text-[#040308] text-2xl font-bold">Login</p>
            <p>
              Dont have an account?{" "}
              <span>
                <Link className="text-[#312ECB]" to="/registration">
                  Register
                </Link>
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Input
              value={email}
              onChange={(item) => setEmail(item.target.value)}
              type="email"
              placeholder="Email"
            />
            {getFieldError("email", loginErrors) && (
              <p className="text-sm text-red-600 mt-1">
                {getFieldError("email", loginErrors)}
              </p>
            )}
            <Input
              value={password}
              onChange={(item) => setPassword(item.target.value)}
              type="password"
              placeholder="Password"
            />

            {getFieldError("password", loginErrors) && (
              <p className="text-sm text-red-600 mt-1">
                {getFieldError("password", loginErrors)}
              </p>
            )}
            {passwordErrorMessage && (
              <p className="text-sm text-red-600 mt-1">
                {passwordErrorMessage}
              </p>
            )}
          </div>

          <div className="mt-11">
            <Button
              onClick={handleLogin}
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              {isPending ? (
                <ColorRing
                  visible={true}
                  height={100}
                  width={100}
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-[#040308] col-span-7 relative overflow-hidden text-white p-24 flex flex-col justify-between">
        <div className="z-10">
          <p className="text-4xl ">Task management system</p>
        </div>

        <div className="z-10 flex flex-col gap-4">
          <p className="text-2xl">Create your projects and tasks</p>
          <p>Authenticate then have your notes, projects for your daily work</p>
        </div>
      </div>
    </div>
  );
}
