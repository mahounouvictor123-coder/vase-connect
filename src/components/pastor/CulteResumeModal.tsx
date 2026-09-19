import React, { useState } from 'react';
import { X, BookOpen, Calendar, Users, Sparkles, CheckCircle2, Heart, MessageSquare } from 'lucide-react';
import { CulteResume, UserProfile } from '../../types';

interface CulteResumeModalProps {
  currentUser: UserProfile | null;
  onClose: () => void;
  onSubmit: (resume: CulteResume) => void;
}

export const CulteResumeModal: React.FC<CulteResumeModalProps> = ({
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [typeCulte, setTypeCulte] = useState('Culte de Célébration Dominical');
  const [theme, setTheme] = useState('');
  const [orateur, setOrateur] = useState('Pasteur Mohammed Sanogo');
  const [passageBiblique, setPassageBiblique] = useState('');

  // Points clés
  const [point1, setPoint1] = useState('');
  const [point2, setPoint2] = useState('');
  const [point3, setPoint3] = useState('');

  // Statistiques
  const [totalPresents, setTotalPresents] = useState(1200);
  const [hommes, setHommes] = useState(450);
  const [femmes, setFemmes] = useState(600);
  const [enfants, setEnfants] = useState(150);
  const [nouveauxVenus, setNouveauxVenus] = useState(45);
  const [conversions, setConversions] = useState(25);
  const [baptemesOuRecons, setBaptemesOuRecons] = useState(12);

  // Témoignages & Notes
  const [temoignages, setTemoignages] = useState('');
  const [notesPastorales, setNotesPastorales] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme.trim() || !orateur.trim()) return;

    const points = [point1, point2, point3]
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const temoignagesList = temoignages
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newResume: CulteResume = {
      id: 'culte-' + Date.now(),
      date,
      typeCulte,
      theme: theme.trim(),
      orateur: orateur.trim(),
      passageBiblique: passageBiblique.trim() || 'Éphésiens 4:1-16',
      pointsCles: points.length > 0 ? points : [theme.trim()],
      statistiques: {
        totalPresents: Number(totalPresents) || 0,
        hommes: Number(hommes) || 0,
        femmes: Number(femmes) || 0,
        enfants: Number(enfants) || 0,
        nouveauxVenus: Number(nouveauxVenus) || 0,
        conversions: Number(conversions) || 0,
        baptemesOuRecons: Number(baptemesOuRecons) || 0,
      },
      temoignagesMarquants:
        temoignagesList.length > 0
          ? temoignagesList
          : ['Gloire à Dieu pour sa présence tangible et la manifestation de sa puissance.'],
      notesPastorales: notesPastorales.trim(),
      createdAt: new Date().toISOString(),
      authorId: currentUser?.id || 'pasteur-current',
      authorName: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Pasteur',
    };

    onSubmit(newResume);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
              <BookOpen className="w-5 h-5 text-[#E5B22F]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-[#E5B22F] tracking-wider">
                Espace Pastoral • Archives & Édification
              </span>
              <h3 className="text-base font-black text-white">Nouveau Résumé du Culte</h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900">Résumé du Culte Enregistré !</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Le compte-rendu spirituel et les statistiques de la réunion sont archivés et prêts à être partagés avec le corps pastoral.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
            {/* Informations Générales */}
            <div className="space-y-3">
              <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                <Calendar className="w-4 h-4 text-[#C59A27]" />
                <span>1. Cadre du Culte</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date du Culte *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-semibold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Type de Culte *</label>
                  <select
                    value={typeCulte}
                    onChange={e => setTypeCulte(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-semibold"
                  >
                    <option value="Culte de Célébration Dominical">Culte de Célébration Dominical</option>
                    <option value="Culte d'Enseignement & Prière du Mercredi">Culte d'Enseignement & Prière du Mercredi</option>
                    <option value="Veillée de Prière & Impact Territoriale">Veillée de Prière & Impact Territoriale</option>
                    <option value="Culte Spécial d'Onction & Sainte Cène">Culte Spécial d'Onction & Sainte Cène</option>
                    <option value="Séminaire Apostolique / Conférence">Séminaire Apostolique / Conférence</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Orateur / Prédicateur *</label>
                  <input
                    type="text"
                    value={orateur}
                    onChange={e => setOrateur(e.target.value)}
                    placeholder="Ex: Pasteur Mohammed Sanogo"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Passage(s) Biblique(s) *</label>
                  <input
                    type="text"
                    value={passageBiblique}
                    onChange={e => setPassageBiblique(e.target.value)}
                    placeholder="Ex: Ésaïe 60:1-3, Romains 8:28"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thème du Message *</label>
                <input
                  type="text"
                  value={theme}
                  onChange={e => setTheme(e.target.value)}
                  placeholder="Ex: Marcher dans la Puissance de la Résurrection"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Points Clés du Message */}
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-4 h-4 text-[#C59A27]" />
                <span>2. Vérités & Points Clés du Message</span>
              </h4>
              <input
                type="text"
                value={point1}
                onChange={e => setPoint1(e.target.value)}
                placeholder="Point clé 1 (ex: La lumière de Dieu n'est pas un secret mais une manifestation pour les nations)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
              />
              <input
                type="text"
                value={point2}
                onChange={e => setPoint2(e.target.value)}
                placeholder="Point clé 2 (ex: L'Église locale est une armée de vases d'honneur pour la cité)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
              />
              <input
                type="text"
                value={point3}
                onChange={e => setPoint3(e.target.value)}
                placeholder="Point clé 3 (Optionnel)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
              />
            </div>

            {/* Statistiques et Moisson Spirituelle */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                <Users className="w-4 h-4 text-[#C59A27]" />
                <span>3. Effectifs & Moisson Spirituelle</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-600 block">Total Présents</label>
                  <input
                    type="number"
                    value={totalPresents}
                    onChange={e => setTotalPresents(Number(e.target.value))}
                    className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-600 block">Hommes</label>
                  <input
                    type="number"
                    value={hommes}
                    onChange={e => setHommes(Number(e.target.value))}
                    className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-600 block">Femmes</label>
                  <input
                    type="number"
                    value={femmes}
                    onChange={e => setFemmes(Number(e.target.value))}
                    className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <label className="text-[10px] font-bold text-slate-600 block">Enfants</label>
                  <input
                    type="number"
                    value={enfants}
                    onChange={e => setEnfants(Number(e.target.value))}
                    className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200">
                  <label className="text-[10px] font-black text-[#C59A27] block">Nouveaux Venus</label>
                  <input
                    type="number"
                    value={nouveauxVenus}
                    onChange={e => setNouveauxVenus(Number(e.target.value))}
                    className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <label className="text-[10px] font-black text-emerald-700 block">Décisions / Âmes à Christ</label>
                  <input
                    type="number"
                    value={conversions}
                    onChange={e => setConversions(Number(e.target.value))}
                    className="w-full font-black text-emerald-900 bg-transparent text-sm focus:outline-none"
                  />
                </div>
                <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200">
                  <label className="text-[10px] font-black text-blue-700 block">Baptêmes / Réconciliations</label>
                  <input
                    type="number"
                    value={baptemesOuRecons}
                    onChange={e => setBaptemesOuRecons(Number(e.target.value))}
                    className="w-full font-black text-blue-900 bg-transparent text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Témoignages & Directives */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                <Heart className="w-4 h-4 text-[#C59A27]" />
                <span>4. Témoignages Marquants & Notes Pastorales</span>
              </h4>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Témoignages & Guérisons (1 par ligne)
                </label>
                <textarea
                  rows={2}
                  value={temoignages}
                  onChange={e => setTemoignages(e.target.value)}
                  placeholder="Ex: Guérison d'une douleur dorsale de 5 ans durant la louange..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Notes & Directives Pastorales pour les Équipes
                </label>
                <textarea
                  rows={2}
                  value={notesPastorales}
                  onChange={e => setNotesPastorales(e.target.value)}
                  placeholder="Ex: Prier pour le suivi des âmes dans les Familles d'Honneur, relancer la répétition chorale..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md hover:scale-102 active:scale-95 transition-all"
              >
                Enregistrer le Résumé du Culte
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
