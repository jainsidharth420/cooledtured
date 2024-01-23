import {useSignal} from '@preact/signals-react';
import {FaBars} from 'react-icons/fa';

const SideBar = () => {
  const isOpen = useSignal(false);

  const toggleSidebar = () => (isOpen.value = !isOpen.value);
  const closeSidebar = () => (isOpen.value = false);

  // Define the Tailwind CSS classes for the sidebar
  const sidebarClass = isOpen.value
    ? 'fixed top-24 left-0 h-full w-1/5 transition-all duration-300 ease-in-out bg-blue-200 z-50'
    : 'fixed top-24 left-[-20vw] h-full w-1/5 transition-all duration-300 ease-in-out bg-blue-50 z-50';

  return (
    <>
      <div className="header">
        <FaBars onClick={toggleSidebar} className="hamburger-icon" />
      </div>
      {isOpen.value && (
        <div
          className="fixed inset-0 z-10 bg-slate-600 bg-opacity-80"
          onClick={closeSidebar}
        />
      )}
      <div className={sidebarClass}>
        <h1>Featured Content</h1>
      </div>
    </>
  );
};

export default SideBar;