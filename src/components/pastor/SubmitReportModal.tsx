import React, { useState } from 'react';
import {
  X,
  Send,
  FileText,
  User,
  Phone,
  Calendar,
  Camera,
  CheckCircle2,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { RapportTemplate, RapportSoumis, UserProfile } from '../../types';

interface SubmitReportModalProps {
  template: RapportTemplate;
  currentUser: UserProfile | null;
  onClose: () => void;
  onSubmit: (rapport: RapportSoumis) => void;
}

export const SubmitReportModal: React.FC<SubmitReportModalProps> = ({
  template,
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [auteurNom, setAuteurNom] = useState(
    currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : ''
  );
  const [auteurRole, setAuteurRole] = useState(
    template.categorie === 'TRIBU'
      ? 'Patriarche de Tribu'
      : template.categorie === 'FAMILLE_HONNEUR'
      ? 'Berger'
      : template.categorie === 'DEPARTEMENT'
      ? 'Responsable de Département'
      : 'Membre Déclarant'
  );
  const [auteurTelephone, setAuteurTelephone] = useState(
    currentUser?.phone || '+229 97 00 00 00'
  );
  const [entiteConcernee, setEntiteConcernee] = useState(
    template.categorie === 'TRIBU'
      ? 'Tribu de Juda'
      : template.categorie === 'FAMILLE_HONNEUR'
      ? 'Famille Grâce & Vie (Fidjrossè)'
      : template.categorie === 'DEPARTEMENT'
      ? 'Protocole & Accueil Royal'
      : template.titre
  );
  const [periode, setPeriode] = useState(
    `Semaine du ${new Date().toLocaleDateString('fr-FR')}`
  );
  const [urgente, setUrgente] = useState(false);

  // Dynamic values based on template fields
  const [valeurs, setValeurs] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    template.champs.forEach(champ => {
      if (champ.type === 'number') initial[champ.id] = 0;
      else if (champ.type === 'boolean') initial[champ.id] = false;
      else if (champ.type === 'select' && champ.options && champ.options[0]) {
        initial[champ.id] = champ.options[0];
      } else initial[champ.id] = '';
    });
    return initial;
  });

  const [submitted, setSubmitted] = useState(false);

  const handleValueChange = (champId: string, val: any) => {
    setValeurs(prev => ({
      ...prev,
      [champId]: val,
    }));
  };

  const handleFileUpload = (
    champId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleValueChange(champId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auteurNom.trim() || !entiteConcernee.trim()) return;

    // Collect photos
    const photos: string[] = [];
    template.champs.forEach(champ => {
      if (champ.type === 'photo' && valeurs[champ.id]) {
        photos.push(valeurs[champ.id]);
      }
    });

    const newRapport: RapportSoumis = {
      id: 'rap-' + Date.now(),
      templateId: template.id,
      templateTitre: template.titre,
      categorie: template.categorie,
      entiteConcernee: entiteConcernee.trim(),
      auteurId: currentUser?.id || 'member-' + Date.now(),
      auteurNom: auteurNom.trim(),
      auteurRole: auteurRole.trim(),
      auteurTelephone: auteurTelephone.trim(),
      auteurPhotoUrl:
        currentUser?.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      dateRapport: new Date().toISOString().split('T')[0],
      periode: periode.trim(),
      valeurs,
      statut: 'NOUVEAU',
      photos: photos.length > 0 ? photos : undefined,
      urgente,
      createdAt: new Date().toISOString(),
    };

    onSubmit(newRapport);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/50 flex items-center justify-center text-[#E5B22F]">
              <Send className="w-5 h-5 text-[#E5B22F]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-[#E5B22F] tracking-wider">
                Soumission de Rapport vers la Boîte Pastorale
              </span>
              <h3 className="text-base font-black text-white">{template.titre}</h3>
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
            <h4 className="text-xl font-black text-slate-900">Rapport Transmis au Pasteur !</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Votre compte-rendu est désormais directement déposé dans la boîte de réception pastorale. Le Pasteur et son conseil pourront le consulter et vous répondre.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800 text-xs">
            {/* Déclarant & Entité */}
            <div className="space-y-3">
              <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                <User className="w-4 h-4 text-[#C59A27]" />
                <span>1. Informations du Déclarant</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nom & Prénom *</label>
                  <input
                    type="text"
                    value={auteurNom}
                    onChange={e => setAuteurNom(e.target.value)}
                    required
                    placeholder="Votre nom complet"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rôle / Titre *</label>
                  <input
                    type="text"
                    value={auteurRole}
                    onChange={e => setAuteurRole(e.target.value)}
                    required
                    placeholder="Ex: Patriarche, Berger, Responsable..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    value={auteurTelephone}
                    onChange={e => setAuteurTelephone(e.target.value)}
                    required
                    placeholder="+229 97 00 00 00"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Entité ou Cellule concernée *
                  </label>
                  <input
                    type="text"
                    value={entiteConcernee}
                    onChange={e => setEntiteConcernee(e.target.value)}
                    required
                    placeholder="Ex: Tribu de Ruben, Cellule Fidjrossè..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Période ou Date du Rapport *
                  </label>
                  <input
                    type="text"
                    value={periode}
                    onChange={e => setPeriode(e.target.value)}
                    required
                    placeholder="Ex: Dimanche 13 Septembre 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <input
                  type="checkbox"
                  id="urgente"
                  checked={urgente}
                  onChange={e => setUrgente(e.target.checked)}
                  className="rounded text-[#A31D24] focus:ring-[#A31D24]"
                />
                <label
                  htmlFor="urgente"
                  className="text-xs font-bold text-slate-800 cursor-pointer flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-[#A31D24]" />
                  <span>Marquer ce rapport comme prioritaire / Requête urgente pour le Pasteur</span>
                </label>
              </div>
            </div>

            {/* Champs Définis par le Pasteur */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <h4 className="font-black uppercase text-[#0A3D36] tracking-wider flex items-center gap-1.5 text-[11px]">
                <FileText className="w-4 h-4 text-[#C59A27]" />
                <span>2. Éléments Demandés dans cette Fenêtre</span>
              </h4>

              <div className="space-y-3">
                {template.champs.map(champ => {
                  const val = valeurs[champ.id] !== undefined ? valeurs[champ.id] : '';

                  return (
                    <div key={champ.id} className="space-y-1">
                      <label className="font-bold text-slate-700 block text-xs">
                        {champ.label} {champ.required && <span className="text-rose-600">*</span>}
                      </label>

                      {champ.type === 'text' && (
                        <input
                          type="text"
                          required={champ.required}
                          value={val}
                          onChange={e => handleValueChange(champ.id, e.target.value)}
                          placeholder={champ.placeholder}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                        />
                      )}

                      {champ.type === 'textarea' && (
                        <textarea
                          rows={3}
                          required={champ.required}
                          value={val}
                          onChange={e => handleValueChange(champ.id, e.target.value)}
                          placeholder={champ.placeholder}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                        />
                      )}

                      {champ.type === 'number' && (
                        <input
                          type="number"
                          required={champ.required}
                          value={val}
                          onChange={e =>
                            handleValueChange(champ.id, Number(e.target.value))
                          }
                          placeholder={champ.placeholder}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-semibold"
                        />
                      )}

                      {champ.type === 'date' && (
                        <input
                          type="date"
                          required={champ.required}
                          value={val}
                          onChange={e => handleValueChange(champ.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                        />
                      )}

                      {champ.type === 'select' && (
                        <select
                          required={champ.required}
                          value={val}
                          onChange={e => handleValueChange(champ.id, e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs font-semibold"
                        >
                          {champ.options?.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {champ.type === 'photo' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={val}
                            onChange={e => handleValueChange(champ.id, e.target.value)}
                            placeholder="Lien de la photo ou fichier ci-contre"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#0A3D36] text-xs"
                          />
                          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer shrink-0">
                            <Upload className="w-3.5 h-3.5 text-[#C59A27]" />
                            <span>Importer</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(champ.id, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      {champ.type === 'boolean' && (
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={Boolean(val)}
                            onChange={e => handleValueChange(champ.id, e.target.checked)}
                            className="rounded text-[#0A3D36] focus:ring-[#0A3D36]"
                          />
                          <span>Oui, validé / exécuté</span>
                        </label>
                      )}
                    </div>
                  );
                })}
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
                className="px-6 py-2.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md hover:scale-102 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#E5B22F]" />
                <span>Envoyer dans la Boîte du Pasteur</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
