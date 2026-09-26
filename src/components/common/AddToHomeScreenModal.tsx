import React, { useState, useEffect } from 'react';
import {
  X,
  Share,
  Download,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Check,
  ExternalLink,
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface AddToHomeScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  customTitle?: string;
  customPortion?: string;
}

export const AddToHomeScreenModal: React.FC<AddToHomeScreenModalProps> = ({
  isOpen,
  onClose,
  customTitle = 'Vases Connect',
  customPortion,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // Detect standalone mode
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setInstalledSuccess(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setInstalledSuccess(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#C59A27]/40 my-auto flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#062722] via-[#0A3D36] to-[#135E54] p-5 text-white flex items-center justify-between relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/pwa-192x192.png"
                alt="Logo Vases Connect"
                className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-[#E5B22F] bg-[#0A3D36]"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C59A27] rounded-full border border-white flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-slate-950" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C59A27]/20 text-[#F5DE98] text-[10px] font-black uppercase tracking-wider">
                <span>Application Mobile Officielle</span>
              </div>
              <h3 className="text-base font-black text-white leading-tight">
                {customTitle}
              </h3>
              {customPortion && (
                <p className="text-[11px] text-amber-200/90 font-medium">
                  Portion : {customPortion}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Mockup Preview on Phone Screen */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-4 text-white text-center space-y-3 shadow-inner border border-slate-700">
            <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Aperçu sur votre écran d’accueil
            </p>
            <div className="flex items-center justify-center gap-4 py-1">
              <div className="flex flex-col items-center gap-1.5 animate-bounce-subtle">
                <div className="w-16 h-16 rounded-2xl shadow-2xl border-2 border-[#E5B22F] overflow-hidden bg-[#0A3D36] p-1 flex items-center justify-center">
                  <img
                    src="/pwa-192x192.png"
                    alt="Logo Vases Connect"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span className="text-xs font-black text-amber-200">Vases Connect</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              L'icône ressortira <strong>exactement avec le logo officiel Vases d'Honneur</strong> sur votre bureau de téléphone !
            </p>
          </div>

          {installedSuccess || isStandalone ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-black text-emerald-900">
                Application Déjà Installée !
              </h4>
              <p className="text-xs text-emerald-800">
                Vases Connect est présent sur votre écran d'accueil. Vous pouvez y accéder directement en plein écran à tout moment.
              </p>
            </div>
          ) : isIOS ? (
            /* Guide pas-à-pas pour iPhone / iPad Safari */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#0A3D36] uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-[#C59A27]" />
                <span>Installation sur iPhone / iPad (Safari) :</span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0A3D36] text-white font-black flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    Appuyez sur le bouton de <strong>Partage</strong> en bas de Safari :
                    <span className="inline-flex items-center gap-1 mx-1.5 px-2 py-0.5 rounded-md bg-white border border-slate-300 font-bold text-blue-600 shadow-2xs">
                      <Share className="w-3.5 h-3.5" /> Partager
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0A3D36] text-white font-black flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    Faites défiler le menu vers le bas et touchez :
                    <span className="block mt-1 font-black text-slate-900 bg-white p-1.5 rounded-lg border border-slate-200">
                      📲 « Sur l'écran d'accueil » (Add to Home Screen)
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#0A3D36] text-white font-black flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Appuyez sur <strong>« Ajouter »</strong> en haut à droite. C'est tout !
                  </div>
                </div>
              </div>
            </div>
          ) : deferredPrompt ? (
            /* Installation 1 clic sur Android / Chrome */
            <div className="space-y-3">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0A3D36] via-[#135E54] to-[#0A3D36] hover:from-[#062722] hover:to-[#0A3D36] text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <Download className="w-5 h-5 text-[#E5B22F] animate-bounce" />
                <span>Installer sur mon écran d'accueil</span>
              </button>
              <p className="text-[11px] text-center text-slate-500 font-medium">
                Installation directe 100% sécurisée sans passer par les stores d'applications.
              </p>
            </div>
          ) : (
            /* Guide universel Android / Chrome si prompt automatique non déclenché */
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-[#0A3D36] uppercase tracking-wider">
                <Smartphone className="w-4 h-4 text-[#C59A27]" />
                <span>Installation sur Android (Google Chrome) :</span>
              </div>

              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <p>
                  1. Appuyez sur le menu <strong>(les 3 points verticaux ⋮)</strong> en haut à droite de Google Chrome.
                </p>
                <p>
                  2. Choisissez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
                </p>
                <p>
                  3. Confirmez pour voir apparaître le logo Vases Connect parmi vos applications !
                </p>
              </div>
            </div>
          )}

          {/* Avantages */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-600 font-medium">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C59A27] shrink-0" />
              <span>Accès direct & sécurisé</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Plein écran sans barre d’URL</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
