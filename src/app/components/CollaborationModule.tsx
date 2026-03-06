import { useState, useEffect } from "react";
import { Plus, Users, Link as LinkIcon, Trash2, UserPlus, FileText } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface InterestedResearcher {
  name: string;
  email: string;
  affiliation?: string;
  addedAt: string;
}

interface AdditionalReference {
  citation: string;
  addedBy: string;
  addedAt: string;
}

interface ResearchIdea {
  id: string;
  title: string;
  description: string;
  author: string;
  email: string;
  affiliation?: string;
  references?: string;
  wantsToWork: boolean;
  createdAt: string;
  interestedResearchers?: InterestedResearcher[];
  additionalReferences?: AdditionalReference[];
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-fb3cb64e`;

export function CollaborationModule() {
  const [ideas, setIdeas] = useState<ResearchIdea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    email: "",
    affiliation: "",
    references: "",
    wantsToWork: false,
  });

  // Forms for adding interest and references
  const [showInterestForm, setShowInterestForm] = useState<string | null>(null);
  const [showReferenceForm, setShowReferenceForm] = useState<string | null>(null);
  const [interestData, setInterestData] = useState({
    name: "",
    email: "",
    affiliation: "",
  });
  const [referenceData, setReferenceData] = useState({
    citation: "",
    addedBy: "",
  });

  // Load ideas from backend
  const loadIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching ideas from:", `${API_BASE}/ideas`);
      
      const response = await fetch(`${API_BASE}/ideas`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error(`Error fetching ideas (${response.status}): ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Received data:", data);
      
