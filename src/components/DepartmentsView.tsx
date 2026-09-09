import React, { useState } from 'react';
import { Users, Flame, Shield, Heart, Music, Camera, Wrench, Compass, ChevronRight, Bell, Sparkles, ArrowLeft } from 'lucide-react';
import { DepartmentItem } from '../types';

interface DepartmentsViewProps {
  departments: DepartmentItem[];
  onOpenAssistantWithPrompt: (prompt: string) => void;
  onBackToHome?: () => void;
}

const ICONS_MAP: { [key: string]: React.ReactNode } = {
  Flame: <Flame className="w-5 h-5 text-amber-500" />,
  Shield: <Shield className="w-5 h-5 text-blue-500" />,
  Heart: <Heart className="w-5 h-5 text-rose-500" />,
  Music: <Music className="w-5 h-5 text-emerald-500" />,
  Camera: <Camera className="w-5 h-5 text-purple-500" />,
  Users: <Users className="w-5 h-5 text-teal-500" />,
  Wrench: <Wrench className="w-5 h-5 text-slate-500" />,
  Compass: <Compass className="w-5 h-5 text-orange-500" />,
};

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  departments,
  onOpenAssistantWithPrompt,
  onBackToHome,
}) => {
  const [selectedDept, setSelectedDept] = useState<DepartmentItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-[#0A3D36] hover:text-white text-[#0A3D36] text-xs font-bold transition-all border border-slate-200 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>← Retour Accueil</span>
            </button>
          )}
          <span className="text-xs font-bold text-[#C59A27] uppercase tracking-wider">
            Organisation de l'Église
          </span>
        </div>
        <h1 className="text-2xl font-black text-[#0A3D36]">
          Départements & Ministères Porte des Cieux
        </h1>
        <p className="text-xs text-slate-500 max-w-xl">
          Chaque département regroupe des fidèles engagés au service du Seigneur et de la société.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            onClick={() => setSelectedDept(dept)}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {ICONS_MAP[dept.iconName] || <Users className="w-5 h-5 text-[#0A3D36]" />}
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                  {dept.memberCount} membres
                </span>
              </div>

              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0A3D36] transition-colors mb-1">
                {dept.name}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                {dept.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#0A3D36] font-semibold">
              <span className="truncate">{dept.leaderName}</span>
              <ChevronRight className="w-4 h-4 text-[#C59A27] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedDept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 text-slate-800 space-y-4">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-[#0A3D36]">{selectedDept.name}</h3>
                <p className="text-xs text-slate-500">{selectedDept.leaderTitle} : {selectedDept.leaderName}</p>
              </div>
              <button
                onClick={() => setSelectedDept(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded-lg"
              >
                Fermer
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-[#F8FAF9] p-3 rounded-2xl border border-slate-100">
              {selectedDept.description}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Activités principales</h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {selectedDept.activities.map((act, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C59A27]" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Annonces récentes</h4>
              <div className="space-y-1.5">
                {selectedDept.announcements.map((ann, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Bell className="w-3.5 h-3.5 text-[#C59A27] shrink-0 mt-0.5" />
                    <span>{ann}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  const dept = selectedDept.name;
                  setSelectedDept(null);
                  onOpenAssistantWithPrompt(`Quels sont les membres et talents dans le département ${dept} ?`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0A3D36] text-white rounded-xl text-xs font-bold shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
                <span>Voir les membres du département via l'IA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
