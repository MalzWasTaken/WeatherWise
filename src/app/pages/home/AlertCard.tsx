import { Card, CardContent } from "../../../components/ui/card";

interface AlertCardProps {
  alerts: { title: string; description?: string; date?: string }[];
  selectedCity: string;
}

export function AlertCard({ alerts, selectedCity }: AlertCardProps) {
  return (
    <Card className="bg-white/20 backdrop-blur-md border-white/30 hover:scale-105 transition-all duration-300">
      <CardContent className="p-6 h-full flex flex-col items-start justify-start gap-3">
        <h3 className="font-semibold text-white text-lg">
          Weather Alerts for {selectedCity || "current city"}:
        </h3>

        {alerts.length === 0 ||
        (alerts.length === 1 && alerts[0].title === "No alerts") ? (
          <p className="text-sm text-gray-200">No alerts</p>
        ) : (
          <ul className="space-y-2 w-full">
            {alerts.map((alert, idx) => (
              <li key={idx} className="text-sm text-white flex flex-col gap-1">
                <span className="font-medium">{alert.title}</span>
                {alert.description && (
                  <span className="text-gray-200 text-xs">
                    {alert.description}
                  </span>
                )}
                {alert.date && (
                  <span className="text-gray-300 text-xs">
                    {new Date(alert.date).toLocaleDateString()}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
