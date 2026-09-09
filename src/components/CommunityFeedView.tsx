import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, PlusCircle, Sparkles, Send, CheckCircle2, X, ArrowLeft } from 'lucide-react';
import { CommunityPost, UserProfile } from '../types';

interface CommunityFeedViewProps {
  posts: CommunityPost[];
  currentUser: UserProfile | null;
  onAddPost: (post: CommunityPost) => void;
  onLikePost: (postId: string) => void;
  onOpenAuth: () => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
  onBackToHome?: () => void;
}

export const CommunityFeedView: React.FC<CommunityFeedViewProps> = ({
  posts,
  currentUser,
  onAddPost,
  onLikePost,
  onOpenAuth,
  onOpenAssistantWithPrompt,
  onBackToHome,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'TEMOIGNAGE' | 'ANNONCE' | 'ENTRAIDE' | 'EVENEMENT' | 'INSPIRATION'>('TEMOIGNAGE');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const filteredPosts = posts.filter(p => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    return true;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const post: CommunityPost = {
      id: 'post-' + Date.now(),
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorProfession: currentUser.profession,
      authorPhoto: currentUser.photoUrl,
      authorDepartment: currentUser.departmentName,
      category: newCategory,
      categoryLabel: newCategory === 'TEMOIGNAGE' ? 'Témoignage' : newCategory === 'ANNONCE' ? 'Annonce' : 'Entraide',
      content: newContent,
      imageUrl: newImageUrl || undefined,
      likesCount: 1,
      likedByCurrentUser: true,
      comments: [],
      createdAt: new Date().toISOString(),
    };

    onAddPost(post);
    setShowCreateModal(false);
    setNewContent('');
    setNewImageUrl('');
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim() || !currentUser) return;
    const post = posts.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        id: 'c-' + Date.now(),
        authorName: `${currentUser.firstName} ${currentUser.lastName}`,
        authorPhoto: currentUser.photoUrl,
        content: commentInput.trim(),
        createdAt: new Date().toISOString(),
      });
      setCommentInput('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 pb-24 space-y-5">
      {onBackToHome && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#0A3D36] text-xs font-bold transition-all border border-slate-200 shadow-2xs active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>← Retour Accueil</span>
          </button>
          <span className="text-xs font-semibold text-slate-500">Fil d'actualité chrétien</span>
        </div>
      )}

      {/* Banner / Post box trigger */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          {currentUser ? (
            <img
              src={currentUser.photoUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-[#C59A27]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#0A3D36] text-white flex items-center justify-center font-bold text-xs">
              VH
            </div>
          )}

          <button
            onClick={() => {
              if (!currentUser) onOpenAuth();
              else setShowCreateModal(true);
            }}
            className="flex-1 text-left px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-500 transition-colors"
          >
            Partager un témoignage, une annonce ou une demande d'entraide...
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2 overflow-x-auto">
            {['ALL', 'TEMOIGNAGE', 'ANNONCE', 'ENTRAIDE'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0A3D36] text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'Tous les posts' : cat === 'TEMOIGNAGE' ? 'Témoignages' : cat === 'ANNONCE' ? 'Annonces' : 'Entraide'}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenAssistantWithPrompt("Montre-moi les dernières actualités de la communauté")}
            className="hidden sm:flex items-center gap-1 text-[#0A3D36] font-bold text-xs hover:underline shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C59A27]" />
            <span>Synthèse IA</span>
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <div
            key={post.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3"
          >
            {/* Author info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorPhoto}
                  alt=""
                  className="w-10 h-10 rounded-2xl object-cover border border-[#C59A27]"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900">{post.authorName}</h4>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-500">{post.authorProfession} • {post.authorDepartment}</p>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                post.category === 'TEMOIGNAGE' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                post.category === 'ANNONCE' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                'bg-blue-100 text-blue-900 border border-blue-200'
              }`}>
                {post.categoryLabel}
              </span>
            </div>

            {/* Content text */}
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {post.content}
            </p>

            {/* Optional Image */}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                className="w-full max-h-72 object-cover rounded-2xl border border-slate-100"
              />
            )}

            {/* Likes & Comments Toolbar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600">
              <button
                onClick={() => onLikePost(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors ${
                  post.likedByCurrentUser ? 'text-[#A31D24] font-bold bg-rose-50' : 'hover:bg-slate-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.likedByCurrentUser ? 'fill-current text-[#A31D24]' : ''}`} />
                <span>{post.likesCount} J'aime</span>
              </button>

              <button
                onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>{post.comments.length} Commentaires</span>
              </button>
            </div>

            {/* Comments Expanded */}
            {activeCommentPostId === post.id && (
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="space-y-2">
                  {post.comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2.5 text-xs bg-slate-50 p-2.5 rounded-2xl">
                      <img src={c.authorPhoto} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 mr-1.5">{c.authorName}</span>
                        <span className="text-slate-700">{c.content}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add comment input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Écrire un commentaire d'encouragement..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-hidden focus:border-[#0A3D36]"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-2 rounded-xl bg-[#0A3D36] text-white hover:bg-[#0D473E]"
                  >
                    <Send className="w-3.5 h-3.5 text-[#C59A27]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 text-slate-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-[#0A3D36]">Créer une publication communautaire</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Catégorie de la publication</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                >
                  <option value="TEMOIGNAGE">Témoignage de Grâce</option>
                  <option value="ANNONCE">Annonce officielle / Projet</option>
                  <option value="ENTRAIDE">Demande d'Entraide & Recherche</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Votre message</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Racontez comment Dieu a pourvu ou décrivez ce que vous souhaitez partager..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden focus:border-[#0A3D36]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image d'illustration (URL optionnelle)</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0A3D36] hover:bg-[#0D473E] text-white font-bold shadow-xs"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
