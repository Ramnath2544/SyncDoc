import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Spinner } from "flowbite-react";
import { HiArrowLeft, HiCheck } from "react-icons/hi";
import EditorToolbar from "../components/EditorToolbar";
import "../editor.css";

const SAVE_DELAY = 1500;

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("saved"); 
  const [saveTimer, setSaveTimer] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
      CharacterCount,
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus("unsaved");
      if (saveTimer) clearTimeout(saveTimer);
      const timer = setTimeout(() => {
        saveContent(editor.getJSON());
      }, SAVE_DELAY);
      setSaveTimer(timer);
    },
  });

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setDocument(data);
          if (data.content && editor) {
            editor.commands.setContent(data.content);
          }
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        console.error("Failed to load document:", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (editor) fetchDocument();
  }, [id, editor, navigate]);

  const saveContent = useCallback(
    async (content) => {
      setSaveStatus("saving");
      try {
        await fetch(`/api/documents/${id}/content`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content }),
        });
        setSaveStatus("saved");
      } catch (err) {
        console.error("Auto-save failed:", err);
        setSaveStatus("unsaved");
      }
    },
    [id]
  );

  useEffect(() => {
    return () => {
      if (saveTimer) clearTimeout(saveTimer);
    };
  }, [saveTimer]);

  const SaveIndicator = () => {
    if (saveStatus === "saving")
      return (
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <Spinner size="xs" /> Saving...
        </span>
      );
    if (saveStatus === "saved")
      return (
        <span className="flex items-center gap-1.5 text-xs text-green-500">
          <HiCheck className="text-base" /> Saved
        </span>
      );
    return (
      <span className="text-xs text-yellow-500">Unsaved changes</span>
    );
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Spinner size="lg" />
          <p className="text-sm">Loading document...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">


      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
   
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <HiArrowLeft className="text-lg" />
          </button>
          <h1 className="text-sm font-semibold text-gray-800 dark:text-white truncate max-w-xs sm:max-w-md">
            {document?.title || "Untitled Document"}
          </h1>
        </div>

        <div className="flex-shrink-0">
          <SaveIndicator />
        </div>
      </div>

      <EditorToolbar editor={editor} />

      <div className="flex-1 max-w-4xl w-full mx-auto px-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}