import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-auction-bg">
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-16 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}