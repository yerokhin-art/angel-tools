import { Provider } from "@react-spectrum/s2";
import { useMemo } from "react";
import {
  Route,
  Routes,
  useHref,
  useNavigate,
  type NavigateOptions,
} from "react-router";
import { useFileStore } from "./store/files";
import { WelcomeView, FilesView } from "./components";
import './App.css';

import "@react-spectrum/s2/page.css";

// Configure the type of the `routerOptions` prop on all React Spectrum components.
declare module "@react-spectrum/s2" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function AppContent() {
  const directoryPath = useFileStore((s) => s.directoryPath);

  // Show welcome view when no directory is selected
  if (!directoryPath) {
    return <WelcomeView />;
  }

  // Show files view when directory is selected
  return <FilesView />;
}

function App() {
  const navigate = useNavigate();

  const spectrumRouter = useMemo(
    () => ({
      navigate,
      useHref,
    }),
    [navigate],
  );

  return (
    <Provider background="base" router={spectrumRouter}>
      <Routes>
        <Route path="/" element={<AppContent />} />
      </Routes>
    </Provider>
  );
}

export default App;
