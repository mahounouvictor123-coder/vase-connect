import { AISearchResult } from '../types';

export async function queryAIAssistant(promptText: string): Promise<AISearchResult> {
  try {
    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: promptText }),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur: ${response.status}`);
    }

    const data: AISearchResult = await response.json();
    return data;
  } catch (error) {
    console.warn('Utilisation du moteur de secours local:', error);
    // Fallback if network or server issue occurs
    return {
      query: promptText,
      intent: 'Recherche locale de secours',
      extractedCriteria: {},
      matchedMembers: [],
      matchedProducts: [],
      matchedOpportunities: [],
      naturalAnswer: "Une erreur réseau est survenue lors de la communication avec l'Assistant Vases. Veuillez vérifier votre connexion ou réessayer.",
      noResultsFound: true,
      suggestedAction: 'Réessayer la recherche',
    };
  }
}
