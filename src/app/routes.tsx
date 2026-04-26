import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SplashScreen from "./pages/SplashScreen";
import HomeScreen from "./pages/HomeScreen";
import DiagnosePage from "./pages/DiagnosePage";
import DiagnoseReportPage from "./pages/DiagnoseReportPage";
import SoilHealthPage from "./pages/SoilHealthPage";
import SoilHealthReportPage from "./pages/SoilHealthReportPage";
import CropPage from "./pages/CropPage";
import MarketPage from "./pages/MarketPage";
import SystemStatusPage from "./pages/SystemStatusPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationsPage from "./pages/NotificationsPage";
import CartPage from "./pages/CartPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashScreen,
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
  {
    path: "/system-status",
    Component: SystemStatusPage,
  },
  {
    path: "/profile",
    Component: ProfilePage,
  },
  {
    path: "/notifications",
    Component: NotificationsPage,
  },
  {
    path: "/cart",
    Component: CartPage,
  },
]);