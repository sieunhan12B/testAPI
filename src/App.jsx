import React from "react";
import SimpleTable from "./components/SimpleTable";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const NotificationContext = React.createContext();
const App = () => {
  const showNotification = (content, type, duration = 4000) => {
    toast[type](content, {
      position: "top-right",
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };
  return (
    <div className="App">
      <NotificationContext.Provider
        value={{
          showNotification: showNotification,
        }}
      >
        <SimpleTable />
        <ToastContainer />
      </NotificationContext.Provider>
    </div>
  );
};

export default App;
