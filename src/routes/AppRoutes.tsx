import Layout from "@nepMeds/components/Layout";
import MasterData from "@nepMeds/pages/Admin/MasterData";
import ConfirmPassword from "@nepMeds/pages/ConfirmPassword/ConfirmPassword";
import Dashboard from "@nepMeds/pages/Dashboard";
import AllDoctors from "@nepMeds/pages/DoctorList/AllDoctors";
import ForgotPassword from "@nepMeds/pages/ForgotPassword/ForgotPassword";
import Login from "@nepMeds/pages/Login/Login";
import Register from "@nepMeds/pages/Register";
import AcademicInfo from "@nepMeds/pages/Register/AcademicInfo";
import BasicInfo from "@nepMeds/pages/Register/BasicInfo";
import CertificationInfo from "@nepMeds/pages/Register/CertificationInfo";
import ExperienceInfo from "@nepMeds/pages/Register/ExperienceInfo";
import PrimaryInfo from "@nepMeds/pages/Register/PrimaryInfo";
import SignUp from "@nepMeds/pages/SignUp/SignUp";
import { useAuthentication } from "@nepMeds/service/nepmeds-auth";
import { Navigate, useRoutes } from "react-router-dom";
import { NAVIGATION_ROUTES } from "./routes.constant";

const routes = [
  {
    path: NAVIGATION_ROUTES.LOGGEDIN,
    element: <Layout />,
    children: [
      {
        path: NAVIGATION_ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: NAVIGATION_ROUTES.APPOINTMENTS,
        element: <>Appointments</>,
      },
      {
        path: NAVIGATION_ROUTES.FOLLOWUP,
        element: <>Followup</>,
      },
      {
        path: NAVIGATION_ROUTES.PATIENT_HISTORY,
        element: <>patient history</>,
      },
      {
        path: NAVIGATION_ROUTES.CALENDER,
        element: <>Calendar</>,
      },
      {
        path: NAVIGATION_ROUTES.BANK_DETAILS,
        element: <>Bank details</>,
      },
      {
        path: NAVIGATION_ROUTES.PAYMENT,
        element: <>Payment</>,
      },
    ],
  },
];
const adminRoutes = [
  {
    path: NAVIGATION_ROUTES.LOGGEDIN,
    element: <Layout />,
    children: [
      {
        path: NAVIGATION_ROUTES.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: NAVIGATION_ROUTES.MASTER_DATA,
        element: <MasterData />,
      },
      {
        path: NAVIGATION_ROUTES.DOCTOR_LIST,
        element: <AllDoctors />,
      },
      {
        path: NAVIGATION_ROUTES.PATIENTS,
        element: <>Patients</>,
      },
      {
        path: NAVIGATION_ROUTES.APPOINTMENTS,
        element: <>Appointments</>,
      },
      {
        path: NAVIGATION_ROUTES.USER_ROLE,
        element: <>User Role</>,
      },
      {
        path: NAVIGATION_ROUTES.CONSULT_REQUEST,
        element: <>Consult Request</>,
      },
    ],
  },
  {
    path: NAVIGATION_ROUTES.NO_MATCH,
    element: <Navigate to={NAVIGATION_ROUTES.LOGGEDIN} replace />,
  },
];
const openRoutes = [
  {
    path: NAVIGATION_ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: NAVIGATION_ROUTES.SIGNUP,
    element: <SignUp />,
  },
  {
    path: NAVIGATION_ROUTES.REGISTER,
    element: <Register />,
  },
  {
    path: NAVIGATION_ROUTES.REGISTRATION.BASIC_INFO,
    element: <BasicInfo />,
  },
  {
    path: NAVIGATION_ROUTES.REGISTRATION.PRIMARY_INFO,
    element: <PrimaryInfo />,
  },
  {
    path: NAVIGATION_ROUTES.REGISTRATION.ACADEMIC_INFO,
    element: <AcademicInfo />,
  },
  {
    path: NAVIGATION_ROUTES.REGISTRATION.CERTIFICATION_INFO,
    element: <CertificationInfo />,
  },
  {
    path: NAVIGATION_ROUTES.REGISTRATION.EXPERIENCE_INFO,
    element: <ExperienceInfo />,
  },
  {
    path: NAVIGATION_ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: NAVIGATION_ROUTES.SIGNUP,
    element: <SignUp />,
  },
  {
    path: NAVIGATION_ROUTES.FORGOTPASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: NAVIGATION_ROUTES.CONFIRMPASSWORD,
    element: <ConfirmPassword />,
  },
  {
    path: NAVIGATION_ROUTES.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: NAVIGATION_ROUTES.NO_MATCH,
    element: <Navigate to={NAVIGATION_ROUTES.LOGIN} replace />,
  },
];

const AppRoutes = () => {
  const { data: isAuthenticated } = useAuthentication();
  // const dataInfo = useUserInfoQuery();
  // const is_doctor = dataInfo.data?.data?.data?.is_doctor;
  // localStorage.setItem("doctor", is_doctor);
  return useRoutes(
    isAuthenticated ? adminRoutes : openRoutes

    // isAuthenticated ? (is_doctor ? routes : adminRoutes) : openRoutes
  );
};

export default AppRoutes;
