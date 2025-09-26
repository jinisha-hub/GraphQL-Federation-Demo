import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('token');
console.log(token)
  if (!token) {
    return <Navigate to="/" replace />; // redirect to Dashboard if not logged in
  }

  return children;
};

export default PrivateRoute;
