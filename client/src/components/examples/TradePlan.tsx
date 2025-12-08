import TradePlan from '../TradePlan';

export default function TradePlanExample() {
  // todo: remove mock functionality
  const mockTradePlan = {
    bias: 'BULLISH',
    entry_zone: '$185.50 - $186.20',
    stop_loss: '$182.00',
    take_profit_1: '$195.00',
    take_profit_2: '$210.00',
  };

  const mockActionPlan = {
    action: 'BUY STOP' as const,
    price: '$186.50',
    stop_loss: '$182.00',
    target: '$195.00',
  };

  return (
    <div className="p-4 bg-background max-w-md">
      <TradePlan tradePlan={mockTradePlan} actionPlan={mockActionPlan} />
    </div>
  );
}
