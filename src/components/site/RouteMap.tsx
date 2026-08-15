import * as React from "react";

interface RouteMapProps {
  shopLat: number;
  shopLng: number;
  customerLat: number;
  customerLng: number;
  transporterLat?: number;
  transporterLng?: number;
  className?: string;
}

export function RouteMap({
  shopLat,
  shopLng,
  customerLat,
  customerLng,
  transporterLat,
  transporterLng,
  className,
}: RouteMapProps) {
  const width = 400;
  const height = 300;

  const toX = (lng: number) => ((lng - 32.55) / 0.1) * width;
  const toY = (lat: number) => height - ((lat - 0.32) / 0.1) * height;

  const shopX = toX(shopLng);
  const shopY = toY(shopLat);
  const custX = toX(customerLng);
  const custY = toY(customerLat);
  const tx = transporterLat ? toX(transporterLng) : null;
  const ty = transporterLng ? toY(transporterLat) : null;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`w-full ${className || ""}`}>
      <rect width={width} height={height} fill="hsl(var(--muted))" rx="8" />
      <line
        x1={shopX}
        y1={shopY}
        x2={custX}
        y2={custY}
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        strokeDasharray="6 4"
      />
      <circle cx={shopX} cy={shopY} r="8" fill="hsl(var(--primary))" opacity="0.2" />
      <circle cx={shopX} cy={shopY} r="5" fill="hsl(var(--primary))" />
      <text
        x={shopX + 10}
        y={shopY + 4}
        fill="hsl(var(--foreground))"
        fontSize="10"
        fontWeight="600"
      >
        Shop
      </text>
      <circle cx={custX} cy={custY} r="8" fill="hsl(var(--destructive))" opacity="0.2" />
      <circle cx={custX} cy={custY} r="5" fill="hsl(var(--destructive))" />
      <text
        x={custX + 10}
        y={custY + 4}
        fill="hsl(var(--foreground))"
        fontSize="10"
        fontWeight="600"
      >
        Customer
      </text>
      {tx !== null && ty !== null && (
        <>
          <circle cx={tx} cy={ty} r="10" fill="hsl(var(--primary))" opacity="0.15" />
          <circle cx={tx} cy={ty} r="6" fill="hsl(var(--primary))" />
          <text x={tx + 10} y={ty + 4} fill="hsl(var(--foreground))" fontSize="10" fontWeight="600">
            You
          </text>
        </>
      )}
    </svg>
  );
}
