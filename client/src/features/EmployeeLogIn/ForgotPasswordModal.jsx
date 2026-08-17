import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordModal({ onClose }) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Forgot Password?</DialogTitle>
          <DialogDescription>
            Please contact your Warehouse Manager or Administrator to reset your password.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={onClose}>Got it</Button>
      </DialogContent>
    </Dialog>
  );
}