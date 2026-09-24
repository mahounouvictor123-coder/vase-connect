import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  KeyRound,
  Users,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  Mail,
  Trash2,
  Edit3,
  UserCheck,
  UserX,
  Award,
  Crown,
  Home,
  BookOpen,
  Sparkles,
  ExternalLink,
  Lock,
  Unlock,
  Layers,
  X,
  Send,
  RotateCcw,
} from 'lucide-react';
import {
  LeadershipAccount,
  LeadershipCategory,
  getLeadershipAccounts,
  saveLeadershipAccounts,
  generateRandomPasscode,
  generatePasscodesForAllLeaders,
  replaceLeaderInAccount,
  revokeLeaderInAccount,
  updateLeadershipAccount,
  getRegisteredLeadershipSpaceIds,
  unclaimLeadershipSpace,
} from '../../data/leadershipData';
import { updateGateResponsible } from '../../data/gateLeadershipData';
import { InfluenceGateId } from '../../types';

interface PastorLeadershipManagerProps {
  onBackToOverview?: () => void;
}

// Preset photo options for quick selection in modal
const PRESET_AVATARS = [
  { label: 'Homme Leader 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Femme Leader 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { label: 'Homme Leader 2', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Femme Leader 2', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Homme Leader 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { label: 'Femme Leader 3', url: 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=400&auto=format&fit=crop&q=80' },
  { label: 'Homme Leader 4', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80' },
  { label: 'Femme Leader 4', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80' },
];

export const PastorLeadershipManager: React.FC<PastorLeadershipManagerProps> = ({
  onBackToOverview,
}) => {
  // Accounts state
  const [accounts, setAccounts] = useState<LeadershipAccount[]>(() => getLeadershipAccounts());
  const [claimedSpaceIds, setClaimedSpaceIds] = useState<string[]>(() => getRegisteredLeadershipSpaceIds());
  const [activeCategory, setActiveCategory] = useState<LeadershipCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Password visibility map { accountId: boolean }
  const [revealedPasscodes, setRevealedPasscodes] = useState<Record<string, boolean>>({});

  // Modals state
  const [editingAccount, setEditingAccount] = useState<LeadershipAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showBulkGenerateConfirm, setShowBulkGenerateConfirm] = useState(false);
  const [accountToRevoke, setAccountToRevoke] = useState<LeadershipAccount | null>(null);

  // Form state for replacement / edit
  const [formHolderName, setFormHolderName] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [formPasscode, setFormPasscode] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync with leadership updates
  useEffect(() => {
    const handleUpdate = () => {
      setAccounts(getLeadershipAccounts());
      setClaimedSpaceIds(getRegisteredLeadershipSpaceIds());
    };
    window.addEventListener('vases-leadership-updated', handleUpdate);
    return () => window.removeEventListener('vases-leadership-updated', handleUpdate);
  }, []);

  const handleUnclaimSpace = (accountId: string, targetName: string) => {
    unclaimLeadershipSpace(accountId);
    setClaimedSpaceIds(getRegisteredLeadershipSpaceIds());
    showToast(`L'inscription pour « ${targetName} » a été réinitialisée. Le responsable peut à nouveau s'inscrire avec son code.`);
  };

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // Hide the Pasteur Principal account from normal replacement list or keep as protected
      if (activeCategory !== 'ALL' && acc.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          acc.holderName.toLowerCase().includes(q) ||
          acc.targetName.toLowerCase().includes(q) ||
          acc.title.toLowerCase().includes(q) ||
          acc.phone.toLowerCase().includes(q) ||
          acc.passcode.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [accounts, activeCategory, searchQuery]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    return {
      total: accounts.length,
      portes: accounts.filter((a) => a.category === 'RESPONSABLE_PORTE').length,
      tribus: accounts.filter((a) => a.category === 'CHEF_TRIBU').length,
      familles: accounts.filter((a) => a.category === 'BERGER_FAMILLE').length,
      depts: accounts.filter((a) => a.category === 'CHEF_DEPARTEMENT').length,
      vacants: accounts.filter((a) => a.holderName.toLowerCase().includes('vacant')).length,
    };
  }, [accounts]);

  // Open edit modal for an account
  const handleOpenEditModal = (account: LeadershipAccount) => {
    setEditingAccount(account);
    setFormHolderName(account.holderName.includes('Poste Vacant') ? '' : account.holderName);
    setFormTitle(account.title);
    setFormPhone(account.phone);
    setFormEmail(account.email || '');
    setFormPhotoUrl(account.photoUrl);
    setFormPasscode(account.passcode);
    setFormDescription(account.description);
    setIsEditModalOpen(true);
  };

  // Save replacement or edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount || !formHolderName.trim()) return;

    const newPasscode = formPasscode.trim() || generateRandomPasscode(4);

    const updated = replaceLeaderInAccount(editingAccount.id, {
      holderName: formHolderName.trim(),
      title: formTitle.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim(),
      photoUrl: formPhotoUrl.trim() || PRESET_AVATARS[0].url,
      description: formDescription.trim(),
      passcode: newPasscode,
    });

    // If it's a gate responsible, sync with gateLeadershipData
    if (editingAccount.category === 'RESPONSABLE_PORTE' && editingAccount.targetId) {
      updateGateResponsible(editingAccount.targetId as InfluenceGateId, {
        nom: formHolderName.trim(),
        prenom: '',
        titre: formTitle.trim(),
        phone: formPhone.trim(),
        whatsapp: formPhone.trim().replace(/[^0-9]/g, ''),
        photoUrl: formPhotoUrl.trim() || PRESET_AVATARS[0].url,
        passcode: newPasscode,
        mandatVision: formDescription.trim(),
      });
    }

    setAccounts(updated);
    setIsEditModalOpen(false);
    setEditingAccount(null);
    showToast(`Le responsable de « ${editingAccount.targetName} » a été nommé avec succès ! Code d'accès : ${newPasscode}`);
  };

  // Generate a single code for an account
  const handleGenerateSingleCode = (accountId: string) => {
    const freshCode = generateRandomPasscode(4);
    const updated = updateLeadershipAccount(accountId, { passcode: freshCode });

    const targetAcc = updated.find((a) => a.id === accountId);
    if (targetAcc && targetAcc.category === 'RESPONSABLE_PORTE' && targetAcc.targetId) {
      updateGateResponsible(targetAcc.targetId as InfluenceGateId, {
        passcode: freshCode,
      });
    }

    setAccounts(updated);
    // Reveal passcode so the pastor sees it immediately
    setRevealedPasscodes((prev) => ({ ...prev, [accountId]: true }));
    showToast(`Nouveau code d'accès généré pour ${targetAcc?.targetName} : ${freshCode}`);
  };

  // Bulk generate codes for all
  const handleConfirmBulkGenerate = () => {
    const updated = generatePasscodesForAllLeaders();
    setAccounts(updated);
    setShowBulkGenerateConfirm(false);
    showToast('Tous les codes d\'accès des responsables ont été régénérés et enregistrés avec succès !');
  };

  // Revoke / delete leader from account
  const handleConfirmRevoke = () => {
    if (!accountToRevoke) return;

    const updated = revokeLeaderInAccount(accountToRevoke.id);
    if (accountToRevoke.category === 'RESPONSABLE_PORTE' && accountToRevoke.targetId) {
      updateGateResponsible(accountToRevoke.targetId as InfluenceGateId, {
        nom: 'Poste Vacant',
        prenom: '(En attente)',
        phone: '',
      });
    }

    setAccounts(updated);
    setClaimedSpaceIds(getRegisteredLeadershipSpaceIds());
    const targetName = accountToRevoke.targetName;
    setAccountToRevoke(null);
    showToast(`Le responsable de « ${targetName} » a été supprimé. Le poste est désormais vacant et son code d'accès a été réinitialisé.`);
  };

  // Copy code to clipboard
  const handleCopyCode = (acc: LeadershipAccount) => {
    navigator.clipboard.writeText(acc.passcode);
    setCopiedCodeId(acc.id);
    setTimeout(() => setCopiedCodeId(null), 2500);
    showToast(`Code d'accès ${acc.passcode} copié dans le presse-papier !`);
  };

  // Transmit code via WhatsApp
  const handleSendCodeWhatsApp = (acc: LeadershipAccount) => {
    if (!acc.phone) {
      alert('Veuillez d\'abord renseigner un numéro de téléphone pour ce responsable.');
      return;
    }
    const cleanPhone = acc.phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `🏛️ *COMMUNICATION OFFICIELLE — CHAIRE PASTORALE*\n` +
        `De la part du *Pasteur Mohammed Sanogo*,\n\n` +
        `Cher(e) bien-aimé(e) *${acc.holderName}*,\n` +
        `Dans le cadre de votre charge apostolique en tant que *${acc.title}* pour l'espace *« ${acc.targetName} »*, voici votre code d'accès officiel et strictement confidentiel pour administrer votre espace sur la plateforme Vases Connect :\n\n` +
        `🔑 *CODE D'ACCÈS SECRET :* \`${acc.passcode}\`\n\n` +
        `Conservez ce code précieusement. Que le Seigneur déploie Sa sagesse et Sa grâce sur votre intendance pour la transformation de notre nation.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // Export full list of codes
  const handleCopyFullCodesList = () => {
    const listText = accounts
      .map(
        (a) =>
          `• [${a.category}] ${a.targetName}\n  Responsable: ${a.holderName}\n  Tél: ${a.phone || 'Non renseigné'}\n  Code d'accès: ${a.passcode}\n`
      )
      .join('\n');

    const header = `📋 RÉPERTOIRE CONFIDENTIEL DES RESPONSABLES D'ESPACES & CODES D'ACCÈS\nÉglise Vases d'Honneur — Direction Pastorale\nDate: ${new Date().toLocaleDateString('fr-FR')}\n\n`;

    navigator.clipboard.writeText(header + listText);
    showToast('La liste intégrale des responsables et codes confidentiels a été copiée dans le presse-papier !');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A3D36] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#C59A27] flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-[#C59A27] shrink-0" />
          <span className="text-xs font-bold leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: PASTOR AUTHORITY & QUICK ACTIONS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A3D36] via-[#104C43] to-[#0A3D36] text-white p-6 sm:p-8 shadow-xl border border-[#C59A27]/40">
        <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-[#C59A27]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#C59A27] text-[#0A3D36] text-xs font-black uppercase tracking-wider shadow-xs">
                Chaire Pastorale & Gouvernance
              </span>
              <span className="text-xs text-amber-200 font-bold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                <span>Pasteur Mohammed Sanogo</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Nomination, Remplacement & Codes des Responsables
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 font-light leading-relaxed">
              Supervision centrale de tous les conducteurs établis : remplacez un titulaire, révoquez une charge ou générez des codes secrets d'accès pour chaque sphère d'activité.
            </p>
          </div>

          {/* Master Actions for the Pastor */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setShowBulkGenerateConfirm(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              title="Régénérer de nouveaux codes pour tous les responsables"
            >
              <RefreshCw className="w-4 h-4 text-slate-950" />
              <span>Générer les Codes pour Tous</span>
            </button>

            <button
              type="button"
              onClick={handleCopyFullCodesList}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
              title="Copier la liste complète des codes confidentiels"
            >
              <Copy className="w-4 h-4 text-[#C59A27]" />
              <span>Copier la Liste des Codes</span>
            </button>
          </div>
        </div>

        {/* Counter KPI pills */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-black/25 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Responsables</span>
            <span className="text-xl font-black text-white">{categoryCounts.total}</span>
          </div>
          <div className="bg-black/25 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-amber-300 block">12 Portes d'Influence</span>
            <span className="text-xl font-black text-[#C6DA28]">{categoryCounts.portes}</span>
          </div>
          <div className="bg-black/25 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">12 Tribus d'Israël</span>
            <span className="text-xl font-black text-white">{categoryCounts.tribus}</span>
          </div>
          <div className="bg-black/25 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Familles & Départements</span>
            <span className="text-xl font-black text-white">{categoryCounts.familles + categoryCounts.depts}</span>
          </div>
          <div className="bg-black/25 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-rose-300 block">Postes Vacants</span>
            <span className={`text-xl font-black ${categoryCounts.vacants > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
              {categoryCounts.vacants}
            </span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titulaire, espace, téléphone, code..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:border-[#0A3D36]"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium self-end sm:self-center">
            <strong>{filteredAccounts.length}</strong> espace(s) affiché(s)
          </span>
        </div>

        {/* Category switcher */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
              activeCategory === 'ALL'
                ? 'bg-[#0A3D36] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tous ({categoryCounts.total})
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('RESPONSABLE_PORTE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'RESPONSABLE_PORTE'
                ? 'bg-[#0A3D36] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#C59A27]" />
            <span>12 Portes d'Influence ({categoryCounts.portes})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('CHEF_TRIBU')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'CHEF_TRIBU'
                ? 'bg-[#0A3D36] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Crown className="w-3 h-3 text-amber-500" />
            <span>12 Tribus d'Israël ({categoryCounts.tribus})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('BERGER_FAMILLE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'BERGER_FAMILLE'
                ? 'bg-[#0A3D36] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Home className="w-3 h-3 text-teal-600" />
            <span>Familles d'Honneur ({categoryCounts.familles})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('CHEF_DEPARTEMENT')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              activeCategory === 'CHEF_DEPARTEMENT'
                ? 'bg-[#0A3D36] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3 h-3 text-blue-600" />
            <span>Départements & Cœur d'Honneur ({categoryCounts.depts})</span>
          </button>
        </div>
      </div>

      {/* LEADERSHIP CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAccounts.map((account) => {
          const isRevealed = revealedPasscodes[account.id] || false;
          const isVacant = account.holderName.toLowerCase().includes('vacant');
          const isPasteurPrincipal = account.id === 'lead-pasteur-principal';
          const isClaimed = claimedSpaceIds.includes(account.id);

          return (
            <div
              key={account.id}
              className={`bg-white rounded-3xl border shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${
                isVacant ? 'border-dashed border-rose-300 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <div className="p-5 space-y-3.5">
                {/* Card Top: Category Badge & Status */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      account.category === 'RESPONSABLE_PORTE'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : account.category === 'CHEF_TRIBU'
                        ? 'bg-purple-100 text-purple-900 border border-purple-300'
                        : account.category === 'BERGER_FAMILLE'
                        ? 'bg-teal-100 text-teal-900 border border-teal-300'
                        : 'bg-blue-100 text-blue-900 border border-blue-300'
                    }`}
                  >
                    {account.category === 'RESPONSABLE_PORTE'
                      ? 'Porte d\'Influence'
                      : account.category === 'CHEF_TRIBU'
                      ? 'Tribu d\'Israël'
                      : account.category === 'BERGER_FAMILLE'
                      ? 'Famille d\'Honneur'
                      : 'Département'}
                  </span>

                  {isClaimed ? (
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Inscrit & Actif
                    </span>
                  ) : isVacant ? (
                    <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full animate-pulse border border-rose-200">
                      Poste Vacant
                    </span>
                  ) : (
                    <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                      <KeyRound className="w-3 h-3 text-amber-600" />
                      Code Prêt
                    </span>
                  )}
                </div>

                {/* Espace Target Name */}
                <div>
                  <h3 className="font-black text-base text-[#0A3D36] line-clamp-1">
                    {account.targetName}
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold">{account.title}</p>
                </div>

                {/* Leader Profile snippet */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <img
                    src={account.photoUrl}
                    alt={account.holderName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-[#C59A27] shrink-0 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm text-slate-900 truncate">
                      {account.holderName}
                    </h4>
                    <p className="text-[11px] text-slate-600 truncate">
                      {account.phone || 'Aucun numéro configuré'}
                    </p>
                    {account.email && (
                      <p className="text-[10px] text-slate-400 truncate">{account.email}</p>
                    )}
                  </div>
                </div>

                {/* Description / Mandat */}
                <p className="text-xs text-slate-600 line-clamp-2 italic bg-white p-2 rounded-xl border border-slate-100">
                  « {account.description} »
                </p>

                {/* SECRET PASSCODE ZONE */}
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-300/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#C59A27] tracking-wider flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Code d'accès secret :</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setRevealedPasscodes((prev) => ({
                            ...prev,
                            [account.id]: !prev[account.id],
                          }))
                        }
                        className="text-[10px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-0.5 bg-white px-2 py-0.5 rounded-md border border-amber-200"
                      >
                        {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{isRevealed ? 'Masquer' : 'Voir'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyCode(account)}
                        className="text-[10px] font-bold text-slate-600 hover:text-slate-900 p-1 bg-white rounded-md border border-amber-200"
                        title="Copier le code"
                      >
                        {copiedCodeId === account.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-amber-300 font-mono text-base font-black text-[#0A3D36] tracking-widest shadow-2xs">
                      {isRevealed ? account.passcode : '••••'}
                    </div>

                    {!isPasteurPrincipal && (
                      <button
                        type="button"
                        onClick={() => handleGenerateSingleCode(account.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black shadow-sm transition-all active:scale-95"
                        title="Générer un nouveau code secret pour cet espace"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Générer Code d'Accès</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* CARD FOOTER: PASTOR ACTIONS */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                {/* WhatsApp transmission */}
                {account.phone && !isVacant ? (
                  <button
                    type="button"
                    onClick={() => handleSendCodeWhatsApp(account)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black shadow-2xs active:scale-95 transition-all"
                    title="Transmettre le code au responsable via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Envoyer Code (WhatsApp)</span>
                  </button>
                ) : (
                  <div className="text-[10px] text-slate-400 italic">
                    {isVacant ? 'En attente de nomination' : 'Numéro non renseigné'}
                  </div>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                  {!isPasteurPrincipal && (
                    <>
                      {/* Bouton Remplacer / Nommer */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(account)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-[11px] font-black shadow-2xs active:scale-95 transition-all"
                        title="Nommer ou remplacer le responsable de cet espace"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#C59A27]" />
                        <span>{isVacant ? 'Nommer' : 'Remplacer'}</span>
                      </button>

                      {/* Bouton Supprimer le responsable */}
                      {!isVacant && (
                        <button
                          type="button"
                          onClick={() => setAccountToRevoke(account)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 shadow-2xs active:scale-95 transition-all"
                          title="Supprimer / Révoquer ce responsable et réinitialiser son code"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Supprimer</span>
                        </button>
                      )}

                      {/* Bouton Réinitialiser l'inscription si déjà inscrit */}
                      {isClaimed && (
                        <button
                          type="button"
                          onClick={() => handleUnclaimSpace(account.id, account.targetName)}
                          className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
                          title="Réinitialiser l'inscription pour permettre une nouvelle connexion"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: REMPLACER / NOMMER UN RESPONSABLE */}
      {isEditModalOpen && editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0A3D36] to-[#104C43] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[#F5DE98] tracking-wider block">
                  Nomination & Remplacement Apostolique
                </span>
                <h3 className="font-black text-base text-white">
                  {editingAccount.targetName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom et Prénom du nouveau responsable * :
                </label>
                <input
                  type="text"
                  required
                  value={formHolderName}
                  onChange={(e) => setFormHolderName(e.target.value)}
                  placeholder="Ex: Pr. Jean-Eudes Dossou"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Titre officiel :
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Ex: Pilote Apostolique, Berger..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Téléphone / WhatsApp * :
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="Ex: +229 97 00 12 34"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email de contact (optionnel) :
                </label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="Ex: responsable@vasesdhonneur.ci"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>

              {/* Secret passcode field with generator */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                <label className="block text-xs font-black text-[#0A3D36]">
                  Code d'accès secret pour ce responsable :
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={formPasscode}
                    onChange={(e) => setFormPasscode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-amber-300 font-mono font-black text-sm bg-white focus:outline-hidden focus:border-[#0A3D36]"
                  />
                  <button
                    type="button"
                    onClick={() => setFormPasscode(generateRandomPasscode(4))}
                    className="px-3 py-1.5 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shrink-0 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#C59A27]" />
                    <span>Générer</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Le responsable devra saisir ce code confidentiel pour déverrouiller son espace.
                </p>
              </div>

              {/* Photo presets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo de profil :
                </label>
                <input
                  type="url"
                  value={formPhotoUrl}
                  onChange={(e) => setFormPhotoUrl(e.target.value)}
                  placeholder="URL de la photo ou sélectionnez ci-dessous..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36] mb-2"
                />

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av.url}
                      alt={av.label}
                      onClick={() => setFormPhotoUrl(av.url)}
                      className={`w-9 h-9 rounded-xl object-cover cursor-pointer border-2 transition-transform hover:scale-105 ${
                        formPhotoUrl === av.url ? 'border-[#0A3D36] ring-2 ring-[#C59A27]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={av.label}
                    />
                  ))}
                </div>
              </div>

              {/* Description & Mandat */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mandat & Consignes pastorales :
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Orientation pastorale, vision du Pasteur pour cet espace..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#135E54] text-white text-xs font-black shadow-md active:scale-95"
                >
                  Valider la Nomination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL: BULK GENERATE ALL PASSCODES */}
      {showBulkGenerateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <RefreshCw className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-[#0A3D36]">
                Régénérer tous les codes d'accès ?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cette action va générer un <strong>nouveau code secret à 4 chiffres</strong> pour chaque responsable de Porte, de Tribu, de Famille et de Département (le code du Pasteur Principal reste inchangé).
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkGenerateConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmBulkGenerate}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-md"
              >
                Confirmer la régénération
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM MODAL: REVOKE LEADER */}
      {accountToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <UserX className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-lg text-slate-900">
                Révoquer le responsable ?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Êtes-vous certain de vouloir révoquer <strong>{accountToRevoke.holderName}</strong> de son poste dans « {accountToRevoke.targetName} » ? Le poste sera marqué comme vacant en attendant une nouvelle nomination.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAccountToRevoke(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Conserver
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md"
              >
                Oui, Révoquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
