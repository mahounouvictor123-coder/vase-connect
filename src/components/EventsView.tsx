import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, CheckCircle2, ArrowLeft } from 'lucide-react';
import { ChurchEvent } from '../types';

interface EventsViewProps {
  events: ChurchEvent[];
  onBackToHome?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({ events, onBackToHome }) => {
  const [registeredIds, setRegisteredIds] = useState<string[]>(['evt-1']);

  const toggleRegister = (id: string) => {
    setRegisteredIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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
            Agenda Spirituel & Entrepreneuriat
          </span>
        </div>
        <h1 className="text-2xl font-black text-[#0A3D36]">
          Événements & Rassemblements Vases d'Honneur
        </h1>
        <p className="text-xs text-slate-500 max-w-xl">
          Conventions, séminaires professionnels et cultes d'adoration de l'Assemblée Porte des Cieux.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {events.map((evt) => {
          const isRegistered = registeredIds.includes(evt.id);

          return (
            <div
              key={evt.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-100">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A3D36] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {evt.organizer}
                  </div>
                </div>

                <div className="p-4 space-y-2.5">
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-1 pt-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C59A27]" />
                      <span className="font-semibold text-slate-800">{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="line-clamp-1">{evt.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {evt.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-100 gap-2">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {evt.attendeesCount + (isRegistered ? 1 : 0)} inscrits
                </span>

                <button
                  onClick={() => toggleRegister(evt.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isRegistered
                      ? 'bg-emerald-100 text-emerald-800 flex items-center gap-1'
                      : 'bg-[#0A3D36] text-white hover:bg-[#0D473E]'
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Inscrit(e)</span>
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
