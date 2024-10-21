import TrainingRequestsTable from "@/components/shared/TrainingRequestsTable";

import { useSignOutAccount } from "@/lib/tanstack-query/queriesAndMutation";
import { LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TrainingRequests = () => {
  const Navigate = useNavigate();
  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOutAccount();

  const handleSignOut = async () => {
    const response = await signOut();
    if (response) {
      toast.success("Logout successful!");
      Navigate("/");
    }
    if (response instanceof Error) {
      // Assuming err.message contains the API error message
      return toast.error(response?.message || "Sign out, please try again.");
    }
  };

  return (
    <>
      <div className="h-full">
        <div className="flex h-full w-full flex-col justify-between px-4 md:px-1 pt-9 md:pt-6">
          <div className="max-w-7xl self-center w-full">
            <div className="flex justify-center items-end md:justify-between pr-4 py-4">
              <div className="hidden md:flex flex-col gap-2">
                <p className="text-primary-black text-2xl font-semibold">
                  Training Requests
                </p>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="p-2 rounded-lg bg-white cursor-pointer"
                  onClick={handleSignOut}
                >
                  <div className="bg-accent py-2 px-3 rounded-lg font-semibold text-sm md:text-base flex items-center gap-1">
                    <LogOut className="h-8" />
                    {isSigningOut ? "signing out" : "Sign out"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 px-6">
              <TrainingRequestsTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingRequests;
