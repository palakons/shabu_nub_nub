import React, { useState } from 'react';
import { X, Calendar, Flame, Utensils, Award, Cloud, HardDrive, Trash2, ArrowUpRight, ChevronDown, ChevronUp, History } from 'lucide-react';
import { SavedDiningSession } from '../types';

interface SavedSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SavedDiningSession[];
  onLoadSession: (session: SavedDiningSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onRefresh: () => void;
}

export const SavedSessionsModal: React.FC<SavedSessionsModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onLoadSession,
  onDeleteSession,
  onRefresh,
}) => {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate cumulative stats across all recorded sessions
  const totalMealCount = sessions.length;
  const totalCaloriesSum = sessions.reduce((acc, s) => acc + (s.totalCalories || 0), 0);
  const totalProteinSum = sessions.reduce((acc, s) => acc + (s.proteinG || 0), 0);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141417] border border-mk-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900/80 via-mk-card to-[#1a1a24] text-white flex items-center justify-between border-b border-mk-border shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                ประวัติมื้ออาหารที่บันทึกไว้
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  {totalMealCount} มื้อ
                </span>
              </h2>
              <p className="text-xs text-gray-400">Meal History & Macro Record Logs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cumulative Stats Summary Bar */}
        {totalMealCount > 0 && (
          <div className="p-3 bg-mk-card/60 border-b border-mk-border/60 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-gray-900/60 border border-gray-800">
              <div className="text-[10px] text-gray-400">มื้อสะสม</div>
              <div className="font-bold text-white">{totalMealCount} มื้อ</div>
            </div>
            <div className="p-2 rounded-xl bg-red-950/30 border border-red-900/30">
              <div className="text-[10px] text-gray-400">แคลอรีรวมสะสม</div>
              <div className="font-bold text-amber-400">{totalCaloriesSum.toLocaleString()} kcal</div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-900/30">
              <div className="text-[10px] text-gray-400">โปรตีนรวมสะสม</div>
              <div className="font-bold text-emerald-400">{totalProteinSum.toFixed(1)}g</div>
            </div>
          </div>
        )}

        {/* Modal Body / Sessions List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {sessions.length === 0 ? (
            <div className="text-center py-14 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-mk-card border border-mk-border flex items-center justify-center mx-auto text-2xl">
                🍲
              </div>
              <h3 className="text-sm font-bold text-gray-300">ยังไม่มีประวัติมื้ออาหารที่บันทึกไว้</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                เมื่อกด "บันทึกมื้อนี้เข้าโปรไฟล์" ในหน้าสรุปใบเสร็จมื้ออาหาร รายการมื้อจะถูกจัดเก็บแสดงที่นี่
              </p>
            </div>
          ) : (
            sessions.map(session => {
              const isExpanded = expandedSessionId === session.id;
              return (
                <div
                  key={session.id}
                  className="bg-mk-card rounded-2xl border border-mk-border/80 overflow-hidden transition-all hover:border-gray-700"
                >
                  {/* Session Card Header */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>{formatDate(session.sessionDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.savedOnServer ? (
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                            <Cloud className="w-3 h-3 text-emerald-400" />
                            Cloud Sync
                          </span>
                        ) : (
                          <span className="text-[10px] bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-gray-400" />
                            Local
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
                      <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800">
                        <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                          <Utensils className="w-3 h-3 text-amber-400" />
                          ถาด
                        </div>
                        <div className="font-bold text-amber-400">{session.totalTrays}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800">
                        <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                          <Flame className="w-3 h-3 text-red-400" />
                          kcal
                        </div>
                        <div className="font-bold text-red-400">{session.totalCalories?.toLocaleString()}</div>
                      </div>
                      <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800">
                        <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                          <Award className="w-3 h-3 text-emerald-400" />
                          โปรตีน
                        </div>
                        <div className="font-bold text-emerald-400">{session.proteinG}g</div>
                      </div>
                      <div className="p-2 rounded-xl bg-gray-900/80 border border-gray-800">
                        <div className="text-[10px] text-gray-400">ราคา</div>
                        <div className="font-bold text-gray-200">{session.costThb || 299}฿</div>
                      </div>
                    </div>

                    {/* Expand Toggle & Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-800/60 text-xs">
                      <button
                        onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                        className="text-gray-400 hover:text-gray-200 text-[11px] font-semibold flex items-center gap-1"
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>{isExpanded ? 'ซ่อนรายละเอียดถาด' : `ดูรายการอาหาร (${session.itemsJson?.length || 0} รายการ)`}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onLoadSession(session);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold flex items-center gap-1 transition-all active-press"
                          title="โหลดรายการมื้อนี้ลงโต๊ะสั่งอาหาร"
                        >
                          <ArrowUpRight className="w-3 h-3 text-blue-400" />
                          <span>ลงโต๊ะ</span>
                        </button>

                        <button
                          onClick={() => onDeleteSession(session.id)}
                          className="p-1 text-gray-500 hover:text-red-400 rounded-lg transition-colors"
                          title="ลบประวัติมื้อนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Items Details */}
                    {isExpanded && session.itemsJson && session.itemsJson.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-800 space-y-1 animate-fade-in">
                        {session.itemsJson.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] text-gray-300 px-1 py-0.5">
                            <span>• {item.name_th}</span>
                            <span className="font-semibold text-amber-400">
                              {item.count} ถาด ({item.calories} kcal)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
