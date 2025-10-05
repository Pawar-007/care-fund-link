import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UploadRecordDialog } from "@/components/medical/UploadRecordDialog";
import { useContracts } from "../context/ContractContext";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMedicalRecords } from "../context/MedicalRecordContext";
import { ManageAccessDialog } from "../components/dashboard/ManageAccessDialog";
import { AddRecordToCampaignDialog } from "../components/dashboard/AddRecordToCampaignDialog";
import {
  Plus, Heart, FileText, DollarSign, Users,
  Shield, CheckCircle, Download, Eye, RefreshCw
} from "lucide-react";

interface Campaign {
  patient: string;
  name: string;
  description: string;
  createdAt: number;
  deadline: number;
  hospitalWallet: string;
  diseaseType: string;
  patientCallVerified: boolean;
  hospitalCrosscheckVerified: boolean;
  physicalVisitVerified: boolean;
  contactNumber: string;
  visible: boolean;
  active: boolean;
  isFunded: boolean;
  totalFunded: string;
  goalAmount: string;
  medicalRecords: string[];
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { account, funding, storage, connectWallet } = useContracts();
  const { medicalRecords, loading, fetchRecords } = useMedicalRecords();
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [grantedAddresses, setGrantedAddresses] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  const handleConnectWallet = async () => {
    await connectWallet();
  };

  const handleRecordUpload = async () => {
    await fetchRecords();
    toast({ title: "Records updated!" });
  };

