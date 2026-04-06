import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Underline from '@tiptap/extension-underline';
import { HocuspocusProvider } from '@hocuspocus/provider';
import * as Y from 'yjs';
import { Spinner, Badge } from 'flowbite-react';
import {
  HiArrowLeft,
  HiCheck,
  HiWifi,
  HiUserAdd,
  HiChat,
  HiSparkles,
} from 'react-icons/hi';
import { MdWifiOff } from 'react-icons/md';
import EditorToolbar from '../components/EditorToolbar';
import ShareModal from '../components/ShareModal';
import ChatSidebar from '../components/ChatSidebar';
import AiPanel from '../components/AiPanel';
import { getRandomColor } from '../utils/getRandomColor';
import '../editor.css';

const SAVE_DELAY = 2000;

function getAccessTokenFromCookie() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [connected, setConnected] = useState(false);
  const [awarenessUsers, setAwarenessUsers] = useState([]);
  const [provider, setProvider] = useState(null);
  const [shareModal, setShareModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const saveTimerRef = useRef(null);

  const ydoc = useMemo(() => {
    void id;
    return new Y.Doc();
  }, [id]);

  const collaborationUser = useMemo(
    () => ({
      name: currentUser?.username || 'Anonymous',
      color: getRandomColor(),
    }),
    [currentUser?.username],
  );

  useEffect(() => {
    const p = new HocuspocusProvider({
      url: 'ws://localhost:1234',
      name: id,
      document: ydoc,
      token: getAccessTokenFromCookie(),
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
      onAwarenessUpdate: ({ states }) => {
        const users = [];
        states.forEach((state) => {
          if (state.user) users.push(state.user);
        });
        setAwarenessUsers(users);
      },
    });
    setProvider(p);
    return () => {
      p.destroy();
      setProvider(null);
      setConnected(false);
      setAwarenessUsers([]);
    };
  }, [id, ydoc]);

  const saveContent = useCallback(
    async (editorInstance) => {
      if (!editorInstance) return;
      setSaveStatus('saving');
      try {
        await fetch(`/api/documents/${id}/content`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content: editorInstance.getJSON() }),
        });
        setSaveStatus('saved');
      } catch (err) {
        console.error('Auto-save failed:', err);
        setSaveStatus('unsaved');
      }
    },
    [id],
  );

const editor = useEditor(
  {
    extensions: [
      StarterKit.configure({ history: false }),
      Placeholder.configure({
        placeholder: 'Start writing your document...',
      }),
      CharacterCount,
      Underline, // ✅ Add here
      Collaboration.configure({ document: ydoc }),
      ...(provider
        ? [
            CollaborationCursor.configure({
              provider,
              user: collaborationUser,
            }),
          ]
        : []),
    ],
      editorProps: {
        attributes: { class: 'tiptap-editor' },
      },
      onUpdate: ({ editor: ed }) => {
        setSaveStatus('unsaved');
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          saveContent(ed);
        }, SAVE_DELAY);
      },
    },
    [ydoc, provider, collaborationUser, saveContent],
  );

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setDocument(data);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Failed to fetch document:', err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id, navigate]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const isOwner =
    document?.owner?._id === currentUser?._id ||
    document?.owner === currentUser?._id;

  const SaveIndicator = () => {
    if (saveStatus === 'saving')
      return (
        <span className='flex items-center gap-1 text-xs text-gray-400'>
          <Spinner size='xs' /> Saving...
        </span>
      );
    if (saveStatus === 'saved')
      return (
        <span className='flex items-center gap-1 text-xs text-green-500'>
          <HiCheck /> Saved
        </span>
      );
    return <span className='text-xs text-yellow-500'>Unsaved</span>;
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-white dark:bg-gray-900'>
        <div className='flex flex-col items-center gap-3 text-gray-500'>
          <Spinner size='lg' />
          <p className='text-sm'>Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 flex flex-col'>
      <div className='flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm'>
        <div className='flex items-center gap-3 min-w-0'>
          <button
            onClick={() => navigate('/dashboard')}
            className='p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
          >
            <HiArrowLeft className='text-lg' />
          </button>
          <h1 className='text-sm font-semibold text-gray-800 dark:text-white truncate max-w-xs sm:max-w-md'>
            {document?.title || 'Untitled Document'}
          </h1>
        </div>

        <div className='flex items-center gap-3'>
          <div className='hidden sm:flex items-center -space-x-2'>
            {awarenessUsers.slice(0, 5).map((user, i) => (
              <div
                key={i}
                title={user.name}
                className='w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800 flex-shrink-0'
                style={{ backgroundColor: user.color }}
              >
                {user.name?.[0]?.toUpperCase()}
              </div>
            ))}
            {awarenessUsers.length > 5 && (
              <div className='w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800'>
                +{awarenessUsers.length - 5}
              </div>
            )}
          </div>

          {document && isOwner && (
            <button
              onClick={() => setShareModal(true)}
              className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                bg-blue-600 hover:bg-blue-700 text-white transition-colors'
            >
              <HiUserAdd className='text-base' />
              <span className='hidden sm:inline'>Share</span>
            </button>
          )}

          <button
            onClick={() => setChatOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                chatOpen
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            <HiChat className='text-base' />
            <span className='hidden sm:inline'>Chat</span>
          </button>

          <button
            onClick={() => setAiOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                aiOpen
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
          >
            <HiSparkles className='text-base' />
            <span className='hidden sm:inline'>AI</span>
          </button>

          <Badge color={connected ? 'success' : 'failure'} size='sm'>
            {connected ? (
              <span className='flex items-center gap-1'>
                <HiWifi /> Live
              </span>
            ) : (
              <span className='flex items-center gap-1'>
                <MdWifiOff /> Offline
              </span>
            )}
          </Badge>

          <SaveIndicator />
        </div>
      </div>

      <EditorToolbar editor={editor} />

      <div className='flex flex-1 overflow-hidden'>
        <div
          className={`flex-1 overflow-y-auto px-4 transition-all duration-300
            ${chatOpen || aiOpen ? 'max-w-full' : 'max-w-4xl mx-auto w-full'}`}
        >
          <EditorContent editor={editor} />
        </div>

        {chatOpen && (
          <ChatSidebar documentId={id} onClose={() => setChatOpen(false)} />
        )}

        {aiOpen && <AiPanel documentId={id} onClose={() => setAiOpen(false)} />}
      </div>

      <ShareModal
        show={shareModal}
        onClose={() => setShareModal(false)}
        document={document}
        onDocumentUpdate={(updatedDoc) => setDocument(updatedDoc)}
      />
    </div>
  );
}
