import { Outlet } from 'react-router';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <Outlet />
    </div>
  );
}
