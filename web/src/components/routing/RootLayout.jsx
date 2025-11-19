import { Outlet } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

export const RootLayout = () => {
  return (
    <>
      <Navbar />
      <main className="content-wrapper">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