  const loadMyCampaigns = async () => {
    if (!funding || !account) return;

    try {
      setRefreshing(true);
      const allRequests = await funding.getAllRequests();
      
      const myRequests = allRequests
        .map((r: any) => ({
          patient: r.patient,
          name: r.name,
          description: r.description,
          createdAt: Number(r.createdAt),
          deadline: Number(r.deadline),
          hospitalWallet: r.hospitalWallet,
          diseaseType: r.diseaseType,
          patientCallVerified: r.patientCallVerified,
          hospitalCrosscheckVerified: r.hospitalCrosscheckVerified,
          physicalVisitVerified: r.physicalVisitVerified,
          contactNumber: r.contactNumber,
          visible: r.visible,
          active: r.active,
          isFunded: r.isFunded,
          totalFunded: r.totalFunded.toString(),
          goalAmount: r.goalAmount.toString(),
          medicalRecords: r.medicalRecords.map((cid: string) => cid.toString()),
        }))
        .filter((req: Campaign) => req.patient.toLowerCase() === account.toLowerCase());

      myRequests.sort((a: Campaign, b: Campaign) => {
        if (a.active && !b.active) return -1;
        if (!a.active && b.active) return 1;
        if (a.isFunded && !b.isFunded) return -1;
        if (!a.isFunded && b.isFunded) return 1;
        return 0;
      });

      setMyCampaigns(myRequests);
    } catch (error) {
      console.log("Error fetching campaigns:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMyCampaigns();
  }, [funding, account]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (funding && account) {
        loadMyCampaigns();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [funding, account]);

  const donationsMade: any[] = [];

  const stats = [
    {
      title: "Total Raised",
      value: "$" + myCampaigns.reduce((sum, c) => sum + Number(c.totalFunded), 0),
      change: myCampaigns.length > 0 ? `${myCampaigns.length} campaign(s)` : "No campaigns yet",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Active Campaigns",
      value: myCampaigns.filter(c => c.active).length.toString(),
      change: `${myCampaigns.filter(c => !c.active && c.isFunded).length} funded, ${myCampaigns.filter(c => !c.active && !c.isFunded).length} rejected`,
      icon: Heart,
      color: "text-primary"
    },
    {
      title: "Medical Records",
      value: medicalRecords?.length.toString() || "0",
      change: `${medicalRecords?.filter(r => r.sharedForFunding).length || 0} shared for funding`,
      icon: FileText,
      color: "text-secondary"
    },
    {
      title: "Total Donors",
      value: "0",
      change: "Track donations",
      icon: Users,
      color: "text-warning"
    }
  ];

  if (account === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-16 w-16 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <p className="text-muted-foreground">Connect your wallet to access the platform</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleConnectWallet}>
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
              <p className="opacity-90">Manage your healthcare funding campaigns and medical records</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
              {account && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {`${account?.slice(0, 6)}...${account.slice(-4)}`}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="campaigns">My Campaigns</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="donations">My Donations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className={`text-xs ${stat.color}`}>{stat.change}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link to="/create-request" className="w-full">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                    <Plus className="h-6 w-6" /> Create New Campaign
                  </Button>
                </Link>

                <UploadRecordDialog onUploadSuccess={handleRecordUpload} trigger={
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                    <FileText className="h-6 w-6" /> Upload Medical Record
                  </Button>
                } />

                <Link to="/browse" className="w-full">
                  <Button variant="outline" className="w-full h-20 flex flex-col items-center gap-2">
                    <Heart className="h-6 w-6" /> Browse Campaigns
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Campaigns</h2>
              <Button onClick={loadMyCampaigns} variant="outline" size="sm" disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {myCampaigns.length === 0 ? (
              <Card className="p-6 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold">No campaigns created yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create a new campaign to get started.</p>
                <Link to="/create-request">
                  <Button>Create Campaign</Button>
                </Link>
              </Card>
            ) : (
              <div className="grid gap-4">
                {myCampaigns.map((campaign, idx) => (
                  <Card key={idx} className="hover:shadow-medium transition-all">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{campaign.name}</h3>
                            {campaign.active && <Badge variant="default">Active</Badge>}
                            {!campaign.active && campaign.isFunded && <Badge variant="secondary">Funded</Badge>}
                            {!campaign.active && !campaign.isFunded && <Badge variant="destructive">Rejected</Badge>}
                            {campaign.visible && <Badge variant="outline">Verified</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Disease: {campaign.diseaseType} • Contact: {campaign.contactNumber}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Raised: ${campaign.totalFunded}</span>
                          <span>Goal: ${campaign.goalAmount}</span>
                        </div>
                        <Progress 
                          value={(Number(campaign.totalFunded) / Number(campaign.goalAmount)) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className={`flex items-center gap-1 ${campaign.patientCallVerified ? 'text-success' : 'text-muted-foreground'}`}>
                          <CheckCircle className="h-3 w-3" />
                          Call Verified
                        </div>
                        <div className={`flex items-center gap-1 ${campaign.hospitalCrosscheckVerified ? 'text-success' : 'text-muted-foreground'}`}>
                          <CheckCircle className="h-3 w-3" />
                          Hospital Check
                        </div>
                        <div className={`flex items-center gap-1 ${campaign.physicalVisitVerified ? 'text-success' : 'text-muted-foreground'}`}>
                          <CheckCircle className="h-3 w-3" />
                          Physical Visit
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">
                            {campaign.medicalRecords.length} Medical Record(s) Attached
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <AddRecordToCampaignDialog />
                        <ManageAccessDialog 
                          grantedAddresses={grantedAddresses} 
                          onUpdate={loadMyCampaigns} 
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const recordsList = campaign.medicalRecords.join('\n');
                            toast({ 
                              title: "Medical Records", 
                              description: recordsList || "No records attached yet" 
                            });
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Records ({campaign.medicalRecords.length})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="records" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Medical Records</h2>
              <UploadRecordDialog onUploadSuccess={handleRecordUpload} />
            </div>

            {(!medicalRecords || medicalRecords.length === 0) ? (
              <Card className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold">No medical records uploaded yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload your first medical record to get started.</p>
                <UploadRecordDialog onUploadSuccess={handleRecordUpload} />
              </Card>
            ) : (
              <div className="grid gap-4">
                {medicalRecords?.map(record => (
                  <Card key={record.id} className="hover:shadow-medium transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg bg-primary-light">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{record.title}</h3>
                            <p className="text-sm text-muted-foreground">{record.metadata}</p>
                            <p className="text-sm text-muted-foreground">Doctor: {record.doctor}</p>
                            <p className="text-xs text-muted-foreground mt-1">{record.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {record.sharedForFunding && (
                            <Badge className="bg-success text-success-foreground">
                              <Heart className="h-3 w-3 mr-1" /> Shared for Funding
                            </Badge>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://gateway.lighthouse.storage/ipfs/${record.ipfsHash}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = `https://gateway.lighthouse.storage/ipfs/${record.ipfsHash}`;
                              link.download = record.title;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Donations</h2>
              <Link to="/browse">
                <Button>Start Donating</Button>
              </Link>
            </div>

            {donationsMade.length === 0 ? (
              <Card className="p-6 text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold">No donations yet</h3>
                <p className="text-sm text-muted-foreground">Start donating to make an impact in someone's life.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {donationsMade?.map(donation => (
                  <Card key={donation.id} className="hover:shadow-medium transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-lg bg-success-light">
                            <Heart className="h-6 w-6 text-success" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{donation.campaignTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              Donated ${donation.amount} on {donation.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-success text-success-foreground">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {donation.status}
                          </Badge>
                          <Button variant="outline" size="sm">View Campaign</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;