      if (data.success) {
        setIdeas(data.ideas || []);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error loading ideas:", err);
      setError(`Erreur de chargement: ${String(err)}. Vérifiez que le serveur backend est actif.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Test server health first with retry logic
    const testServer = async (retryCount = 0) => {
      try {
        console.log(`Testing server connection (attempt ${retryCount + 1})...`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        const healthResponse = await fetch(`${API_BASE}/health`, {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (healthResponse.ok) {
          console.log("Server is healthy");
          await loadIdeas();
        } else {
          throw new Error("Server health check failed");
        }
      } catch (err) {
        console.error("Server connection error:", err);
        
        // Retry logic - try up to 3 times with 2 second delays
        if (retryCount < 2) {
          console.log(`Retrying in 2 seconds...`);
          setTimeout(() => testServer(retryCount + 1), 2000);
        } else {
          setError(
            `Impossible de se connecter au serveur backend après plusieurs tentatives. ` +
            `Le serveur est peut-être en cours de démarrage ou il y a une erreur de configuration. ` +
            `Vérifiez la console pour plus de détails.`
          );
          setLoading(false);
        }
      }
    };
    
    testServer();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_BASE}/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadIdeas();
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          author: "",
          email: "",
          affiliation: "",
          references: "",
          wantsToWork: false,
        });
        setShowForm(false);
      } else {
        throw new Error(data.error || "Failed to create idea");
      }
    } catch (err) {
      console.error("Error submitting idea:", err);
      alert("Erreur lors de la soumission: " + String(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette idée ?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/ideas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        await loadIdeas();
      } else {
        throw new Error(data.error || "Failed to delete idea");
      }
    } catch (err) {
      console.error("Error deleting idea:", err);
      alert("Erreur lors de la suppression: " + String(err));
    }
  };

  const handleAddInterest = async (ideaId: string) => {
    try {
      const response = await fetch(`${API_BASE}/ideas/${ideaId}/interest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(interestData),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadIdeas();
        setInterestData({ name: "", email: "", affiliation: "" });
        setShowInterestForm(null);
      } else {
        throw new Error(data.error || "Failed to add interest");
      }
    } catch (err) {
      console.error("Error adding interest:", err);
      alert("Erreur lors de l'ajout: " + String(err));
    }
  };

  const handleAddReference = async (ideaId: string) => {
    try {
      const response = await fetch(`${API_BASE}/ideas/${ideaId}/references`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(referenceData),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadIdeas();
        setReferenceData({ citation: "", addedBy: "" });
        setShowReferenceForm(null);
      } else {
        throw new Error(data.error || "Failed to add reference");
      }
    } catch (err) {
      console.error("Error adding reference:", err);
      alert("Erreur lors de l'ajout: " + String(err));
    }
  };

  if (loading) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Chargement des idées de recherche...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Module de Collaboration Scientifique
          </h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvelle idée
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Proposez des idées de liens de recherche sur le modèle de présence, partagez vos coordonnées et collaborez avec d'autres chercheurs.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 mb-3">Erreur: {error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              loadIdeas();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">Proposer une nouvelle idée</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de l'idée *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Lien entre présence sociale et modèle mental"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                placeholder="Décrivez votre idée de recherche..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affiliation (optionnel)
              </label>
              <input
                type="text"
                value={formData.affiliation}
                onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Université, institution..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Références (optionnel)
              </label>
              <textarea
                value={formData.references}
                onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                placeholder="Citations, DOI, liens vers articles..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="wantsToWork"
                checked={formData.wantsToWork}
                onChange={(e) => setFormData({ ...formData, wantsToWork: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="wantsToWork" className="text-sm font-medium text-gray-700">
                Je souhaite travailler sur cette idée
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Soumettre
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Ideas List */}
      <div className="space-y-4">
        {ideas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <LinkIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune idée proposée pour le moment.</p>
            <p className="text-sm mt-2">Soyez le premier à partager une idée de recherche !</p>
          </div>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea.id}
              className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {idea.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                </div>
                <button
                  onClick={() => handleDelete(idea.id)}
                  className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Auteur:</span>{" "}
                  <span className="text-gray-600">{idea.author}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>{" "}
                  <a href={`mailto:${idea.email}`} className="text-blue-600 hover:underline">
                    {idea.email}
                  </a>
                </div>
                {idea.affiliation && (
                  <div>
                    <span className="font-medium text-gray-700">Affiliation:</span>{" "}
                    <span className="text-gray-600">{idea.affiliation}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Date:</span>{" "}
                  <span className="text-gray-600">
                    {new Date(idea.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              {idea.references && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-700 text-sm">Références initiales:</span>
                  <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{idea.references}</p>
                </div>
              )}

              {idea.wantsToWork && (
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    <Users className="w-3 h-3" />
                    Disponible pour collaboration
                  </span>
                </div>
              )}

              {/* Interested Researchers Section */}
              {idea.interestedResearchers && idea.interestedResearchers.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-700 text-sm">Chercheurs intéressés:</span>
                  <div className="mt-2 space-y-2">
                    {idea.interestedResearchers.map((researcher, idx) => (
                      <div key={idx} className="text-sm bg-blue-50 p-2 rounded">
                        <span className="font-medium">{researcher.name}</span>
                        {" - "}
                        <a href={`mailto:${researcher.email}`} className="text-blue-600 hover:underline">
                          {researcher.email}
                        </a>
                        {researcher.affiliation && (
                          <span className="text-gray-600"> ({researcher.affiliation})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional References Section */}
              {idea.additionalReferences && idea.additionalReferences.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <span className="font-medium text-gray-700 text-sm">Références ajoutées:</span>
                  <div className="mt-2 space-y-2">
                    {idea.additionalReferences.map((ref, idx) => (
                      <div key={idx} className="text-sm bg-yellow-50 p-2 rounded">
                        <p className="text-gray-800">{ref.citation}</p>
                        <p className="text-gray-600 text-xs mt-1">
                          Ajouté par {ref.addedBy} le {new Date(ref.addedAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setShowInterestForm(showInterestForm === idea.id ? null : idea.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Manifester mon intérêt
                </button>
                <button
                  onClick={() => setShowReferenceForm(showReferenceForm === idea.id ? null : idea.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  Ajouter une référence
                </button>
              </div>

              {/* Interest Form */}
              {showInterestForm === idea.id && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Manifester mon intérêt</h4>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Votre nom *"
                      required
                      value={interestData.name}
                      onChange={(e) => setInterestData({ ...interestData, name: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Votre email *"
                      required
                      value={interestData.email}
                      onChange={(e) => setInterestData({ ...interestData, email: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Votre affiliation (optionnel)"
                      value={interestData.affiliation}
                      onChange={(e) => setInterestData({ ...interestData, affiliation: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddInterest(idea.id)}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Envoyer
                      </button>
                      <button
                        onClick={() => setShowInterestForm(null)}
                        className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reference Form */}
              {showReferenceForm === idea.id && (
                <div className="mt-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Ajouter une référence</h4>
                  <div className="space-y-2">
                    <textarea
                      placeholder="Citation complète (APA, DOI, lien...) *"
                      required
                      value={referenceData.citation}
                      onChange={(e) => setReferenceData({ ...referenceData, citation: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm min-h-[60px]"
                    />
                    <input
                      type="text"
                      placeholder="Votre nom *"
                      required
                      value={referenceData.addedBy}
                      onChange={(e) => setReferenceData({ ...referenceData, addedBy: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddReference(idea.id)}
                        className="px-4 py-1.5 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                      >
                        Ajouter
                      </button>
                      <button
                        onClick={() => setShowReferenceForm(null)}
                        className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
