import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Heart, Shield, Users, DollarSign, Clock } from "lucide-react";

const StatsSection = () => {
  const mainStats = [
    {
      icon: Heart,
      value: "$2.5M+",
      label: "Total Funds Raised",
      description: "Successfully funded medical treatments",
      trend: "+23%",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Users,
      value: "10,000+",
      label: "Patients Helped",
      description: "Lives improved through our platform",
      trend: "+18%",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Shield,
      value: "150+",
      label: "Verified Hospitals",
      description: "Trusted healthcare partners",
      trend: "+12%",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      value: "24hrs",
      label: "Average Verification",
      description: "Fast-track verification process",
      trend: "-15%",
      color: "from-purple-500 to-violet-500"
    }
  ];

  const detailStats = [
    { label: "Success Rate", value: "94.2%" },
    { label: "Average Donation", value: "$127" },
    { label: "Repeat Donors", value: "67%" },
    { label: "Medical Records", value: "25,000+" },
    { label: "Countries Served", value: "45+" },
    { label: "Response Time", value: "< 2min" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 via-background to-accent/20">
      <div className="container">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="mb-4">Platform Impact</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Thousands
            </span>{" "}
            Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform has revolutionized healthcare funding with transparent, secure, 
            and efficient blockchain-based solutions that put patients first.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mainStats.map((stat, index) => (
            <Card 
              key={index}
              className="group hover:shadow-strong transition-all duration-500 hover:-translate-y-2 border-0 shadow-soft overflow-hidden relative"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <CardContent className="p-6 relative">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="text-success flex items-center gap-1"
                    >
                      <TrendingUp className="h-3 w-3" />
                      {stat.trend}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="font-semibold text-foreground">
                      {stat.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Stats */}
        <Card className="p-8 shadow-medium">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {detailStats.map((stat, index) => (
              <div key={index} className="text-center space-y-2 group">
                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-16 space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary shadow-glow animate-pulse-soft">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Ready to Make a Difference?</h3>
            <p className="text-muted-foreground">
              Join thousands of patients and donors who trust our platform for secure healthcare funding.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;