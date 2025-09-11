import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { UploadRecordDialog } from "@/components/medical/UploadRecordDialog";
import { 
  Plus, 
  Heart, 
  FileText, 
  DollarSign, 
  Users, 
  Clock,
  Shield,
  TrendingUp,
  Download,
  Upload,
  Eye,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const userData = {
    name: "John Doe",
    userType: "Patient",
    walletConnected: true,
    walletAddress: "0x1234...5678"
  };

  // Mock campaign data
  const myCampaigns = [
    {
      id: 1,
      title: "Heart Surgery Recovery Fund",
      goal: 15000,
      raised: 12500,
      donors: 89,
      status: "Active",
      daysLeft: 12,
      verificationStatus: "Verified"
    },
    {
      id: 2,
      title: "Physical Therapy Sessions",
      goal: 8000,
      raised: 8000,
      donors: 45,
      status: "Completed",
      daysLeft: 0,
      verificationStatus: "Completed"
    }
  ];

  // Mock medical records
  const medicalRecords = [
    {
      id: 1,
      title: "Cardiac Consultation Report",
      date: "2024-01-15",
      type: "Consultation",
      doctor: "Dr. Smith",
      hospital: "City General Hospital",
      sharedForFunding: true,
      size: "2.4 MB"
    },
    {
      id: 2,
      title: "ECG Test Results",
      date: "2024-01-10",
      type: "Test Results",
      doctor: "Dr. Johnson",
      hospital: "City General Hospital",
      sharedForFunding: true,
      size: "1.2 MB"
    },
    {
      id: 3,
      title: "Blood Work Analysis",
      date: "2024-01-08",
      type: "Lab Results",
      doctor: "Dr. Wilson",
      hospital: "City General Hospital",
      sharedForFunding: false,
      size: "0.8 MB"
    }
  ];

  // Mock donations made
  const donationsMade = [
    {
      id: 1,
      campaignTitle: "Emergency Surgery for Maria",
      amount: 150,
      date: "2024-01-20",
      status: "Confirmed"
    },
    {
      id: 2,
      campaignTitle: "Cancer Treatment Support",
      amount: 75,
      date: "2024-01-18",
      status: "Confirmed"
    }
  ];

  const stats = [
    {
      title: "Total Raised",
      value: "$20,500",
      change: "+$2,500 this month",
      icon: DollarSign,
      color: "text-success"
    },
    {
      title: "Active Campaigns",
      value: "1",
      change: "1 pending approval",
      icon: Heart,
      color: "text-primary"
    },
    {
      title: "Medical Records",
      value: "3",
      change: "2 shared for funding",
      icon: FileText,
      color: "text-secondary"
    },
    {
      title: "Total Donors",
      value: "134",
      change: "+12 this week",
      icon: Users,
      color: "text-warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userData.name}</h1>
              <p className="opacity-90">Manage your healthcare funding campaigns and medical records</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                {userData.userType}
              </Badge>
              {userData.walletConnected && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {userData.walletAddress}
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="hover:shadow-medium transition-all">
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Plus className="h-6 w-6" />
                  Create New Campaign
                </Button>
                <UploadRecordDialog 
                  onUploadSuccess={() => {
                    // Refresh medical records list here if needed
                    console.log("Medical record uploaded successfully");
                  }}
                  trigger={
                    <Button className="h-20 flex-col gap-2" variant="outline">
                      <Upload className="h-6 w-6" />
                      Upload Medical Record
                    </Button>
                  }
                />
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Heart className="h-6 w-6" />
                  Browse Campaigns
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-success-light">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div className="flex-1">
                    <p className="font-medium">Campaign verified successfully</p>
                    <p className="text-sm text-muted-foreground">Your heart surgery campaign is now live</p>
                  </div>
                  <span className="text-sm text-muted-foreground">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-primary-light">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">New donation received</p>
                    <p className="text-sm text-muted-foreground">$150 donated to your campaign</p>
                  </div>
                  <span className="text-sm text-muted-foreground">1 day ago</span>
                </div>
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-secondary-light">
                  <FileText className="h-5 w-5 text-secondary" />
                  <div className="flex-1">
                    <p className="font-medium">Medical record uploaded</p>
                    <p className="text-sm text-muted-foreground">Cardiac consultation report added</p>
                  </div>
                  <span className="text-sm text-muted-foreground">3 days ago</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Campaigns</h2>
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Create New Campaign
              </Button>
            </div>

            <div className="grid gap-6">
              {myCampaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-medium transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-semibold">{campaign.title}</h3>
                          <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                          <Badge variant="outline" className="text-success border-success">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {campaign.verificationStatus}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>${campaign.raised.toLocaleString()} raised</span>
                            <span>of ${campaign.goal.toLocaleString()}</span>
                          </div>
                          <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                        </div>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {campaign.donors} donors
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Completed'}
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {((campaign.raised / campaign.goal) * 100).toFixed(1)}% funded
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Medical Records</h2>
              <UploadRecordDialog onUploadSuccess={() => {
                // Refresh medical records list here if needed
                console.log("Medical record uploaded successfully");
              }} />
            </div>

            <div className="grid gap-4">
              {medicalRecords.map((record) => (
                <Card key={record.id} className="hover:shadow-medium transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-lg bg-primary-light">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{record.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {record.type} • {record.doctor} • {record.hospital}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {record.date} • {record.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {record.sharedForFunding ? (
                          <Badge className="bg-success text-success-foreground">
                            <Heart className="h-3 w-3 mr-1" />
                            Shared for Funding
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Private
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Donations Tab */}
          <TabsContent value="donations" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Donations</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Total donated: $225
              </div>
            </div>

            <div className="grid gap-4">
              {donationsMade.map((donation) => (
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
                        <Button variant="outline" size="sm">
                          View Campaign
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;