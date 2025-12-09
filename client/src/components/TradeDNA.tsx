import { Card } from '@/components/ui/card';
import { Dna } from 'lucide-react';

interface TradeDNAProps {
  visual: number;
  macro: number;
  momentum: number;
  sentiment: number;
  riskReward: number;
}

export default function TradeDNA({ visual, macro, momentum, sentiment, riskReward }: TradeDNAProps) {
  const clamp01 = (val: number) => Math.min(1, Math.max(0, val));

  // Visual/Macro/Momentum/Sentiment come in as 0-100. Risk/Reward is 0-16.
  const metrics = [
    { label: 'Visual', value: clamp01(visual / 100), angle: -90 },
    { label: 'Macro', value: clamp01(macro / 100), angle: -18 },
    { label: 'Momentum', value: clamp01(momentum / 100), angle: 54 },
    { label: 'Reward', value: clamp01(riskReward / 16), angle: 126 },
    { label: 'Sentiment', value: clamp01(sentiment / 100), angle: 198 },
  ];

  const centerX = 100;
  const centerY = 100;
  const maxRadius = 70;
  const levels = 5;

  const getPoint = (angle: number, radius: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    };
  };

  const gridLines = Array.from({ length: levels }, (_, i) => {
    const radius = (maxRadius / levels) * (i + 1);
    return metrics.map((m) => getPoint(m.angle, radius));
  });

  const dataPoints = metrics.map((m) => getPoint(m.angle, m.value * maxRadius));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Dna className="w-4 h-4 text-fin-accent" />
        <h3 className="font-semibold text-sm uppercase tracking-wide">Trade DNA</h3>
      </div>
      
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="mb-2">
          {gridLines.map((points, levelIdx) => (
            <polygon
              key={levelIdx}
              points={points.map((p) => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="0.5"
              opacity={0.3}
            />
          ))}
          
          {metrics.map((m, i) => {
            const outer = getPoint(m.angle, maxRadius);
            return (
              <line
                key={i}
                x1={centerX}
                y1={centerY}
                x2={outer.x}
                y2={outer.y}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="0.5"
                opacity={0.3}
              />
            );
          })}
          
          <polygon
            points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="hsl(var(--fin-accent))"
            fillOpacity={0.2}
            stroke="hsl(var(--fin-accent))"
            strokeWidth="2"
          />
          
          {dataPoints.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="hsl(var(--fin-accent))"
            />
          ))}
          
          {metrics.map((m, i) => {
            const labelPoint = getPoint(m.angle, maxRadius + 18);
            return (
              <text
                key={i}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-[10px] font-medium"
              >
                {m.label}
              </text>
            );
          })}
        </svg>
        
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs w-full mt-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Visual</span>
            <span className="font-mono font-semibold">{Math.round(visual / 10)}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Macro</span>
            <span className="font-mono font-semibold">{Math.round(macro / 10)}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sentiment</span>
            <span className="font-mono font-semibold">{Math.round(sentiment / 10)}/10</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Momentum</span>
            <span className="font-mono font-semibold">{Math.round(momentum / 10)}/10</span>
          </div>
          <div className="flex justify-between col-span-2 pt-1 border-t border-border mt-1">
            <span className="text-muted-foreground">Risk Score</span>
            <span className="font-mono font-semibold">{Math.round(riskReward / 10)}/16</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
