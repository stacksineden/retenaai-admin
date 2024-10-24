import { useEffect, lazy, Suspense, useState } from "react";
import { Loader2 } from "lucide-react";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { Routes, Route } from "react-router-dom";
import SignInForm from "./_auth/forms/SignInForm";
import { TrainingRequests } from "./_root/pages";
import { Toaster } from "react-hot-toast";

const AuthLayout = lazy(() => import("./_auth/AuthLayout"));
const RootLayout = lazy(() => import("./_root/RootLayout"));

function App() {
  const [showFirstMessage, setShowFirstMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstMessage(!showFirstMessage);
    }, 5000); // Change interval (in milliseconds) as needed
    return () => clearTimeout(timer);
  }, [showFirstMessage]);

  return (
    <>
      <Suspense
        fallback={
          <div className="w-[90%] mx-auto h-screen flex items-center justify-center flex-col gap-2">
            <Loader2 className="h-10 md:h-20 w-10 md:w-20 text-primary-blue animate-spin" />
            <div className="text-center">
              {showFirstMessage ? (
                <p className="text-base md:text-lg text-primary-black">
                  Hang tight! Our servers are doing some heavy lifting.
                </p>
              ) : (
                <p className="text-base md:text-lg text-primary-black">
                  In the meantime, why not practice your Jedi mind tricks? Try
                  to move the loading spinner with your mind... Almost there...
                </p>
              )}
            </div>
          </div>
        }
      >
        <SkeletonTheme baseColor="white" highlightColor="#525252">
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/dashboard" element={<TrainingRequests />} />
              <Route path="/training-requests" element={<TrainingRequests />} />
            </Route>
            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignInForm />} />
              <Route path="/" element={<SignInForm />} />
            </Route>
          </Routes>
        </SkeletonTheme>
      </Suspense>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
