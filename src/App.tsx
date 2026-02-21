import React from "react";
import { PrimeReactProvider } from "primereact/api";
import ArtworkTable from "./components/ArtworkTable";

const App: React.FC = () => (
  <PrimeReactProvider>
    <ArtworkTable />
  </PrimeReactProvider>
);

export default App;