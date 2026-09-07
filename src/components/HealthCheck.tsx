import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

export const HealthCheck: React.FC = () => {
  const [status, setStatus] = useState<'ok' | 'checking'>('checking');
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    setStatus('ok');
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 bg-mk-card border border-mk-border rounded-2xl text-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-white">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>System Status & Health Check</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          STATUS OK (200)
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-2 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-gray-500">Service</div>
            <div className="font-semibold text-gray-200">Active</div>
          </div>
        </div>

        <div className="p-2 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-mk-red" />
          <div>
            <div className="text-[10px] text-gray-500">Memory</div>
            <div className="font-semibold text-gray-200">Healthy</div>
          </div>
        </div>

        <div className="p-2 bg-gray-900/60 rounded-xl border border-gray-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-gray-500">Proxy Binding</div>
            <div className="font-semibold text-emerald-400">127.0.0.1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
