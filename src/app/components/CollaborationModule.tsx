import { useState, useEffect } from "react";
import { Plus, Users, Link as LinkIcon, Trash2, UserPlus, FileText, X, Lock } from "lucide-react";
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
  sensoryModality?: string;
  sensoryModalityOther?: string;
  deviceType?: string;
  deviceTypeOther?: string;
  tool?: string;
  toolOther?: string;
  createdAt: string;
  interestedResearchers?: InterestedResearcher[];
  additionalReferences?: AdditionalReference[];
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-fb3cb64e`;

// Modal de confirmation de suppression
function DeleteConfirmModal({
  idea,
  onConfirm,
  onCancel,
}: {
  idea: ResearchIdea;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [inputEmail, setInputEmail] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const ADMIN_EMAIL = "clemence@wivy.fr";
  const ADMIN_CODE = "2128";

  const handleConfirm = () => {
    if (attempts >= 3) {
      setError("Too many failed attempts. Access locked.");
      return;
    }
    if (
      inputEmail.trim().toLowerCase() !== ADMIN_EMAIL &&
      inputCode.trim() !== ADMIN_CODE
    ) {
      setAttempts((a) => a + 1);
      setError(`Incorrect email and code. ${2 - attempts} attempt(s) remaining.`);
      return;
    }
    if (inputEmail.trim().toLowerCase() !== ADMIN_EMAIL) {
      setAttempts((a) => a + 1);
      setError(`Incorrect administrator email. ${2 - attempts} attempt(s) remaining.`);
      return;
    }
    if (inputCode.trim() !== ADMIN_CODE) {
      setAttempts((a) => a + 1);
      setError(`Incorrect security code. ${2 - attempts} attempt(s) remaining.`);
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Administrator access required</h3>
            <p className="text-xs text-gray-500">Only the administrator can delete ideas</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-2">You are about to delete:</p>
        <p className="text-sm font-semibold text-gray-900 mb-5 bg-gray-50 p-3 rounded-lg border border-gray-200">
          "{idea.title}"
        </p>

        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Administrator email
            </label>
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => { setInputEmail(e.target.value); setError(""); }}
              placeholder="Enter administrator email..."
              disabled={attempts >= 3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
              Security code
            </label>
            <input
              type="password"
              value={inputCode}
              onChange={(e) => { setInputCode(e.target.value); setError(""); }}
              placeholder="Enter 4-digit code..."
              maxLength={4}
              disabled={attempts >= 3}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm tracking-widest disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <span className="text-red-500 mt-0.5">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {attempts >= 3 && (
          <div className="text-sm text-gray-500 bg-gray-100 rounded-lg p-3 mb-4 text-center">
            🔒 Access locked after too many failed attempts.
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={attempts >= 3}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm deletion
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function CollaborationModule() {
  const [ideas, setIdeas] = useState<ResearchIdea[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ResearchIdea | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    email: "",
    affiliation: "",
    references: "",
    wantsToWork: false,
    sensoryModality: "",
    sensoryModalityOther: "",
    deviceType: "",
    deviceTypeOther: "",
    tool: "",
    toolOther: "",
  });

  const [showInterestForm, setShowInterestForm] = useState<string | null>(null);
  const [showReferenceForm, setShowReferenceForm] = useState<string | null>(null);
  const [interestData, setInterestData] = useState({ name: "", email: "", affiliation: "" });
  const [referenceData, setReferenceData] = useState({ citation: "", addedBy: "" });

  const loadIdeas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/ideas`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (!response.ok) throw new Error(`Error fetching ideas (${response.status})`);
      const data = await response.json();
      if (data.success) {
        setIdeas(data.ideas || []);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Error loading ideas:", err);
      setError(`Loading error: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const testServer = async (retryCount = 0) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const healthResponse = await fetch(`${API_BASE}/health`, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (healthResponse.ok) {
          await loadIdeas();
        } else {
          throw new Error("Server health check failed");
        }
      } catch (err) {
        if (retryCount < 2) {
          setTimeout(() => testServer(retryCount + 1), 2000);
        } else {
          setError("Unable to connect to the backend server after several attempts.");
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
        setFormData({
          title: "", description: "", author: "", email: "", affiliation: "",
          references: "", wantsToWork: false, sensoryModality: "",
          sensoryModalityOther: "", deviceType: "", deviceTypeOther: "", tool: "", toolOther: "",
        });
        setShowForm(false);
      } else {
        throw new Error(data.error || "Failed to create idea");
      }
    } catch (err) {
      alert("Submission error: " + String(err));
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      const response = await fetch(`${API_BASE}/ideas/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      const data = await response.json();
      if (data.success) {
        await loadIdeas();
      } else {
        throw new Error(data.error || "Failed to delete idea");
      }
    } catch (err) {
      alert("Deletion error: " + String(err));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleAddInterest = async (ideaId: string) => {
    try {
      const response = await fetch(`${API_BASE}/ideas/${ideaId}/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
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
      alert("Error adding interest: " + String(err));
    }
  };

  const handleAddReference = async (ideaId: string) => {
    try {
      const response = await fetch(`${API_BASE}/ideas/${ideaId}/references`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
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
      alert("Error adding reference: " + String(err));
    }
  };

  if (loading) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading research ideas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          idea={deleteTarget}
          onConfirm={handleDeleteConfirmed}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Scientific Collaboration Module
            </h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            New idea
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Propose research link ideas on the presence model, share your contact details and collaborate with other researchers.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 mb-3">Error: {error}</p>
            <button
              onClick={() => { setError(null); setLoading(true); loadIdeas(); }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded-lg border-2 border-blue-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">Propose a new idea</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idea title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Link between social presence and mental model" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                  placeholder="Describe your research idea..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" required value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" required value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation (optional)</label>
                <input type="text" value={formData.affiliation}
                  onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="University, institution..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">References (optional)</label>
                <textarea value={formData.references}
                  onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                  placeholder="Citations, DOI, links to articles..." />
              </div>
              {/* Sensory modality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sensory modality involved</label>
                <select value={formData.sensoryModality}
                  onChange={(e) => setFormData({ ...formData, sensoryModality: e.target.value, sensoryModalityOther: "" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">-- Select --</option>
                  <option value="auditory">Auditory</option>
                  <option value="visual">Visual</option>
                  <option value="tactile">Tactile</option>
                  <option value="auditory + visual">Auditory + Visual</option>
                  <option value="auditory + tactile">Auditory + Tactile</option>
                  <option value="visual + tactile">Visual + Tactile</option>
                  <option value="auditory + visual + tactile">Auditory + Visual + Tactile</option>
                  <option value="other">Other</option>
                </select>
                {formData.sensoryModality === "other" && (
                  <input type="text" placeholder="Please specify..."
                    value={formData.sensoryModalityOther}
                    onChange={(e) => setFormData({ ...formData, sensoryModalityOther: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                )}
              </div>
              {/* Device type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device type</label>
                <select value={formData.deviceType}
                  onChange={(e) => setFormData({ ...formData, deviceType: e.target.value, deviceTypeOther: "" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">-- Select --</option>
                  <option value="virtual reality">Virtual Reality</option>
                  <option value="mixed reality">Mixed Reality</option>
                  <option value="other">Other</option>
                </select>
                {formData.deviceType === "other" && (
                  <input type="text" placeholder="Please specify..."
                    value={formData.deviceTypeOther}
                    onChange={(e) => setFormData({ ...formData, deviceTypeOther: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                )}
              </div>
              {/* Tool */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tool</label>
                <select value={formData.tool}
                  onChange={(e) => setFormData({ ...formData, tool: e.target.value, toolOther: "" })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">-- Select --</option>
                  <option value="computer">Computer</option>
                  <option value="headphones">Headphones</option>
                  <option value="head mounted display">Head Mounted Display (HMD)</option>
                  <option value="CAVE">CAVE</option>
                  <option value="other">Other</option>
                </select>
                {formData.tool === "other" && (
                  <input type="text" placeholder="Please specify..."
                    value={formData.toolOther}
                    onChange={(e) => setFormData({ ...formData, toolOther: e.target.value })}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="wantsToWork" checked={formData.wantsToWork}
                  onChange={(e) => setFormData({ ...formData, wantsToWork: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label htmlFor="wantsToWork" className="text-sm font-medium text-gray-700">
                  I would like to work on this idea
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Submit
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Ideas List */}
        <div className="space-y-4">
          {ideas.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <LinkIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No ideas proposed yet.</p>
              <p className="text-sm mt-2">Be the first to share a research idea!</p>
            </div>
          ) : (
            ideas.map((idea) => (
              <div key={idea.id} className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{idea.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                  </div>
                  {/* Delete button — triggers email verification modal */}
                  <button
                    onClick={() => setDeleteTarget(idea)}
                    className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete (author only)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Author:</span>{" "}
                    <span className="text-gray-600">{idea.author}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>{" "}
                    <a href={`mailto:${idea.email}`} className="text-blue-600 hover:underline">{idea.email}</a>
                  </div>
                  {idea.affiliation && (
                    <div>
                      <span className="font-medium text-gray-700">Affiliation:</span>{" "}
                      <span className="text-gray-600">{idea.affiliation}</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>{" "}
                    <span className="text-gray-600">{new Date(idea.createdAt).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>

                {idea.references && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-700 text-sm">Initial references:</span>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{idea.references}</p>
                  </div>
                )}

                {/* Badges */}
                {(idea.sensoryModality || idea.deviceType || idea.tool) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {idea.sensoryModality && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        🎧 {idea.sensoryModality === "other" && idea.sensoryModalityOther
                          ? `Other: ${idea.sensoryModalityOther}`
                          : idea.sensoryModality.charAt(0).toUpperCase() + idea.sensoryModality.slice(1)}
                      </span>
                    )}
                    {idea.deviceType && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                        🥽 {idea.deviceType === "other" && idea.deviceTypeOther
                          ? `Other: ${idea.deviceTypeOther}`
                          : idea.deviceType.charAt(0).toUpperCase() + idea.deviceType.slice(1)}
                      </span>
                    )}
                    {idea.tool && (
                      <span className="inline-flex items-center px-2.5 py-1 bg-teal-100 text-teal-800 text-xs font-medium rounded-full">
                        🖥️ {idea.tool === "other" && idea.toolOther
                          ? `Other: ${idea.toolOther}`
                          : idea.tool.charAt(0).toUpperCase() + idea.tool.slice(1)}
                      </span>
                    )}
                  </div>
                )}

                {idea.wantsToWork && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      <Users className="w-3 h-3" />
                      Available for collaboration
                    </span>
                  </div>
                )}

                {/* Interested Researchers */}
                {idea.interestedResearchers && idea.interestedResearchers.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-700 text-sm">Interested researchers:</span>
                    <div className="mt-2 space-y-2">
                      {idea.interestedResearchers.map((researcher, idx) => (
                        <div key={idx} className="text-sm bg-blue-50 p-2 rounded">
                          <span className="font-medium">{researcher.name}</span>{" - "}
                          <a href={`mailto:${researcher.email}`} className="text-blue-600 hover:underline">{researcher.email}</a>
                          {researcher.affiliation && <span className="text-gray-600"> ({researcher.affiliation})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional References */}
                {idea.additionalReferences && idea.additionalReferences.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <span className="font-medium text-gray-700 text-sm">Added references:</span>
                    <div className="mt-2 space-y-2">
                      {idea.additionalReferences.map((ref, idx) => (
                        <div key={idx} className="text-sm bg-yellow-50 p-2 rounded">
                          <p className="text-gray-800">{ref.citation}</p>
                          <p className="text-gray-600 text-xs mt-1">
                            Added by {ref.addedBy} on {new Date(ref.addedAt).toLocaleDateString("en-GB")}
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
                    Express my interest
                  </button>
                  <button
                    onClick={() => setShowReferenceForm(showReferenceForm === idea.id ? null : idea.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    Add a reference
                  </button>
                </div>

                {/* Interest Form */}
                {showInterestForm === idea.id && (
                  <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm">Express my interest</h4>
                    <div className="space-y-2">
                      <input type="text" placeholder="Your name *" required value={interestData.name}
                        onChange={(e) => setInterestData({ ...interestData, name: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                      <input type="email" placeholder="Your email *" required value={interestData.email}
                        onChange={(e) => setInterestData({ ...interestData, email: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                      <input type="text" placeholder="Your affiliation (optional)" value={interestData.affiliation}
                        onChange={(e) => setInterestData({ ...interestData, affiliation: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                      <div className="flex gap-2">
                        <button onClick={() => handleAddInterest(idea.id)}
                          className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">Send</button>
                        <button onClick={() => setShowInterestForm(null)}
                          className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reference Form */}
                {showReferenceForm === idea.id && (
                  <div className="mt-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm">Add a reference</h4>
                    <div className="space-y-2">
                      <textarea placeholder="Full citation (APA, DOI, link...) *" required value={referenceData.citation}
                        onChange={(e) => setReferenceData({ ...referenceData, citation: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm min-h-[60px]" />
                      <input type="text" placeholder="Your name *" required value={referenceData.addedBy}
                        onChange={(e) => setReferenceData({ ...referenceData, addedBy: e.target.value })}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm" />
                      <div className="flex gap-2">
                        <button onClick={() => handleAddReference(idea.id)}
                          className="px-4 py-1.5 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700">Add</button>
                        <button onClick={() => setShowReferenceForm(null)}
                          className="px-4 py-1.5 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400">Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}