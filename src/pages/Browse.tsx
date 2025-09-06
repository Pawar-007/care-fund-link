import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  DollarSign,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  // Mock data - in real app this would come from blockchain
  const campaigns = [
    {
      id: 1,
      title: "Emergency Heart Surgery for Maria",
      description: "Maria needs urgent cardiac surgery. Verified by City General Hospital with complete medical documentation.",
      goal: 12000,
      raised: 8500,
      donors: 127,
      daysLeft: 5,
      category: "Emergency",
      location: "New York, NY",
      verified: true,
      hospitalName: "City General Hospital",
      patientAge: 34,
      urgency: "Critical"
    },
    {
      id: 2,
      title: "Cancer Treatment Support for David",
      description: "Supporting David's chemotherapy treatment with verified oncology center partnership.",
      goal: 25000,
      raised: 18750,
      donors: 203,
      daysLeft: 12,
      category: "Cancer",
      location: "Los Angeles, CA",
      verified: true,
      hospitalName: "Memorial Cancer Center",
      patientAge: 42,
      urgency: "High"
    },
    {
      id: 3,
      title: "Pediatric Surgery for Little Emma",
      description: "5-year-old Emma needs specialized pediatric surgery. Family exhausted insurance options.",
      goal: 15000,
      raised: 6750,
      donors: 89,
      daysLeft: 18,
      category: "Pediatric",
      location: "Chicago, IL",
      verified: true,
      hospitalName: "Children's Hospital",
      patientAge: 5,
      urgency: "Medium"
    },
    {
      id: 4,
      title: "Spinal Reconstruction Surgery",
      description: "Complex spinal surgery needed after accident. Full medical verification completed.",
      goal: 35000,
      raised: 22400,
      donors: 156,
      daysLeft: 8,
      category: "Surgery",
      location: "Miami, FL",
      verified: true,
      hospitalName: "Orthopedic Specialists",
      patientAge: 28,
      urgency: "High"
    }
  ];

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "bg-destructive";
      case "High": return "bg-warning";
      case "Medium": return "bg-primary";
      default: return "bg-success";
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === "all" || campaign.category.toLowerCase() === filterBy;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-12">
        <div className="container">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Browse Funding Requests</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover verified healthcare funding campaigns and make a direct impact on someone's life
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="cancer">Cancer</SelectItem>
                  <SelectItem value="pediatric">Pediatric</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="urgent">Most Urgent</SelectItem>
                  <SelectItem value="progress">Most Funded</SelectItem>
                  <SelectItem value="goal">Highest Goal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="group hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {campaign.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    {campaign.verified && (
                      <Badge variant="default" className="bg-success text-success-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <Badge className={`text-xs ${getUrgencyColor(campaign.urgency)} text-white`}>
                      {campaign.urgency}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                  {campaign.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {campaign.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">${campaign.raised.toLocaleString()} raised</span>
                    <span className="text-muted-foreground">of ${campaign.goal.toLocaleString()}</span>
                  </div>
                  <Progress value={getProgressPercentage(campaign.raised, campaign.goal)} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {getProgressPercentage(campaign.raised, campaign.goal).toFixed(1)}% funded
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium">{campaign.donors}</div>
                    <div className="text-xs text-muted-foreground">donors</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium">{campaign.daysLeft}</div>
                    <div className="text-xs text-muted-foreground">days left</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium">{campaign.patientAge}yr</div>
                    <div className="text-xs text-muted-foreground">patient</div>
                  </div>
                </div>

                {/* Hospital Info */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hospital:</span>
                    <span className="font-medium">{campaign.hospitalName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{campaign.location}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-medium transition-all">
                  <Heart className="h-4 w-4 mr-2" />
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Campaigns
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Browse;