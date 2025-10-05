import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const FUNDING_CONTRACT_ADDRESS = "YOUR_FUNDING_CONTRACT_ADDRESS";
const STORAGE_CONTRACT_ADDRESS = "YOUR_STORAGE_CONTRACT_ADDRESS";

const FUNDING_ABI = [
  "function createRequest(string memory name, string memory description, uint256 deadline, address hospitalWallet, string memory diseaseType, string memory contactNumber, uint256 goalAmount) external",
  "function getAllRequests() external view returns (tuple(address patient, string name, string description, uint256 createdAt, uint256 deadline, address hospitalWallet, string diseaseType, bool patientCallVerified, bool hospitalCrosscheckVerified, bool physicalVisitVerified, string contactNumber, bool visible, bool active, bool isFunded, uint256 totalFunded, uint256 goalAmount, string[] medicalRecords)[] memory)",
  "function donate(address patient) external payable",
  "function addMedicalRecord(string memory cid) external",
  "event RequestCreated(address indexed patient, string name, string diseaseType)",
  "event Donated(address indexed patient, address indexed donor, uint256 amount)"
];

const STORAGE_ABI = [
  "function registerPatient(address _patient) external",
  "function isRegistered(address _patient) external view returns (bool)",
  "function uploadRecord(string memory _title, string memory _ipfsHash, string memory _metadata, string memory _doctorName) external",
  "function getMyRecords() external view returns (tuple(string title, string ipfsHash, string metadata, uint256 timestamp, bool sharedForFunding, string doctorName)[] memory)",
  "function grantAccess(address _user) external",
  "function revokeAccess(address _user) external",
  "function markRecordForFunding(uint256 _recordId, bool _status) external",
  "function access(address patient, address user) external view returns (bool)",
  "event RecordUploaded(address indexed patient, uint256 indexed recordId, string ipfsHash, uint256 timestamp, address indexed doctor)",
  "event AccessGranted(address indexed patient, address indexed user)",
  "event AccessRevoked(address indexed patient, address indexed user)"
];

interface ContractContextType {
  account: string | null;
  funding: ethers.Contract | null;
  storage: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [funding, setFunding] = useState<ethers.Contract | null>(null);
  const [storage, setStorage] = useState<ethers.Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      setAccount(accounts[0]);

      const fundingContract = new ethers.Contract(FUNDING_CONTRACT_ADDRESS, FUNDING_ABI, signer);
      const storageContract = new ethers.Contract(STORAGE_CONTRACT_ADDRESS, STORAGE_ABI, signer);

      setFunding(fundingContract);
      setStorage(storageContract);

      // Auto-register patient if not registered
      const isRegistered = await storageContract.isRegistered(accounts[0]);
      if (!isRegistered) {
        const tx = await storageContract.registerPatient(accounts[0]);
        await tx.wait();
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setFunding(null);
    setStorage(null);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      });
    }
  }, []);

  return (
    <ContractContext.Provider value={{ account, funding, storage, connectWallet, disconnectWallet, isLoading }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContracts must be used within ContractProvider");
  }
  return context;
};
