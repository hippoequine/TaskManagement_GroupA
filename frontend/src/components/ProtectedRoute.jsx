import { Outlet } from 'react-router';
import keycloak from '../keycloak';
import Unauthorized from '../pages/Unauthorized.jsx';

const ProtectedRoute = ({ role }) => {
  if (!keycloak.authenticated) {
    return <Unauthorized />;
  }

  if (role && !keycloak.hasRealmRole(role)) {
    return <Unauthorized role={role} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
