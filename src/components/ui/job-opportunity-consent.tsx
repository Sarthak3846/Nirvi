"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { useSessionStore } from "@/state/session";
import { toast } from "sonner";

export function JobOpportunityConsent() {
  // Feature removed as API endpoint was returning 404
  // Component kept as a stub for potential future reimplementation
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = useSessionStore((state) => state.session);
  const user = session?.user;

  // Note: API endpoints were removed, so the consent functionality is disabled
  const handleConsent = async (consent: boolean) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Simply close the dialog without API calls
      setOpen(false);
      
      if (consent) {
        toast.success("Thanks! We'll match you with suitable job opportunities.");
      }
    } catch (error) {
      console.error("Error processing consent:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Job Opportunity Matching</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you actively looking for job opportunities?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between sm:justify-between mt-4">
          <Button
            variant="outline"
            onClick={() => handleConsent(false)}
            disabled={loading}
            className="flex-1 sm:flex-none mr-2"
          >
            No
          </Button>
          <Button
            onClick={() => handleConsent(true)}
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            Yes
          </Button>
        </DialogFooter>
        <p className="text-xs text-muted-foreground mt-2">
          Choose yes for RebuildCV to match you with jobs that suit your role for the next 3 months.
        </p>
      </DialogContent>
    </Dialog>
  );
}
