import React, { useState, useEffect } from 'react';
import { Download, Share, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isInstalled || dismissed) {
    return null;
  }

  // Show if either deferred prompt is available OR user is on mobile/iOS
  if (!deferredPrompt && !isIOS) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#0A3D36] via-[#0D4B42] to-[#145E54] text-white px-3.5 py-2.5 text-xs flex items-center justify-between shadow-md border-b border-[#C59A27]/40">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <img
            src="/pwa-192x192.png"
            alt="Logo Vases Connect"
            className="w-8 h-8 rounded-xl object-cover shadow-sm border border-[#C59A27]/50 shrink-0"
          />
          <div className="truncate">
            <p className="font-black text-amber-200 text-xs truncate">
              Installer l'application Vases Connect
            </p>
            <p className="text-[11px] text-white/85 truncate">
              Ajoutez l'icône officielle sur votre écran d'accueil
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#C59A27] to-[#E5B22F] hover:from-[#d4a92c] hover:to-[#f0c246] text-[#062722] font-black px-3 py-1.5 rounded-xl text-xs shadow-md transition-all hover:scale-103 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ajouter à l'écran</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Modal Guide */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 shadow-2xl border border-slate-100 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="Vases Connect"
                  className="w-11 h-11 rounded-2xl shadow-md border border-[#C59A27]/40"
                />
                <div>
                  <h3 className="font-black text-sm text-[#0A3D36]">Ajouter à l'écran d'accueil</h3>
                  <p className="text-[11px] text-slate-500">Installation directe sur iPhone / iPad</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl p-3 mb-4 text-xs text-amber-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Icône officielle Vases d'Honneur
              </p>
              <p className="text-[11px] text-amber-900/90 leading-relaxed">
                L'application s'ouvrira en plein écran sans barre d'adresse Safari, avec le logo et les notifications.
              </p>
            </div>

            <ol className="space-y-3 text-xs text-slate-700 mb-5">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0A3D36] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Dans Safari, appuyez sur le bouton de <strong>Partage</strong> <Share className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> (en bas de votre écran).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0A3D36] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Faites défiler le menu et appuyez sur <strong>« Sur l'écran d'accueil »</strong> (ou <i>Add to Home Screen</i>).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#0A3D36] text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Confirmez avec le bouton <strong>Ajouter</strong> en haut à droite.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full bg-[#0A3D36] hover:bg-[#135E54] text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-[#E5B22F]" />
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
