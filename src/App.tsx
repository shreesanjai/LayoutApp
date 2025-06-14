import { ThemeProvider } from './context/ThemeContext';
import DrawingCanvas from './components/DrawingCanvas';
import { PanelProvider } from './context/PanelContext';
import { PanelIOProvider } from './context/PanelIOContext';
import { CanvasSettingsProvider } from './context/CanvasSettingsContext';


function App() {
  return (
    <ThemeProvider>
      <CanvasSettingsProvider>
        <PanelProvider>
          <PanelIOProvider>
            <DrawingCanvas />
          </PanelIOProvider>
        </PanelProvider>
      </CanvasSettingsProvider>
    </ThemeProvider>
  );
}

export default App;