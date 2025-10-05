import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useContracts } from './ContractContext';

interface MedicalRecord {
  id: number;
  title: string;
  ipfsHash: string;
  metadata: string;
  timestamp: number;
  sharedForFunding: boolean;
  doctor: string;
  date: string;
  size: string;
}

interface MedicalRecordContextType {
  medicalRecords: MedicalRecord[];
  loading: boolean;
  fetchRecords: () => Promise<void>;
  uploadRecord: (title: string, ipfsHash: string, metadata: string, doctorName: string) => Promise<void>;
  grantAccess: (userAddress: string) => Promise<void>;
  revokeAccess: (userAddress: string) => Promise<void>;
  markForFunding: (recordId: number, status: boolean) => Promise<void>;
}

const MedicalRecordContext = createContext<MedicalRecordContextType | undefined>(undefined);

export const MedicalRecordProvider = ({ children }: { children: ReactNode }) => {
  const { storage, account } = useContracts();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    if (!storage || !account) return;

    try {
      setLoading(true);
      const records = await storage.getMyRecords();
      
      const formatted = records.map((r: any, index: number) => ({
        id: index,
        title: r.title,
        ipfsHash: r.ipfsHash,
        metadata: r.metadata,
        timestamp: Number(r.timestamp),
        sharedForFunding: r.sharedForFunding,
        doctor: r.doctorName,
        date: new Date(Number(r.timestamp) * 1000).toLocaleDateString(),
        size: "N/A" // Size can be fetched from IPFS if needed
      }));

      setMedicalRecords(formatted);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadRecord = async (title: string, ipfsHash: string, metadata: string, doctorName: string) => {
    if (!storage) throw new Error("Storage contract not initialized");

    const tx = await storage.uploadRecord(title, ipfsHash, metadata, doctorName);
    await tx.wait();
    await fetchRecords();
  };

  const grantAccess = async (userAddress: string) => {
    if (!storage) throw new Error("Storage contract not initialized");

    const tx = await storage.grantAccess(userAddress);
    await tx.wait();
  };

  const revokeAccess = async (userAddress: string) => {
    if (!storage) throw new Error("Storage contract not initialized");

    const tx = await storage.revokeAccess(userAddress);
    await tx.wait();
  };

  const markForFunding = async (recordId: number, status: boolean) => {
    if (!storage) throw new Error("Storage contract not initialized");

    const tx = await storage.markRecordForFunding(recordId, status);
    await tx.wait();
    await fetchRecords();
  };

  useEffect(() => {
    if (storage && account) {
      fetchRecords();
    }
  }, [storage, account]);

  return (
    <MedicalRecordContext.Provider value={{ medicalRecords, loading, fetchRecords, uploadRecord, grantAccess, revokeAccess, markForFunding }}>
      {children}
    </MedicalRecordContext.Provider>
  );
};

export const useMedicalRecords = () => {
  const context = useContext(MedicalRecordContext);
  if (!context) {
    throw new Error("useMedicalRecords must be used within MedicalRecordProvider");
  }
  return context;
};
