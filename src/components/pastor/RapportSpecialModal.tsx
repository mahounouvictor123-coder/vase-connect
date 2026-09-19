import React, { useState } from 'react';
import {
  X,
  FileText,
  Share2,
  Copy,
  Check,
  Printer,
  Sparkles,
  Users,
  Heart,
  Crown,
  Home,
  Briefcase,
  Plus,
  Trash2,
} from 'lucide-react';
import { RapportSpecial, RapportSoumis, CulteResume } from '../../types';

interface RapportSpecialModalProps {
  rapports: RapportSoumis[];
  cultes: CulteResume[];
  onClose: () => void;
  onSaveSpecial: (special: RapportSpecial) => void;
}

export const RapportSpecialModal: React.FC<RapportSpecialModalProps> = ({
  rapports,
  cultes,
  onClose,
  onSaveSpecial,
}) => {
  // Calculer automatiquement les statistiques globales à partir des données
  const totalConversionsCultes = cultes.reduce(
    (acc, c) => acc + (c.statistiques.conversions || 0),
    0
  );
  const totalPresentsCultes = cultes.reduce(
    (acc, c) => acc + (c.statistiques.totalPresents || 0),
    0
  );

  const [titre, setTitre] = useState(
    "Rapport Spécial d'Impact Territorial & Moisson Pastorale"
  );
  const [periode, setPeriode] = useState('Bilan Consolidé de Septembre 2026');
  const [introduction, setIntroduction] = useState(
    'Ce rapport spécial consolidé dresse le bilan spirituel, apostolique et communautaire de l\'Église Vases d\'Honneur. Il met en lumière l\'engagement des 12 Tribus, la vitalité des Familles d\'Honneur et l\'efficacité des départements ministériels pour l\'avancement du Royaume.'
  );

  const [totalParticipants, setTotalParticipants] = useState(
    totalPresentsCultes > 0 ? totalPresentsCultes : 2450
  );
  const [nouvellesAmes, setNouvellesAmes] = useState(
    totalConversionsCultes > 0 ? totalConversionsCultes : 78
  );
  const [tribusActives, setTribusActives] = useState(12);
  const [famillesActives, setFamillesActives] = useState(8);
  const [departementsMobilises, setDepartementsMobilises] = useState(8);

  // Synthèses
  const [syntheses, setSyntheses] = useState([
    {
      sectionTitre: '1. Moisson des Cultes & Célébrations',
      contenu:
        'Forte affluence lors des cultes de célébration et des vigiles d\'impact. L\'onction du Saint-Esprit s\'est manifestée par de nombreuses délivrances et un engagement renouvelé pour la sanctification.',
      chiffreCle: `+${nouvellesAmes} Âmes gagnées`,
    },
    {
      sectionTitre: '2. Familles d\'Honneur dans les Quartiers',
      contenu:
        'Déploiement exemplaire des cellules de maison (Fidjrossè, Cadjèhoun, Akpakpa, Calavi, Menontin, Haie Vive). Les agapes fraternelles et l\'accueil chaleureux favorisent l\'intégration des nouvelles familles.',
      chiffreCle: `${famillesActives} Cellules Actives`,
    },
    {
      sectionTitre: '3. Mobilisation des 12 Tribus & Solidarité',
      contenu:
        'Toutes les 12 tribus ont renforcé leurs liens par des temps de jeûne, de louange et des visites aux malades. Le fonds de compassion a soutenu plusieurs étudiants et frères nécessiteux.',
      chiffreCle: '12 Tribus Fortifiées',
    },
    {
      sectionTitre: '4. Départements Ministériels & Ouvriers',
      contenu:
        'Excellence du Protocole, ferveur de la Chorale Vases d\'Honneur, amplification par le pôle Média et vigilance des Sentinelles d\'intercession.',
      chiffreCle: `${departementsMobilises} Pôles d'Excellence`,
    },
  ]);

  // Directives
  const [directive1, setDirective1] = useState(
    'Intensifier le discipolat et le suivi des nouveaux convertis dans chaque Famille d\'Honneur.'
  );
  const [directive2, setDirective2] = useState(
    'Tenir la grande veillée de louange et d\'impact des ouvriers le 1er vendredi du mois prochain.'
  );
  const [directive3, setDirective3] = useState(
    'Encourager la solidarité active et le soutien mutuel au sein de chaque tribu d\'appartenance.'
  );

  const [copied, setCopied] = useState(false);

  const generateFullText = () => {
    let text = `📜 *${titre.toUpperCase()}*\n`;
    text += `🗓️ *Période :* ${periode}\n`;
    text += `👑 *Église Vases d'Honneur • Bureau Pastoral*\n\n`;
    text += `📖 *MOT APOSTOLIQUE DU PASTEUR :*\n${introduction}\n\n`;

    text += `📊 *INDICATEURS CLÉS D'IMPACT :*\n`;
    text += `• Total Participants mobilisés : *${totalParticipants.toLocaleString()}*\n`;
    text += `• Nouvelles âmes données à Christ : *+${nouvellesAmes}*\n`;
    text += `• Tribus d'Israël actives : *${tribusActives}/12*\n`;
    text += `• Familles d'Honneur déployées : *${famillesActives} foyers*\n`;
    text += `• Départements mobilisés : *${departementsMobilises} pôles*\n\n`;

    text += `🔍 *SYNTHÈSES STRATÉGIQUES :*\n`;
    syntheses.forEach(s => {
      text += `\n📌 *${s.sectionTitre}* (${s.chiffreCle})\n${s.contenu}\n`;
    });

    text += `\n🎯 *DIRECTIVES PASTORALES POUR LE CORPS :*\n`;
    [directive1, directive2, directive3].filter(Boolean).forEach((d, i) => {
      text += `${i + 1}. ${d}\n`;
    });

    text += `\n🕊️ *BÉNÉDICTION :*\n"Que la grâce surabondante de notre Seigneur Jésus-Christ, l'amour de Dieu le Père et la communion du Saint-Esprit soient avec vous tous. Amen !"`;

    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFullText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generateFullText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const special: RapportSpecial = {
      id: 'spec-' + Date.now(),
      titre: titre.trim(),
      periode: periode.trim(),
      introduction: introduction.trim(),
      statistiquesGlobales: {
        totalParticipants: Number(totalParticipants),
        nouvellesAmes: Number(nouvellesAmes),
        tribusActives: Number(tribusActives),
        famillesActives: Number(famillesActives),
        departementsMobilises: Number(departementsMobilises),
      },
      syntheses,
      directivesPastorales: [directive1, directive2, directive3].filter(Boolean),
      dateGeneration: new Date().toISOString().split('T')[0],
      partageFormat: 'WHATSAPP',
    };
    onSaveSpecial(special);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
              <Sparkles className="w-5 h-5 text-[#E5B22F]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-[#E5B22F] tracking-wider">
                Générateur & Édition Pastorale
              </span>
              <h3 className="text-base font-black text-white">Générer le Rapport Spécial</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Imprimer le rapport spécial"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Copier le rapport complet"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Partager sur WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
          {/* Titre & Période */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Titre du Rapport Spécial</label>
              <input
                type="text"
                value={titre}
                onChange={e => setTitre(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-black text-slate-900"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Période Consolidée</label>
              <input
                type="text"
                value={periode}
                onChange={e => setPeriode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-semibold"
              />
            </div>
          </div>

          {/* Mot Apostolique */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Introduction & Mot Apostolique du Pasteur
            </label>
            <textarea
              rows={3}
              value={introduction}
              onChange={e => setIntroduction(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
            />
          </div>

          {/* Chiffres Globaux d'Impact */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
              <Users className="w-4 h-4 text-[#C59A27]" />
              <span>Chiffres Globaux d'Impact (Compilés des Cultes & Rapports)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-600 block">Participants</span>
                <input
                  type="number"
                  value={totalParticipants}
                  onChange={e => setTotalParticipants(Number(e.target.value))}
                  className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-black text-emerald-800 block">Nouvelles Âmes</span>
                <input
                  type="number"
                  value={nouvellesAmes}
                  onChange={e => setNouvellesAmes(Number(e.target.value))}
                  className="w-full font-black text-emerald-900 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-black text-[#C59A27] block">12 Tribus</span>
                <input
                  type="number"
                  value={tribusActives}
                  onChange={e => setTribusActives(Number(e.target.value))}
                  className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200">
                <span className="text-[10px] font-black text-teal-800 block">Familles d'Honneur</span>
                <input
                  type="number"
                  value={famillesActives}
                  onChange={e => setFamillesActives(Number(e.target.value))}
                  className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-black text-blue-800 block">Départements</span>
                <input
                  type="number"
                  value={departementsMobilises}
                  onChange={e => setDepartementsMobilises(Number(e.target.value))}
                  className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Synthèses des Branches */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
              <FileText className="w-4 h-4 text-[#C59A27]" />
              <span>Synthèses Thématiques Intégrées</span>
            </h4>

            <div className="space-y-3">
              {syntheses.map((s, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={s.sectionTitre}
                      onChange={e => {
                        const val = e.target.value;
                        setSyntheses(prev =>
                          prev.map((item, i) => (i === idx ? { ...item, sectionTitre: val } : item))
                        );
                      }}
                      className="font-black text-slate-900 bg-transparent text-xs flex-1 focus:outline-none border-b border-dashed border-slate-300 pb-0.5"
                    />
                    <input
                      type="text"
                      value={s.chiffreCle || ''}
                      onChange={e => {
                        const val = e.target.value;
                        setSyntheses(prev =>
                          prev.map((item, i) => (i === idx ? { ...item, chiffreCle: val } : item))
                        );
                      }}
                      placeholder="Chiffre clé"
                      className="px-2 py-0.5 rounded-md bg-[#0A3D36] text-[#E5B22F] font-black text-[10px] w-28 text-center"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={s.contenu}
                    onChange={e => {
                      const val = e.target.value;
                      setSyntheses(prev =>
                        prev.map((item, i) => (i === idx ? { ...item, contenu: val } : item))
                      );
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-[#0A3D36]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Directives Pastorales */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
              <Crown className="w-4 h-4 text-[#C59A27]" />
              <span>Directives Pastorales pour le Corps</span>
            </h4>
            <input
              type="text"
              value={directive1}
              onChange={e => setDirective1(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
            />
            <input
              type="text"
              value={directive2}
              onChange={e => setDirective2(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
            />
            <input
              type="text"
              value={directive3}
              onChange={e => setDirective3(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Fermer
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Diffuser / Partager</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md hover:scale-102 transition-all"
            >
              Enregistrer ce Rapport Spécial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
