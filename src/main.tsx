import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ContractProvider } from './context/ContractContext'
import { MedicalRecordProvider } from './context/MedicalRecordContext'

createRoot(document.getElementById("root")!).render(
  <ContractProvider>
    <MedicalRecordProvider>
      <App />
    </MedicalRecordProvider>
  </ContractProvider>
);
