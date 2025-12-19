import backgroundLines from "@/assets/images/background_lines.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function RegistrationPage() {
  return (
    <div className="min-h-screen grid gap-4 grid-cols-12">
      <div className="bg-[#040308] col-span-5 relative overflow-hidden text-white p-24 flex flex-col justify-between">
        <div className="z-10">
          <p className="text-4xl ">Task management system</p>
        </div>

        <div className="z-10 flex flex-col gap-4">
          <p className="text-2xl">Create your projects and tasks</p>
          <p>Authenticate then have your notes, projects for your daily work</p>
        </div>
        <img
          src={backgroundLines}
          alt="backgroundLines"
          className="absolute "
        />
      </div>

      <div className="col-span-7 p-24">
        <form action="" className="mt-18">
          <div className="flex flex-col gap-2.5">
            <p className="text-[#040308] text-2xl font-bold">Create account</p>
            <p>
              Already have an account?{" "}
              <span>
                <Link className="text-[#312ECB]" to="/login">Login</Link>
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
          </div>

          <div className="mt-11">
            <Button className="w-full cursor-pointer">Create Account</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
