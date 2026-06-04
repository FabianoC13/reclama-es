import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProcedureCardProps {
  title: string;
  description: string;
  audience?: string;
  timeframe?: string;
  cost?: string;
  badge: string;
  badgeVariant?: "success" | "muted" | "default";
  buttonLabel: string;
  buttonHref?: string;
  enabled?: boolean;
}

export default function ProcedureCard({
  title,
  description,
  audience,
  timeframe,
  cost,
  badge,
  badgeVariant = "default",
  buttonLabel,
  buttonHref,
  enabled = false,
}: ProcedureCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <CardTitle className="text-xl">{title}</CardTitle>
        <Badge variant={badgeVariant}>{badge}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed text-text-secondary">{description}</p>
        {audience && (
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">Para quién: </span>
            {audience}
          </p>
        )}
        {timeframe && (
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">Plazo habitual: </span>
            {timeframe}
          </p>
        )}
        {cost && (
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">Coste: </span>
            {cost}
          </p>
        )}
        {enabled && buttonHref ? (
          <Button asChild>
            <Link href={buttonHref}>{buttonLabel}</Link>
          </Button>
        ) : (
          <Button disabled>{buttonLabel}</Button>
        )}
      </CardContent>
    </Card>
  );
}
