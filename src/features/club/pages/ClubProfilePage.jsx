import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { getMyClub, updateMyClub, updateMyClubBgImage } from "../../../shared/api/endpoints";
import {
  BackgroundImageDisplay,
  BackgroundImagePicker,
  BoardEditor,
  BoardReadOnly,
  ClubPageHeader,
  FormField,
} from "../components";
import { normalizeClubData } from "../lib/clubUtils";

const INITIAL_FORM = {
  vision: "",
  mission: "",
  description: "",
  executiveBoardJson: "[]",
};
const EMPTY_BOARD_MEMBER = { position: "", name: "" };

function ClubProfilePage() {
  const storedUser = localStorage.getItem("user");
  let parsedUser = null;
  if (storedUser) {
    try {
      parsedUser = JSON.parse(storedUser);
    } catch {
      parsedUser = null;
    }
  }
  const roles = parsedUser?.roles || [];
  const isSecretary = roles.includes("ROLE_SECRETARY");

  const [form, setForm] = useState(INITIAL_FORM);
  const [boardMembers, setBoardMembers] = useState([{ ...EMPTY_BOARD_MEMBER }]);
  const [currentClub, setCurrentClub] = useState(null);
  const [bgImageFile, setBgImageFile] = useState(null);
  const [bgImagePreview, setBgImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!isSecretary) {
      setLoading(false);
      return;
    }

    const loadMyClub = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getMyClub();
        const normalizedClub = normalizeClubData(data);

        setCurrentClub(normalizedClub);
        setForm(normalizedClub);
        setBoardMembers(
          normalizedClub.executiveBoard.length
            ? normalizedClub.executiveBoard
            : [{ ...EMPTY_BOARD_MEMBER }]
        );
      } catch (err) {
        console.error("Failed to load club profile:", err);
        setError("Failed to load your club profile.");
      } finally {
        setLoading(false);
      }
    };

    loadMyClub();
  }, [isSecretary]);

  useEffect(() => {
    return () => {
      if (bgImagePreview) {
        URL.revokeObjectURL(bgImagePreview);
      }
    };
  }, [bgImagePreview]);

  if (!isSecretary) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          This section is available only for ROLE_SECRETARY users.
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBoardMemberChange = (index, field, value) => {
    setBoardMembers((prev) =>
      prev.map((member, i) => (i === index ? { ...member, [field]: value } : member))
    );
  };

  const addBoardMember = () => {
    setBoardMembers((prev) => [...prev, { ...EMPTY_BOARD_MEMBER }]);
  };

  const removeBoardMember = (index) => {
    setBoardMembers((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleBgImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setBgImageFile(file);
    setBgImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const cleanedBoard = boardMembers
        .map((member) => ({
          position: (member.position || "").trim(),
          name: (member.name || "").trim(),
        }))
        .filter((member) => member.position || member.name);

      const executiveBoardJson = JSON.stringify(cleanedBoard);

      const payload = {
        vision: (form.vision || "").trim() || currentClub?.vision || "",
        mission: (form.mission || "").trim() || currentClub?.mission || "",
        description: (form.description || "").trim() || currentClub?.description || "",
        executiveBoardJson,
      };

      await updateMyClub(payload);

      if (bgImageFile) {
        const formData = new FormData();
        formData.append("bgImage", bgImageFile);
        await updateMyClubBgImage(formData);
      }

      const refreshed = await getMyClub();
      const normalizedClub = normalizeClubData(refreshed);
      setCurrentClub(normalizedClub);
      setForm(INITIAL_FORM);
      setBoardMembers([{ ...EMPTY_BOARD_MEMBER }]);
      setBgImageFile(null);
      setBgImagePreview(null);

      setSuccess("Club profile updated successfully.");
    } catch (err) {
      console.error("Club profile update failed:", err);
      setError(err?.response?.data?.message || "Failed to update club profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
        <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          Loading club profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-4xl mx-auto">
        <ClubPageHeader
          title="My Club Profile"
          subtitle="Update vision, mission, and executive board details."
        />

        {currentClub && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden mb-6">
            <div className="px-6 md:px-8 py-4 border-b border-slate-800 bg-slate-950/40">
              <h2 className="text-sm font-black tracking-wider uppercase text-slate-400">
                Current Saved Profile
              </h2>
            </div>
            <div className="p-6 md:p-8 space-y-5">
              <BackgroundImageDisplay imageUrl={currentClub.bgImageUrl} />

              <FormField label="Vision" value={currentClub.vision} readOnly rows={3} />
              <FormField label="Mission" value={currentClub.mission} readOnly rows={3} />
              <FormField label="Description" value={currentClub.description} readOnly rows={4} />
              <BoardReadOnly members={currentClub.executiveBoard || []} />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="px-6 md:px-8 py-4 border-b border-slate-800 bg-slate-950/40">
            <h2 className="text-sm font-black tracking-wider uppercase text-slate-400">
              Update Profile
            </h2>
          </div>
          <div className="p-6 md:p-8 space-y-5">
            <FormField
              label="Vision"
              name="vision"
              value={form.vision}
              onChange={handleChange}
              rows={3}
            />

            <FormField
              label="Mission"
              name="mission"
              value={form.mission}
              onChange={handleChange}
              rows={3}
            />

            <FormField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />

            <BackgroundImagePicker onChange={handleBgImageChange} previewUrl={bgImagePreview} />

            <BoardEditor
              members={boardMembers}
              onMemberChange={handleBoardMemberChange}
              onAddMember={addBoardMember}
              onRemoveMember={removeBoardMember}
            />

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            )}
          </div>

          <div className="px-6 md:px-8 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-2.5 text-sm font-bold text-white transition-colors"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Updating..." : "Update Club"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClubProfilePage;
