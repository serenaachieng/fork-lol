import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function FormCard({ title, description, children, className, ...props }) {
  return (
    <Card
      className={cn(
        "bg-white ring-1 ring-black/5",
        "shadow-[4px_4px_14px_rgba(0,0,0,0.05),-3px_-3px_10px_rgba(255,255,255,0.9)]",
        className
      )}
      {...props}
    >
      <CardHeader>
        <CardTitle className="text-xs font-semibold uppercase tracking-wide">
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">{children}</CardContent>
    </Card>
  );
}