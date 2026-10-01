import { useEffect, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ConsentPage } from "./funnel/ConsentPage";
import { ReportView } from "./funnel/ReportView";
import { ScreeningPage } from "./funnel/ScreeningPage";
import { creativeFromLocation } from "./funnel/api";

type View = "landing" | "login" | "register" | "screen" | "report" | "privacy";

function readRoute(): { view: View; reportHash: string } {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "login") return { view: "login", reportHash: "" };
  if (hash === "register") return { view: "register", reportHash: "" };
  if (hash === "screen") return { view: "screen", reportHash: "" };
  if (hash === "privacy") return { view: "privacy", reportHash: "" };
  if (hash.startsWith("report/")) return { view: "report", reportHash: hash.slice("report/".length) };
  return { view: "landing", reportHash: "" };
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const creative = creativeFromLocation();

  useEffect(() => {
    const onHash = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigateTo = (view: "landing" | "login" | "register") => {
    window.location.hash = view === "landing" ? "" : view;
  };

  if (route.view === "login") {
    return (
      <LoginPage
        onBackToHome={() => navigateTo("landing")}
        onNavigateToRegister={() => navigateTo("register")}
      />
    );
  }

  if (route.view === "register") {
    return (
      <RegisterPage
        onBackToHome={() => navigateTo("landing")}
        onNavigateToLogin={() => navigateTo("login")}
      />
    );
  }

  if (route.view === "screen") return <ScreeningPage creative={creative} />;
  if (route.view === "privacy") return <ConsentPage />;
  if (route.view === "report") return <ReportView hash={route.reportHash} creative={creative} />;

  return <LandingPage onLoginClick={() => navigateTo("login")} />;
}

export default App;
