import { Outlet } from 'react-router';
import { Navbar } from '../Navbar';
export const ProtectedNavBar = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
