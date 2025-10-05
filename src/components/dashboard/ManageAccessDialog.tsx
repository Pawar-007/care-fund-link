import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { UserPlus, UserMinus, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMedicalRecords } from '@/context/MedicalRecordContext';

interface ManageAccessDialogProps {
  grantedAddresses: string[];
  onUpdate: () => void;
}

export const ManageAccessDialog = ({ grantedAddresses, onUpdate }: ManageAccessDialogProps) => {
  const [newAddress, setNewAddress] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { grantAccess, revokeAccess } = useMedicalRecords();

  const handleGrantAccess = async () => {
    if (!newAddress || !newAddress.startsWith('0x')) {
      toast({ title: "Invalid address", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await grantAccess(newAddress);
      toast({ title: "Access granted successfully!" });
      setNewAddress('');
      onUpdate();
    } catch (error: any) {
      toast({ title: "Error granting access", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeAccess = async (address: string) => {
    try {
      setLoading(true);
      await revokeAccess(address);
      toast({ title: "Access revoked successfully!" });
      onUpdate();
    } catch (error: any) {
      toast({ title: "Error revoking access", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          Manage Access ({grantedAddresses.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Medical Record Access</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Grant New Access */}
          <Card>
            <CardContent className="pt-6">
              <Label htmlFor="address">Grant Access to New User</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="address"
                  placeholder="0x..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                <Button onClick={handleGrantAccess} disabled={loading}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Grant
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Access List */}
          <div>
            <h3 className="font-semibold mb-3">Users with Access</h3>
            {grantedAddresses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users have access yet</p>
            ) : (
              <div className="space-y-2">
                {grantedAddresses.map((addr) => (
                  <Card key={addr}>
                    <CardContent className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{addr.slice(0, 6)}...{addr.slice(-4)}</Badge>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeAccess(addr)}
                        disabled={loading}
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
