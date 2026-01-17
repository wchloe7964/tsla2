'use client';

import React, { useEffect, useState } from 'react';
import { Monitor, Smartphone, Globe, XCircle, ShieldCheck, MapPin } from 'lucide-react'; // Added MapPin
import { formatDistanceToNow } from 'date-fns';

interface Session {
  id: string;
  device: string;
  ip: string;
  location: string; // Added field
  lastActive: string;
  isCurrent: boolean;
}

export default function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/auth/sessions');
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    if (!confirm('Log out this device?')) return;
    
    try {
      const res = await fetch(`/api/auth/sessions/revoke`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        setSessions(sessions.filter((s) => s.id !== sessionId));
      }
    } catch (err) {
      alert('Failed to revoke session');
    }
  };

  if (loading) return <div className="animate-pulse h-40 bg-zinc-900/50 rounded-xl" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <ShieldCheck className="text-emerald-500 w-5 h-5" />
        <h3 className="text-lg font-medium">Active Device Sessions</h3>
      </div>

      <div className="grid gap-3">
        {sessions.map((session) => (
          <div 
            key={session.id}
            className={`flex items-center justify-between p-4 rounded-xl border ${
              session.isCurrent ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-zinc-900/50 border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-zinc-800 rounded-lg">
                {session.device.toLowerCase().includes('iphone') || session.device.toLowerCase().includes('android') 
                  ? <Smartphone className="w-5 h-5 text-zinc-400" />
                  : <Monitor className="w-5 h-5 text-zinc-400" />
                }
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{session.device}</p>
                  {session.isCurrent && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 mt-1">
                  <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {session.ip}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-400">
                    <MapPin className="w-3 h-3 text-emerald-500/70" /> {session.location}
                  </span>
                  <span>•</span>
                  <span>Active {formatDistanceToNow(new Date(session.lastActive))} ago</span>
                </div>
              </div>
            </div>

            {!session.isCurrent && (
              <button
                onClick={() => revokeSession(session.id)}
                className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-500 rounded-lg transition-colors"
                title="Revoke Access"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}