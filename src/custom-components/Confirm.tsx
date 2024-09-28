// ConfirmDialog.tsx
import { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmContext = createContext({
  showConfirm: (message: string, onConfirm: () => void) => {},
});

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(() => {});

  const showConfirm = (message: string, onConfirm: () => void) => {
    setMessage(message);
    setOnConfirmCallback(() => onConfirm);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  const handleConfirm = () => {
    onConfirmCallback(); // Execute the confirmation logic (like deleting the item)
    hide(); // Close the dialog after confirming
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      {isVisible && (
        <Dialog open={isVisible} onOpenChange={hide}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <div className="py-4">{message}</div>
            <DialogFooter>
              <Button variant="outline" onClick={hide}>Cancel</Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ConfirmContext.Provider>
  );
};