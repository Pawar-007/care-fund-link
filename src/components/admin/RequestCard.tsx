import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  Building, 
  MapPin,
  DollarSign,
  Users,
  AlertTriangle
} from "lucide-react";
import { RequestData, RequestState } from "@/lib/web3";
import { ethers } from "ethers";

interface RequestCardProps {
  request: RequestData;
  onAdminCallToggle: (id: number, done: boolean) => void;
  onPhysicalVisitToggle: (id: number, done: boolean) => void;
  onApprove: (id: number) => void;
  onCancel: (id: number) => void;
  onDisburse: (id: number, amount: string) => void;
  onDonate?: (id: number, amount: string) => void;
  isLoading?: boolean;
}

const getStateColor = (state: RequestState) => {
  switch (state) {
    case RequestState.Pending: return "bg-warning";
    case RequestState.UnderReview: return "bg-info";
    case RequestState.Approved: return "bg-success";
    case RequestState.Canceled: return "bg-destructive";
    case RequestState.Disbursed: return "bg-primary";
    default: return "bg-muted";
  }
};

const getStateName = (state: RequestState) => {
  switch (state) {
    case RequestState.Pending: return "Pending";
    case RequestState.UnderReview: return "Under Review";
    case RequestState.Approved: return "Approved";
    case RequestState.Canceled: return "Canceled";
    case RequestState.Disbursed: return "Disbursed";
    default: return "Unknown";
  }
};

export const RequestCard = ({
  request,
  onAdminCallToggle,
  onPhysicalVisitToggle,
  onApprove,
  onCancel,
  onDisburse,
  onDonate,
  isLoading = false
}: RequestCardProps) => {
  const goalInEth = parseFloat(ethers.formatEther(request.goal));
  const raisedInEth = parseFloat(ethers.formatEther(request.raised));
  const disbursedInEth = parseFloat(ethers.formatEther(request.disbursed));
  
  const progressPercentage = (raisedInEth / goalInEth) * 100;
  const availableForDisbursement = raisedInEth - disbursedInEth;
  
  const canApprove = request.adminCallDone && request.hospitalVerified && request.physicalVisitDone;
  const isExpired = Date.now() / 1000 > request.deadline;

  return (
    <Card className="group hover:shadow-strong transition-all duration-300">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Badge className={`text-xs ${getStateColor(request.state)} text-white`}>
              {getStateName(request.state)}
            </Badge>
            <div className="text-sm text-muted-foreground">ID: {request.id}</div>
          </div>
          {isExpired && request.state === RequestState.Approved && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Expired
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-lg line-clamp-2">
          {request.title}
        </CardTitle>
        
        <p className="text-sm text-muted-foreground line-clamp-3">
          {request.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Verification Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Phone className={`h-4 w-4 ${request.adminCallDone ? 'text-success' : 'text-muted-foreground'}`} />
            <div className="text-xs">
              <div className="font-medium">Admin Call</div>
              <div className={request.adminCallDone ? 'text-success' : 'text-muted-foreground'}>
                {request.adminCallDone ? 'Done' : 'Pending'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Building className={`h-4 w-4 ${request.hospitalVerified ? 'text-success' : 'text-muted-foreground'}`} />
            <div className="text-xs">
              <div className="font-medium">Hospital</div>
              <div className={request.hospitalVerified ? 'text-success' : 'text-muted-foreground'}>
                {request.hospitalVerified ? 'Verified' : 'Pending'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className={`h-4 w-4 ${request.physicalVisitDone ? 'text-success' : 'text-muted-foreground'}`} />
            <div className="text-xs">
              <div className="font-medium">Visit</div>
              <div className={request.physicalVisitDone ? 'text-success' : 'text-muted-foreground'}>
                {request.physicalVisitDone ? 'Done' : 'Pending'}
              </div>
            </div>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{raisedInEth.toFixed(4)} ETH raised</span>
            <span className="text-muted-foreground">of {goalInEth.toFixed(4)} ETH</span>
          </div>
          <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="font-medium">{progressPercentage.toFixed(1)}%</div>
              <div className="text-muted-foreground">funded</div>
            </div>
            <div>
              <div className="font-medium">{disbursedInEth.toFixed(4)} ETH</div>
              <div className="text-muted-foreground">disbursed</div>
            </div>
            <div>
              <div className="font-medium">{availableForDisbursement.toFixed(4)} ETH</div>
              <div className="text-muted-foreground">available</div>
            </div>
          </div>
        </div>

        {/* Patient & Hospital Info */}
        <div className="pt-3 border-t space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Patient:</span>
            <span className="font-mono">{`${request.patient.slice(0, 6)}...${request.patient.slice(-4)}`}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Hospital:</span>
            <span className="font-mono">{`${request.hospitalWallet.slice(0, 6)}...${request.hospitalWallet.slice(-4)}`}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Deadline:</span>
            <span>{new Date(request.deadline * 1000).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Admin Actions */}
        {(request.state === RequestState.Pending || request.state === RequestState.UnderReview) && (
          <div className="pt-3 border-t space-y-3">
            <div className="text-sm font-medium">Admin Actions</div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant={request.adminCallDone ? "default" : "outline"}
                onClick={() => onAdminCallToggle(request.id, !request.adminCallDone)}
                disabled={isLoading}
                className="text-xs"
              >
                {request.adminCallDone ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                Admin Call
              </Button>
              
              <Button
                size="sm"
                variant={request.physicalVisitDone ? "default" : "outline"}
                onClick={() => onPhysicalVisitToggle(request.id, !request.physicalVisitDone)}
                disabled={isLoading}
                className="text-xs"
              >
                {request.physicalVisitDone ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <Clock className="h-3 w-3 mr-1" />
                )}
                Visit Done
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => onApprove(request.id)}
                disabled={!canApprove || isLoading}
                className="text-xs bg-success hover:bg-success/90"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Approve
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onCancel(request.id)}
                disabled={isLoading}
                className="text-xs"
              >
                <XCircle className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Donation Action */}
        {request.state === RequestState.Approved && onDonate && (
          <div className="pt-3 border-t space-y-3">
            <div className="text-sm font-medium">Admin Donation</div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const amount = prompt(`Enter donation amount in ETH:`);
                if (amount && parseFloat(amount) > 0) {
                  onDonate(request.id, amount);
                }
              }}
              disabled={isLoading || isExpired}
              className="w-full text-xs"
            >
              <Users className="h-3 w-3 mr-1" />
              Donate to Patient
            </Button>
          </div>
        )}

        {/* Disbursement Actions */}
        {request.state === RequestState.Approved && availableForDisbursement > 0 && (
          <div className="pt-3 border-t space-y-3">
            <div className="text-sm font-medium">Disbursement</div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                onClick={() => onDisburse(request.id, availableForDisbursement.toString())}
                disabled={isLoading}
                className="text-xs"
              >
                <DollarSign className="h-3 w-3 mr-1" />
                Disburse All
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const amount = prompt(`Enter amount to disburse (max: ${availableForDisbursement.toFixed(4)} ETH):`);
                  if (amount && parseFloat(amount) > 0 && parseFloat(amount) <= availableForDisbursement) {
                    onDisburse(request.id, amount);
                  }
                }}
                disabled={isLoading}
                className="text-xs"
              >
                Partial
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};