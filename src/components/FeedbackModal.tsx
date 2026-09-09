import React, { useState } from 'react';
import { X, MessageSquare, Star, Send, CheckCircle2, Lightbulb, Bug, Utensils, HelpCircle } from 'lucide-react';
import { trackEvent, getAnonSessionId, getAuthBaseUrl } from '../utils/telemetry';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  authServerUrl?: string;
  authUserEmail?: string;
}

export type FeedbackCategory = 'feature_request' | 'bug_report' | 'macro_accuracy' | 'general';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  authServerUrl,
  authUserEmail,
}) => {
  const targetAuthUrl = authServerUrl || getAuthBaseUrl();
  const [category, setCategory] = useState<FeedbackCategory>('feature_request');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>(authUserEmail || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMessage('กรุณากรอกข้อความเสนอแนะหรือปัญหา');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const anonSessionId = localStorage.getItem('shabu_anon_id') || getAnonSessionId() || 'anon';
    const token = localStorage.getItem('mk_buffet_auth_token');

    const payload = {
      category,
      rating,
      message: message.trim(),
      contactInfo: contactInfo.trim(),
      anonSessionId,
    };

    try {
      const res = await fetch(`${targetAuthUrl}/api/shabu/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        setIsSubmitted(true);
        trackEvent('feedback_submit', { category, rating, hasContact: Boolean(contactInfo) });
      } else {
        // Fallback telemetry fire-and-forget save
        trackEvent('feedback_submit_fallback', payload);
        setIsSubmitted(true);
      }
    } catch (err) {
      // Offline / fallback save via telemetry
      trackEvent('feedback_submit_fallback', payload);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setMessage('');
    setErrorMessage(null);
    onClose();
  };

  const categories: Array<{ id: FeedbackCategory; label: string; icon: React.ReactNode }> = [
    { id: 'feature_request', label: 'เสนอแนะฟีเจอร์ใหม่', icon: <Lightbulb className="w-4 h-4 text-amber-400" /> },
    { id: 'bug_report', label: 'แจ้งปัญหาการใช้งาน', icon: <Bug className="w-4 h-4 text-rose-400" /> },
    { id: 'macro_accuracy', label: 'แก้ไขข้อมูลสารอาหาร/เมนู', icon: <Utensils className="w-4 h-4 text-emerald-400" /> },
    { id: 'general', label: 'ติชมทั่วไป', icon: <HelpCircle className="w-4 h-4 text-blue-400" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#141417] border border-mk-border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-blue-900/80 via-mk-card to-[#1a1a24] text-white flex items-center justify-between border-b border-mk-border shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">ส่งข้อเสนอแนะ / แจ้งปัญหา</h2>
              <p className="text-xs text-gray-400">Feedback & Feature Request Box</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">ขอบคุณสำหรับข้อเสนอแนะ! 🙏</h3>
              <p className="text-xs text-gray-400 max-w-xs mx-auto leading-relaxed">
                ทีมงานได้รับข้อความของคุณเรียบร้อยแล้ว ทุกความคิดเห็นมีค่าและจะนำไปปรับปรุงระบบให้ดียิ่งขึ้นครับ
              </p>
              <button
                onClick={handleResetAndClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all active-press"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-2">หัวข้อข้อเสนอแนะ</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all text-left ${
                        category === cat.id
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-glow-blue'
                          : 'bg-mk-card border-mk-border/80 text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {cat.icon}
                      <span className="text-[11px]">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Stars */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">ให้คะแนนความพึงพอใจโดยรวม</label>
                <div className="flex items-center gap-2 bg-mk-card p-2.5 rounded-xl border border-mk-border/80 justify-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-amber-300 font-bold ml-2">{rating} / 5</span>
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  รายละเอียดข้อเสนอแนะ / แจ้งปัญหา <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="เขียนข้อเสนอแนะ ฟีเจอร์ที่อยากได้ หรือรายงานบั๊กที่พบ..."
                  className="w-full p-3 rounded-xl bg-mk-card border border-mk-border/80 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  required
                />
              </div>

              {/* Contact Info (Optional) */}
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1.5">
                  อีเมล / LINE ID (ระบุหรือไม่ระบูก็ได้)
                </label>
                <input
                  type="text"
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  placeholder="เช่น user@example.com หรือ @line_id"
                  className="w-full p-2.5 rounded-xl bg-mk-card border border-mk-border/80 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs text-center font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs border border-gray-700 transition-colors"
                >
                  ยกเลิก
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !message.trim()}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:brightness-110 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 active-press disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งข้อเสนอแนะ'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
