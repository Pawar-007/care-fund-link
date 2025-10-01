import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestCard } from "@/components/admin/RequestCard";
import { 
  Shield, 
  Wallet, 
  RefreshCw, 
  Building2, 
  DollarSign,
  FileText,
  Users,
  Clock
} from "lucide-react";
import { web3Service, RequestData, RequestState } from "@/lib/web3";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [generalPool, setGeneralPool] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState(false);
  const [hospitalAddress, setHospitalAddress] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      const address = await web3Service.connect();
      if (address) {
        setIsConnected(true);
        setWalletAddress(address);
        const adminStatus = await web3Service.isAdmin();
        setIsAdmin(adminStatus);
        if (adminStatus) {
          await loadData();
        }
      }
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      const address = await web3Service.connect();
      if (address) {
        setIsConnected(true);
        setWalletAddress(address);
        const adminStatus = await web3Service.isAdmin();
        setIsAdmin(adminStatus);
        if (adminStatus) {
          await loadData();
          toast({
            title: "Connected Successfully",
            description: "Admin wallet connected",
          });
        } else {
          toast({
            title: "Access Denied",
            description: "This wallet does not have admin privileges",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [allRequests, poolBalance] = await Promise.all([
        web3Service.getAllRequests(),
        web3Service.getGeneralPool()
      ]);
      setRequests(allRequests);
      setGeneralPool(poolBalance);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data from blockchain",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminCallToggle = async (id: number, done: boolean) => {
    try {
      setLoading(true);
      const success = await web3Service.setAdminCallDone(id, done);
      if (success) {
        await loadData();
        toast({
          title: "Success",
          description: `Admin call status updated for request #${id}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update admin call status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhysicalVisitToggle = async (id: number, done: boolean) => {
    try {
      setLoading(true);
      const success = await web3Service.setPhysicalVisit(id, done);
      if (success) {
        await loadData();
        toast({
          title: "Success",
          description: `Physical visit status updated for request #${id}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update physical visit status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setLoading(true);
      const success = await web3Service.approveRequest(id);
      if (success) {
        await loadData();
        toast({
          title: "Success",
          description: `Request #${id} approved successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setLoading(true);
      const success = await web3Service.cancelRequest(id);
      if (success) {
        await loadData();
        toast({
          title: "Success",
          description: `Request #${id} canceled successfully`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisburse = async (id: number, amountStr: string) => {
    try {
      setLoading(true);
      const amount = ethers.parseEther(amountStr);
      const success = await web3Service.disburseToHospital(id, amount);
      if (success) {
        await loadData();
        toast({
          title: "Success",
          description: `${amountStr} ETH disbursed for request #${id}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disburse funds",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (id: number, amountStr: string) => {
    try {
      setLoading(true);
      const amount = ethers.parseEther(amountStr);
      const success = await web3Service.donateToRequest(id, amount);
      if (success) {
        await loadData();
        toast({
          title: "Donation Successful",
          description: `${amountStr} ETH donated to request #${id}`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to donate to request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetHospital = async () => {
    if (!hospitalAddress || !ethers.isAddress(hospitalAddress)) {
      toast({
        title: "Error",
        description: "Please enter a valid hospital address",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const success = await web3Service.setHospital(hospitalAddress, true);
      if (success) {
        toast({
          title: "Success",
          description: "Hospital whitelisted successfully",
        });
        setHospitalAddress("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to whitelist hospital",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRequestsByState = (state: RequestState) => {
    return requests.filter(req => req.state === state);
  };

  const getTotalStats = () => {
    return {
      totalRequests: requests.length,
      pendingRequests: getRequestsByState(RequestState.Pending).length,
      approvedRequests: getRequestsByState(RequestState.Approved).length,
      totalRaised: requests.reduce((sum, req) => sum + req.raised, BigInt(0)),
      totalDisbursed: requests.reduce((sum, req) => sum + req.disbursed, BigInt(0))
    };
  };

  // Temporarily disabled for development
  // if (!isConnected) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
  //       <Card className="w-full max-w-md">
  //         <CardHeader className="text-center">
  //           <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
  //           <CardTitle className="text-2xl">Admin Portal</CardTitle>
  //           <p className="text-muted-foreground">Connect your admin wallet to access the platform</p>
  //         </CardHeader>
  //         <CardContent>
  //           <Button 
  //             onClick={connectWallet} 
  //             disabled={loading}
  //             className="w-full"
  //           >
  //             {loading ? (
  //               <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
  //             ) : (
  //               <Wallet className="h-4 w-4 mr-2" />
  //             )}
  //             Connect Wallet
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  // if (!isAdmin) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
  //       <Card className="w-full max-w-md">
  //         <CardHeader className="text-center">
  //           <Shield className="h-16 w-16 mx-auto text-destructive mb-4" />
  //           <CardTitle className="text-2xl">Access Denied</CardTitle>
  //           <p className="text-muted-foreground">This wallet does not have admin privileges</p>
  //         </CardHeader>
  //         <CardContent>
  //           <div className="text-center">
  //             <p className="text-sm text-muted-foreground mb-4">Connected as:</p>
  //             <p className="font-mono text-xs break-all">{walletAddress}</p>
  //           </div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Shield className="h-8 w-8" />
                Admin Dashboard
              </h1>
              <p className="text-primary-foreground/80 mt-2">
                Connected as: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
            <Button
              onClick={loadData}
              disabled={loading}
              variant="secondary"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">{stats.totalRequests}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.pendingRequests}</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Raised</p>
                  <p className="text-2xl font-bold">{parseFloat(ethers.formatEther(stats.totalRaised)).toFixed(2)} ETH</p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">General Pool</p>
                  <p className="text-2xl font-bold">{parseFloat(ethers.formatEther(generalPool)).toFixed(4)} ETH</p>
                </div>
                <Users className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">Pending ({getRequestsByState(RequestState.Pending).length})</TabsTrigger>
            <TabsTrigger value="review">Under Review ({getRequestsByState(RequestState.UnderReview).length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({getRequestsByState(RequestState.Approved).length})</TabsTrigger>
            <TabsTrigger value="disbursed">Disbursed ({getRequestsByState(RequestState.Disbursed).length})</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRequestsByState(RequestState.Pending).map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAdminCallToggle={handleAdminCallToggle}
                  onPhysicalVisitToggle={handlePhysicalVisitToggle}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  onDisburse={handleDisburse}
                  onDonate={handleDonate}
                  isLoading={loading}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRequestsByState(RequestState.UnderReview).map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAdminCallToggle={handleAdminCallToggle}
                  onPhysicalVisitToggle={handlePhysicalVisitToggle}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  onDisburse={handleDisburse}
                  onDonate={handleDonate}
                  isLoading={loading}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="approved" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRequestsByState(RequestState.Approved).map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAdminCallToggle={handleAdminCallToggle}
                  onPhysicalVisitToggle={handlePhysicalVisitToggle}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  onDisburse={handleDisburse}
                  onDonate={handleDonate}
                  isLoading={loading}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="disbursed" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRequestsByState(RequestState.Disbursed).map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onAdminCallToggle={handleAdminCallToggle}
                  onPhysicalVisitToggle={handlePhysicalVisitToggle}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                  onDisburse={handleDisburse}
                  onDonate={handleDonate}
                  isLoading={loading}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Hospital Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Hospital wallet address (0x...)"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                  />
                  <Button onClick={handleSetHospital} disabled={loading}>
                    Whitelist Hospital
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;