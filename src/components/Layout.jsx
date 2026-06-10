import Sidebar from "./Sidebar";
import WelcomeModal from "./WelcomeModal";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-auction-bg">
      <Sidebar />

      {/* 
        Desktop: offset by sidebar (ml-16)
        Mobile: offset by top bar (mt-14), no left margin
      */}
      <main className="flex-1 mt-14 md:mt-0 md:ml-16 transition-all duration-300">
        {children}
      </main>
      <WelcomeModal />
    </div>
  );
}