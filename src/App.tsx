import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { ViewModeProvider } from "./context/ViewModeContext";
import DrawingCanvas from "./components/DrawingCanvas";

function App() {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ""; // This is necessary for the dialog to show in some browsers
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <ThemeProvider>
      <ViewModeProvider>
        <DrawingCanvas />
      </ViewModeProvider>
    </ThemeProvider>
  );
}

export default App;
