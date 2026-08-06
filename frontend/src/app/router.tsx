import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { PatientLayout } from '@/components/layout/PatientLayout';
import { CareLayout } from '@/components/layout/CareLayout';
import { LandingPage } from '@/pages/public/LandingPage';
import { UnsupportedPage } from '@/pages/public/UnsupportedPage';
import { CaregiverLoginPage } from '@/pages/care/LoginPage';
import { CaregiverProfilePage } from '@/pages/care/ProfilePage';
import { ChildrenPage } from '@/pages/care/ChildrenPage';
import { ChildEditorPage } from '@/pages/care/ChildEditorPage';
import { PermissionsPage } from '@/pages/patient/PermissionsPage';
import { DeviceSetupPage } from '@/pages/patient/DeviceSetupPage';
import { CalibrationPage } from '@/pages/patient/CalibrationPage';
import { CalibrationResultPage } from '@/pages/patient/CalibrationResultPage';
import { AacCategoriesPage } from '@/pages/patient/AacCategoriesPage';
import { AacItemsPage } from '@/pages/patient/AacItemsPage';
import { ComposePage } from '@/pages/patient/ComposePage';
import { RequestStatusPage } from '@/pages/patient/RequestStatusPage';
import { ReassurancePage } from '@/pages/patient/ReassurancePage';
import { SosPage } from '@/pages/patient/SosPage';
import { CheckRequiredPage } from '@/pages/patient/CheckRequiredPage';
import { OfflinePage } from '@/pages/patient/OfflinePage';
import { DashboardPage } from '@/pages/care/DashboardPage';
import { CommunicationsPage } from '@/pages/care/CommunicationsPage';
import { CommunicationDetailPage } from '@/pages/care/CommunicationDetailPage';
import { AlertsPage } from '@/pages/care/AlertsPage';
import { AlertDetailPage } from '@/pages/care/AlertDetailPage';
import { AacManagerPage } from '@/pages/care/AacManagerPage';
import { CategoryEditorPage } from '@/pages/care/CategoryEditorPage';
import { ItemEditorPage } from '@/pages/care/ItemEditorPage';
import { PresetsPage } from '@/pages/care/PresetsPage';
import { ReassuranceLibraryPage } from '@/pages/care/ReassuranceLibraryPage';
import { HistoryPage } from '@/pages/care/HistoryPage';
import { AnalyticsPage } from '@/pages/care/AnalyticsPage';
import { SettingsPage } from '@/pages/care/SettingsPage';
import { NotificationsPage } from '@/pages/care/NotificationsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useAppStore } from '@/stores/useAppStore';

function LegacyPatientRedirect({ destination = 'aac' }: { destination?: string }) {
  const activeChildId = useAppStore((state) => state.activeChildId);
  const caregiverLoggedIn = useAppStore((state) => state.caregiverLoggedIn);

  if (!caregiverLoggedIn) return <Navigate to="/login" replace />;
  if (!activeChildId) return <Navigate to="/care/children/new" replace />;
  return <Navigate to={`/child/${activeChildId}/${destination}`} replace />;
}

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/profile', element: <Navigate to="/care/profile" replace /> },
      { path: '/unsupported', element: <UnsupportedPage /> }
    ]
  },
  { path: '/login', element: <CaregiverLoginPage /> },
  {
    path: '/child/:childId',
    element: <PatientLayout />,
    children: [
      { index: true, element: <Navigate to="aac" replace /> },
      { path: 'permissions', element: <PermissionsPage /> },
      { path: 'device-setup', element: <DeviceSetupPage /> },
      { path: 'calibration', element: <CalibrationPage /> },
      { path: 'calibration/result', element: <CalibrationResultPage /> },
      { path: 'aac', element: <AacCategoriesPage /> },
      { path: 'aac/:categoryId', element: <AacItemsPage /> },
      { path: 'compose', element: <ComposePage /> },
      { path: 'request/:eventId', element: <RequestStatusPage /> },
      { path: 'reassurance', element: <ReassurancePage /> },
      { path: 'sos', element: <SosPage /> },
      { path: 'check-required', element: <CheckRequiredPage /> },
      { path: 'offline', element: <OfflinePage /> }
    ]
  },
  { path: '/patient', element: <LegacyPatientRedirect /> },
  { path: '/patient/connect', element: <Navigate to="/care/children" replace /> },
  { path: '/patient/permissions', element: <LegacyPatientRedirect destination="permissions" /> },
  { path: '/patient/device-setup', element: <LegacyPatientRedirect destination="device-setup" /> },
  { path: '/patient/calibration', element: <LegacyPatientRedirect destination="calibration" /> },
  { path: '/patient/aac', element: <LegacyPatientRedirect destination="aac" /> },
  { path: '/patient/compose', element: <LegacyPatientRedirect destination="compose" /> },
  { path: '/patient/reassurance', element: <LegacyPatientRedirect destination="reassurance" /> },
  { path: '/patient/sos', element: <LegacyPatientRedirect destination="sos" /> },
  { path: '/care/login', element: <Navigate to="/login" replace /> },
  { path: '/care/onboarding', element: <Navigate to="/care/children/new" replace /> },
  { path: '/care/pair', element: <Navigate to="/care/children" replace /> },
  { path: '/care/devices', element: <Navigate to="/care/children" replace /> },
  {
    path: '/care',
    element: <CareLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'profile', element: <CaregiverProfilePage /> },
      { path: 'children', element: <ChildrenPage /> },
      { path: 'children/new', element: <ChildEditorPage /> },
      { path: 'children/:childId', element: <ChildEditorPage /> },
      { path: 'patient/:patientId', element: <Navigate to="/care/children" replace /> },
      { path: 'communications', element: <CommunicationsPage /> },
      { path: 'communications/:eventId', element: <CommunicationDetailPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'alerts/:alertId', element: <AlertDetailPage /> },
      { path: 'aac', element: <AacManagerPage /> },
      { path: 'aac/category/:categoryId', element: <CategoryEditorPage /> },
      { path: 'aac/item/new', element: <ItemEditorPage /> },
      { path: 'aac/item/:itemId/edit', element: <ItemEditorPage /> },
      { path: 'presets', element: <PresetsPage /> },
      { path: 'reassurance', element: <ReassuranceLibraryPage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'notifications', element: <NotificationsPage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
