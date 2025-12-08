import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TradePlanData, GradingData } from '@/lib/types';
import { TrendingUp, TrendingDown, Target, AlertCircle, Ban, Clock } from 'lucide-react';

interface TradePlanProps {
  tradePlan: TradePlanData;
  actionPlan: GradingData['action_plan'];
}

export default function TradePlan({ tradePlan, actionPlan }: TradePlanProps) {
  const isBullish = tradePlan.bias.toLowerCase().includes('bull') || 
                    tradePlan.bias.toLowerCase().includes('long') ||
                    tradePlan.bias.toLowerCase().includes('buy');

  const getActionIcon = () => {
    switch (actionPlan.action) {
      case 'BUY STOP':
      case 'LIMIT ORDER':
        return TrendingUp;
      case 'SELL STOP':
        return TrendingDown;
      case 'WAIT':
        return Clock;
      case 'NO TRADE':
        return Ban;
      default:
        return AlertCircle;
    }
  };

  const ActionIcon = getActionIcon();

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Trade Plan
        </h3>
        <Badge 
          variant="outline"
          className={isBullish ? 'text-fin-bull border-fin-bull/30' : 'text-fin-bear border-fin-bear/30'}
        >
          {isBullish ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {tradePlan.bias}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Entry Zone</span>
          <p className="font-mono font-medium text-fin-accent">{tradePlan.entry_zone}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Stop Loss</span>
          <p className="font-mono font-medium text-fin-bear">{tradePlan.stop_loss}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Target 1</span>
          <p className="font-mono font-medium text-fin-bull">{tradePlan.take_profit_1}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground uppercase tracking-wide">Target 2</span>
          <p className="font-mono font-medium text-fin-bull">{tradePlan.take_profit_2}</p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Action</span>
            <div className="flex items-center gap-2 mt-1">
              <ActionIcon className={`w-4 h-4 ${isBullish ? 'text-fin-bull' : 'text-fin-bear'}`} />
              <span className="font-medium">{actionPlan.action}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">At Price</span>
            <p className="font-mono font-bold text-lg">{actionPlan.price}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
