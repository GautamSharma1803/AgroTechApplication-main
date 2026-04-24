import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OnboardingPage from "./pages/OnboardingPage";
import HomeScreen from "./pages/HomeScreen";
import DiagnosePage from "./pages/DiagnosePage";
import DiagnoseReportPage from "./pages/DiagnoseReportPage";
import SoilHealthPage from "./pages/SoilHealthPage";
import SoilHealthReportPage from "./pages/SoilHealthReportPage";
import CropPage from "./pages/CropPage";
import MarketPage from "./pages/MarketPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: OnboardingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/home",
    Component: HomeScreen,
  },
  {
    path: "/diagnose",
    Component: DiagnosePage,
  },
  {
    path: "/diagnose/report",
    Component: DiagnoseReportPage,
  },
  {
    path: "/soil-health",
    Component: SoilHealthPage,
  },
  {
    path: "/soil-health/report",
    Component: SoilHealthReportPage,
  },
  {
    path: "/crops",
    Component: CropPage,
  },
  {
    path: "/market",
    Component: MarketPage,
  },
]);
