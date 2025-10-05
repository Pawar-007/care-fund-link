import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { FilePlus, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMedicalRecords } from '@/context/MedicalRecordContext';
import { useContracts } from '@/context/ContractContext';

export const AddRecordToCampaignDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { medicalRecords, markForFunding } = useMedicalRecords();
  const { funding } = useContracts();

  const handleToggleRecord = (recordId: number) => {
    setSelectedRecords(prev =>
      prev.includes(recordId)
        ? prev.filter(id => id !== recordId)
        : [...prev, recordId]
    );
  };

  const handleAddRecords = async () => {
    if (selectedRecords.length === 0) {
      toast({ title: "Please select at least one record", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      // Mark records for funding and add to campaign
      for (const recordId of selectedRecords) {
        const record = medicalRecords[recordId];
        
        // Mark for funding in storage contract
        await markForFunding(recordId, true);
        
        // Add IPFS hash to campaign
        if (funding) {
          const tx = await funding.addMedicalRecord(record.ipfsHash);
          await tx.wait();
        }
      }

      toast({ title: "Records added to campaign successfully!" });
      setSelectedRecords([]);
      setIsOpen(false);
    } catch (error: any) {
      toast({ title: "Error adding records", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FilePlus className="h-4 w-4 mr-2" />
          Add Records for Verification
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Medical Records to Campaign</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {medicalRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No medical records available. Upload records first.
            </p>
          ) : (
            medicalRecords.map((record) => (
              <Card key={record.id} className={selectedRecords.includes(record.id) ? 'border-primary' : ''}>
                <CardContent className="flex items-center gap-4 py-4">
                  <Checkbox
                    checked={selectedRecords.includes(record.id)}
                    onCheckedChange={() => handleToggleRecord(record.id)}
                  />
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{record.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Doctor: {record.doctor} • {record.date}
                    </p>
                    {record.sharedForFunding && (
                      <Badge variant="secondary" className="mt-1">Already shared</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleAddRecords} disabled={loading || selectedRecords.length === 0}>
            {loading ? "Adding..." : `Add ${selectedRecords.length} Record(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
