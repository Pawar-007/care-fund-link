import { ethers } from 'ethers';

// Smart contract ABI - add your deployed contract address
export const FUNDING_CONTRACT_ADDRESS = "0x..." // Replace with your deployed contract address

export const FUNDING_CONTRACT_ABI = [
  // Read functions
  "function admin() view returns (address)",
  "function hospitals(address) view returns (bool)",
  "function requestCount() view returns (uint256)",
  "function generalPool() view returns (uint256)",
  "function getRequest(uint256) view returns (address, address, address, uint256, uint256, uint256, uint64, uint8, bool, bool, bool, string, string, string, string, string, address, uint256[])",
  "function getDonors(uint256) view returns (address[], uint256[])",
  "function getRequestsBasic(uint256, uint256) view returns (uint256[], uint8[], uint256[], uint256[])",
  "function contributions(uint256, address) view returns (uint256)",
  
  // Admin functions
  "function setHospital(address, bool)",
  "function setAdminCallDone(uint256, bool)",
  "function setPhysicalVisit(uint256, bool)",
  "function approve(uint256)",
  "function cancel(uint256)",
  "function allocateFromPool(uint256, uint256)",
  "function disburseToHospital(uint256, uint256)",
  
  // Public functions
  "function createRequest(address, uint256, uint64, string, string, string, string, string, address, uint256[])",
  "function donateToRequest(uint256) payable",
  "function donateToPool() payable",
  "function refund(uint256)",
  
  // Events
  "event RequestCreated(uint256 indexed id, address indexed patient, address indexed hospitalWallet, uint256 goal, uint64 deadline)",
  "event RequestApproved(uint256 indexed id)",
  "event RequestCanceled(uint256 indexed id)",
  "event DonationReceived(uint256 indexed id, address indexed donor, uint256 amount, uint256 newRaised)",
  "event Disbursed(uint256 indexed id, address indexed hospitalWallet, uint256 amount)"
];

export enum RequestState {
  Pending = 0,
  UnderReview = 1,
  Approved = 2,
  Canceled = 3,
  Disbursed = 4
}

export interface RequestData {
  id: number;
  patient: string;
  hospitalWallet: string;
  hospitalVerifier: string;
  goal: bigint;
  raised: bigint;
  disbursed: bigint;
  deadline: number;
  state: RequestState;
  adminCallDone: boolean;
  hospitalVerified: boolean;
  physicalVisitDone: boolean;
  title: string;
  description: string;
  patientDataCID: string;
  hospitalDataCID: string;
  documentsBundleCID: string;
  storageContract: string;
  recordIds: number[];
}

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  async connect(): Promise<string | null> {
    if (!(window as any).ethereum) {
      throw new Error('MetaMask not found');
    }

    try {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(
        FUNDING_CONTRACT_ADDRESS, 
        FUNDING_CONTRACT_ABI, 
        this.signer
      );
      
      return await this.signer.getAddress();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    }
  }

  async isAdmin(): Promise<boolean> {
    if (!this.contract || !this.signer) return false;
    
    try {
      const adminAddress = await this.contract.admin();
      const userAddress = await this.signer.getAddress();
      return adminAddress.toLowerCase() === userAddress.toLowerCase();
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  async isHospital(): Promise<boolean> {
    if (!this.contract || !this.signer) return false;
    
    try {
      const userAddress = await this.signer.getAddress();
      return await this.contract.hospitals(userAddress);
    } catch (error) {
      console.error('Error checking hospital status:', error);
      return false;
    }
  }

  async getRequestCount(): Promise<number> {
    if (!this.contract) return 0;
    try {
      const count = await this.contract.requestCount();
      return Number(count);
    } catch (error) {
      console.error('Error getting request count:', error);
      return 0;
    }
  }

  async getRequest(id: number): Promise<RequestData | null> {
    if (!this.contract) return null;
    
    try {
      const result = await this.contract.getRequest(id);
      return {
        id,
        patient: result[0],
        hospitalWallet: result[1],
        hospitalVerifier: result[2],
        goal: result[3],
        raised: result[4],
        disbursed: result[5],
        deadline: Number(result[6]),
        state: Number(result[7]) as RequestState,
        adminCallDone: result[8],
        hospitalVerified: result[9],
        physicalVisitDone: result[10],
        title: result[11],
        description: result[12],
        patientDataCID: result[13],
        hospitalDataCID: result[14],
        documentsBundleCID: result[15],
        storageContract: result[16],
        recordIds: result[17].map((id: any) => Number(id))
      };
    } catch (error) {
      console.error('Error getting request:', error);
      return null;
    }
  }

  async getAllRequests(): Promise<RequestData[]> {
    const count = await this.getRequestCount();
    const requests: RequestData[] = [];
    
    for (let i = 1; i <= count; i++) {
      const request = await this.getRequest(i);
      if (request) {
        requests.push(request);
      }
    }
    
    return requests;
  }

  async getGeneralPool(): Promise<bigint> {
    if (!this.contract) return BigInt(0);
    try {
      return await this.contract.generalPool();
    } catch (error) {
      console.error('Error getting general pool:', error);
      return BigInt(0);
    }
  }

  // Admin functions
  async setAdminCallDone(requestId: number, done: boolean): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const tx = await this.contract.setAdminCallDone(requestId, done);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error setting admin call done:', error);
      return false;
    }
  }

  async setPhysicalVisit(requestId: number, done: boolean): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const tx = await this.contract.setPhysicalVisit(requestId, done);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error setting physical visit:', error);
      return false;
    }
  }

  async approveRequest(requestId: number): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const tx = await this.contract.approve(requestId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error approving request:', error);
      return false;
    }
  }

  async cancelRequest(requestId: number): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const tx = await this.contract.cancel(requestId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error canceling request:', error);
      return false;
    }
  }

  async disburseToHospital(requestId: number, amount: bigint): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const tx = await this.contract.disburseToHospital(requestId, amount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error disbursing to hospital:', error);
      return false;
    }
  }

  async setHospital(hospitalAddress: string, allowed: boolean): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const tx = await this.contract.setHospital(hospitalAddress, allowed);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error setting hospital:', error);
      return false;
    }
  }

  async allocateFromPool(requestId: number, amount: bigint): Promise<boolean> {
    if (!this.contract) return false;
    try {
      const tx = await this.contract.allocateFromPool(requestId, amount);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error allocating from pool:', error);
      return false;
    }
  }
}

export const web3Service = new Web3Service();