import Sidebar from "./Sidebar";

function Layout({ children, setToken }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fb",
      }}
    >
      <Sidebar setToken={setToken} />

      <main
        style={{
          marginLeft: "270px",
          padding: "30px",
          minHeight: "100vh",
          overflowX: "hidden",
        }}
      >
        <div className="container-fluid">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;