import { Users, TrendingUp, DollarSign, Activity, Magnet, Zap, PieChart, Layers, ArrowUpRight, ShieldCheck, MoreHorizontal } from 'lucide-react';
import Header from '@/components/Header';

const KPICard: React.FC<{ 
  title: string; 
  value: string; 
  change: string; 
  icon: React.ReactNode; 
  isPositive?: boolean; 
  subtext?: string;
}> = ({ title, value, change, icon, isPositive = true, subtext }) => (
  <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-fin-accent/50 transition-colors">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
       {icon}
    </div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-3 bg-muted rounded-lg border border-border text-muted-foreground group-hover:text-fin-accent group-hover:border-fin-accent/30 transition-colors">
        {icon}
      </div>
      <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${isPositive ? 'bg-fin-bull/20 text-fin-bull' : 'bg-fin-bear/20 text-fin-bear'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
        {change}
      </div>
    </div>
    <div className="relative z-10">
      <div className="text-muted-foreground text-xs uppercase tracking-widest mb-1 font-bold">{title}</div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      {subtext && <div className="text-xs text-muted-foreground">{subtext}</div>}
    </div>
  </div>
);

const CohortCell: React.FC<{ pct: number }> = ({ pct }) => {
  let bg = "bg-card";
  let text = "text-muted-foreground";
  
  if (pct >= 80) { bg = "bg-fin-bull/90"; text = "text-black font-bold"; }
  else if (pct >= 60) { bg = "bg-fin-bull/60"; text = "text-white"; }
  else if (pct >= 40) { bg = "bg-fin-bull/30"; text = "text-foreground"; }
  else if (pct >= 20) { bg = "bg-fin-bull/10"; text = "text-muted-foreground"; }
  else if (pct > 0) { bg = "bg-card"; text = "text-muted-foreground"; }

  return (
    <div className={`h-10 w-full ${bg} flex items-center justify-center text-xs rounded border border-black/20 ${text}`}>
      {pct > 0 ? `${pct}%` : '-'}
    </div>
  );
};

export default function AdminDashboard() {
  const recentUsers = [
    { id: 1, email: 'trader.joe@gmail.com', plan: 'PRO', status: 'Active', generated: 142, lastActive: '2m ago' },
    { id: 2, email: 'sarah.quant@fund.com', plan: 'INSTITUTIONAL', status: 'Active', generated: 890, lastActive: '1h ago' },
    { id: 3, email: 'newbie_dave@yahoo.com', plan: 'FREE', status: 'Churned', generated: 3, lastActive: '14d ago' },
    { id: 4, email: 'crypto_king@eth.io', plan: 'PRO', status: 'Active', generated: 56, lastActive: '5h ago' },
    { id: 5, email: 'macro_mike@outlook.com', plan: 'PRO', status: 'Active', generated: 210, lastActive: '1d ago' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-fin-accent" />
              Executive Command
            </h1>
            <p className="text-muted-foreground mt-1">Shareholder KPI Monitoring & System Health</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-fin-bull/10 text-fin-bull text-xs font-bold rounded-full border border-fin-bull/20 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-fin-bull"></span>
              Systems Nominal
            </span>
            <button className="px-4 py-2 bg-card border border-border hover:bg-muted text-foreground text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
              <Layers className="w-4 h-4" /> Export Q3 Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard 
            title="MRR (Revenue)" 
            value="$42,850" 
            change="12.4%" 
            icon={<DollarSign className="w-6 h-6" />} 
            subtext="Proj. $55k next mo."
          />
          <KPICard 
            title="App Stickiness" 
            value="28.4%" 
            change="4.2%" 
            icon={<Magnet className="w-6 h-6 text-pink-500" />} 
            subtext="DAU / MAU Ratio"
          />
          <KPICard 
            title="Total Usage" 
            value="84,392" 
            change="24.1%" 
            icon={<Activity className="w-6 h-6 text-blue-500" />} 
            subtext="Analyses Run"
          />
          <KPICard 
            title="Churn Rate" 
            value="3.2%" 
            change="-0.5%" 
            isPositive={true} 
            icon={<Users className="w-6 h-6 text-orange-500" />} 
            subtext="vs 3.7% last mo."
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2 bg-muted border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
               <div>
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Magnet className="w-5 h-5 text-pink-500" />
                    Cohort Retention Analysis
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Percentage of users returning after sign-up week.</p>
               </div>
               <div className="flex gap-2">
                  <span className="text-xs font-bold bg-fin-accent/10 text-fin-accent px-2 py-1 rounded">Weekly</span>
               </div>
            </div>
            
            <div className="overflow-x-auto">
               <div className="min-w-[500px]">
                  <div className="grid grid-cols-6 gap-2 mb-2 text-xs text-muted-foreground font-bold uppercase tracking-wider text-center">
                     <div className="text-left pl-2">Cohort</div>
                     <div>Week 0</div>
                     <div>Week 1</div>
                     <div>Week 2</div>
                     <div>Week 3</div>
                     <div>Week 4</div>
                  </div>
                  <div className="space-y-2">
                     <div className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-xs text-muted-foreground font-mono">Sep 01 - 07</div>
                        <CohortCell pct={100} /><CohortCell pct={65} /><CohortCell pct={58} /><CohortCell pct={52} /><CohortCell pct={48} />
                     </div>
                     <div className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-xs text-muted-foreground font-mono">Sep 08 - 14</div>
                        <CohortCell pct={100} /><CohortCell pct={62} /><CohortCell pct={55} /><CohortCell pct={50} /><CohortCell pct={0} />
                     </div>
                     <div className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-xs text-muted-foreground font-mono">Sep 15 - 21</div>
                        <CohortCell pct={100} /><CohortCell pct={68} /><CohortCell pct={61} /><CohortCell pct={0} /><CohortCell pct={0} />
                     </div>
                     <div className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-xs text-muted-foreground font-mono">Sep 22 - 28</div>
                        <CohortCell pct={100} /><CohortCell pct={71} /><CohortCell pct={0} /><CohortCell pct={0} /><CohortCell pct={0} />
                     </div>
                     <div className="grid grid-cols-6 gap-2 items-center">
                        <div className="text-xs text-muted-foreground font-mono">Sep 29 - Oct 5</div>
                        <CohortCell pct={100} /><CohortCell pct={0} /><CohortCell pct={0} /><CohortCell pct={0} /><CohortCell pct={0} />
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-muted border border-border rounded-2xl p-6 flex flex-col">
            <h3 className="font-bold text-foreground flex items-center gap-2 mb-6">
              <PieChart className="w-5 h-5 text-muted-foreground" />
              Feature Adoption
            </h3>
            
            <div className="flex-1 flex flex-col justify-center space-y-6">
               <div className="relative pt-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2 gap-2">
                     <span>Smart Money Concepts</span>
                     <span className="text-fin-accent">45% Usage</span>
                  </div>
                  <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                     <div className="bg-fin-accent h-full w-[45%]"></div>
                  </div>
               </div>

               <div className="relative pt-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2 gap-2">
                     <span>VCP (Swing)</span>
                     <span className="text-purple-500">25% Usage</span>
                  </div>
                  <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                     <div className="bg-purple-500 h-full w-[25%]"></div>
                  </div>
               </div>

               <div className="relative pt-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2 gap-2">
                     <span>Liquidity Flow</span>
                     <span className="text-fin-bull">15% Usage</span>
                  </div>
                  <div className="w-full bg-background h-2 rounded-full overflow-hidden">
                     <div className="bg-fin-bull h-full w-[15%]"></div>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-4 bg-background rounded-lg border border-border">
               <div className="flex items-center gap-2 text-xs text-fin-accent font-bold uppercase mb-2">
                  <Zap className="w-3 h-3" />
                  Key Insight
               </div>
               <p className="text-sm text-muted-foreground leading-relaxed">
                 Users who try <span className="text-foreground font-bold">SMC</span> in their first session have a <span className="text-fin-bull font-bold">40% higher retention rate</span> than other strategies.
               </p>
            </div>
          </div>
        </div>

        <div className="bg-muted border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center flex-wrap gap-4">
             <h3 className="font-bold text-foreground">Live User Sessions</h3>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fin-bull animate-pulse"></span>
                <span className="text-xs text-muted-foreground">5 Users Online</span>
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-card text-muted-foreground uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Subscription</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Lifetime Scans</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-muted-foreground">
                {recentUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-card/50 transition-colors">
                    <td className="px-6 py-4 font-bold">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs text-foreground">{u.email[0].toUpperCase()}</div>
                         <span className="text-foreground">{u.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                        u.plan === 'INSTITUTIONAL' ? 'bg-fin-accent/10 text-fin-accent border-fin-accent/30' :
                        u.plan === 'PRO' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                        'bg-muted text-muted-foreground border-border'
                      }`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">{u.lastActive}</td>
                    <td className="px-6 py-4 text-right font-mono">{u.generated.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-card rounded" data-testid={`button-user-action-${u.id}`}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
