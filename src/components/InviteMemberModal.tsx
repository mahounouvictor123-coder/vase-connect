import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  X,
  Sparkles,
  Users,
  Send,
  Shield,
  Crown
} from 'lucide-react';
import { UserProfile } from '../types';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserProfile | null;
  onPreviewInvite?: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPreviewInvite,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const inviteUrl = `${window.location.origin}/?invite=membre`;

  const inviterTitle = currentUser?.role === 'PASTEUR'
    ? 'Le Pasteur Mohammed Sanogo'
    : currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : 'La communauté pastorale';

  const shareText = `🕊️ *INVITATION OFFICIELLE — ÉGLISE VASES D'HONNEUR*\n\nShalom bien-aimé(e) !\n${inviterTitle} vous adresse une chaleureuse invitation fraternelle à rejoindre *Vases Connect*, la plateforme officielle de notre communauté.\n\n👉 *Cliquez sur ce lien d'invitation pour vous inscrire :*\n${inviteUrl}\n\nEn ouvrant ce lien, vous serez accueilli(e) avec votre carte d'invitation officielle pour renseigner :\n✨ Nom & Prénom\n✨ Votre Tribu spirituelle\n✨ Vos 2 à 3 Départements de service\n✨ Votre Numéro de téléphone WhatsApp\n✨ Votre Porte d'Influence royale dans la cité\n✨ Votre Quartier (Famille d'Honneur de proximité)\n\nQue le Seigneur vous bénisse abondamment !`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden text-slate-800 animate-in zoom-in-95">
        {/* En-tête */}
        <div className="bg-gradient-to-br from-[#062722] via-[#0A3D36] to-[#135E54] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#C59A27]/20 border border-[#C59A27]/40 flex items-center justify-center text-[#E5B22F] mb-3">
            <Users className="w-6 h-6 text-[#E5B22F]" />
          </div>

          <h3 className="text-lg font-black text-white">
            Inviter un Membre sur Vases Connect
          </h3>

          <p className="text-xs text-emerald-100/90 mt-1">
            Partagez le lien d'invitation officielle. Le membre le recevra comme une invitation fraternelle personnalisée avec formulaire d'affectation immédiate.
          </p>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Lien direct d'invitation fraternelle
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-700 font-mono select-all focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 bg-[#0A3D36] hover:bg-[#072a25] text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <Shield className="w-3.5 h-3.5 text-[#C59A27]" />
              <span>Champs d'Inscription Prévus pour le Membre</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              En ouvrant ce lien, le membre renseigne : <strong>Nom & Prénom</strong>, <strong>Tribu</strong>, <strong>2 à 3 Départements au choix</strong>, <strong>Téléphone WhatsApp</strong>, <strong>Porte d'Influence</strong> et <strong>Quartier</strong>.
            </p>
          </div>

          {/* Boutons d'Action */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-101 active:scale-98 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Envoyer l'invitation sur WhatsApp</span>
            </button>

            {onPreviewInvite && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onPreviewInvite();
                }}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C59A27]" />
                <span>Tester & Prévisualiser ce que voit le membre invité</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
