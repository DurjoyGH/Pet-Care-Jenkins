import { Loader2 } from "lucide-react";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={36} className="animate-spin text-primary" />
    </div>
  );
}
