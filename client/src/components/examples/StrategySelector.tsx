import { useState } from 'react';
import { StrategyType } from '@/lib/types';
import StrategySelector from '../StrategySelector';

export default function StrategySelectorExample() {
  const [selected, setSelected] = useState<StrategyType>(StrategyType.SMC);
  
  return (
    <div className="p-4 bg-background">
      <StrategySelector
        selected={selected}
        onSelect={(s) => {
          setSelected(s);
          console.log('Selected strategy:', s);
        }}
      />
    </div>
  );
}
