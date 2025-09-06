import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Shield, Globe, ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  const stats = [
    { label: "Patients Helped", value: "10,000+", icon: Heart },
    { label: "Funds Raised", value: "$2.5M+", icon: Globe },
    { label: "Verified Hospitals", value: "150+", icon: Shield },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-accent/20 to-primary-light/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
          {/* Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="space-y-4">
              <Badge variant="secondary" className="mb-4">
                🚀 Revolutionary Healthcare Funding
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Secure Healthcare{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Funding
                </span>{" "}
                & Medical Records
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Empowering patients with blockchain-based funding requests and secure, 
                decentralized medical record storage. Verified by hospitals, trusted by donors.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all duration-300"
              >
                Start Fundraising
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="group">
                <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <stat.icon className="h-6 w-6 mx-auto text-primary" />
                  <div className="font-bold text-xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual/Demo */}
          <div className="relative animate-slide-in-right">
            <Card className="p-6 shadow-strong hover:shadow-glow transition-all duration-500">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Active Funding Request</h3>
                  <Badge variant="default" className="bg-success">Verified</Badge>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Emergency Surgery Fund</h4>
                    <p className="text-sm text-muted-foreground">
                      Supporting Maria's critical heart surgery with verified medical documentation.
                    </p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">$8,500 / $12,000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: "71%" }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">71% funded • 5 days left</div>
                  </div>

                  <Button className="w-full" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    Donate Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full animate-pulse-soft" />
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse-soft" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;