import { ThemeProvider } from './context/ThemeContext';
import DrawingCanvas from './components/DrawingCanvas';
import { PanelProvider } from './context/PanelContext';
import { PanelIOProvider } from './context/PanelIOContext';
import { CanvasSettingsProvider } from './context/CanvasSettingsContext';
import RightSideBar from './components/RightSidebar';


function App() {
  return (
    <ThemeProvider>
      <CanvasSettingsProvider>
        <PanelProvider>
          <PanelIOProvider>
            <DrawingCanvas />
            <RightSideBar />
          </PanelIOProvider>
        </PanelProvider>
      </CanvasSettingsProvider>
    </ThemeProvider>
  );
}

export default App;