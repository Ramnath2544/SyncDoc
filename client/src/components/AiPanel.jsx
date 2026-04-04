import { useState, useRef } from 'react';
import { Spinner } from 'flowbite-react';
import {
  HiX,
  HiSparkles,
  HiDocumentText,
  HiPencil,
  HiChat,
  HiClipboardCopy,
  HiRefresh,
} from 'react-icons/hi';

const AI_ACTIONS = [
  {
    id: 'summarize',
    label: 'Summarize Document',
    icon: HiDocumentText,
    description: 'Get key points in bullet form',
    color: 'blue',
  },
  {
    id: 'grammar',
    label: 'Fix Grammar & Tone',
    icon: HiPencil,
    description: 'Correct errors and improve clarity',
    color: 'green',
  },
];

export default function AiPanel({ documentId, onClose }) {
  const [streaming, setStreaming] = useState(false);
  const [response, setResponse] = useState('');
  const [activeAction, setActiveAction] = useState(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const abortRef = useRef(null);

  const runAction = async (action, custom = '') => {
    if (abortRef.current) abortRef.current.abort();

    setStreaming(true);
    setResponse('');
    setActiveAction(action);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`/api/ai/${documentId}/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action,
          customPrompt: custom,
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        setResponse(`Error: ${err.message}`);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const raw = decoder.decode(value);
        const lines = raw.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          try {
            const json = JSON.parse(line.slice(6));
            if (json.done) break;
            if (json.error) {
              setResponse((prev) => prev + `\n\n ${json.error}`);
              break;
            }
            if (json.text) {
              setResponse((prev) => prev + json.text);
            }
          } catch {
            // Skip malformed chunks
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setResponse('Connection error. Please try again.');
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleCustomSubmit = () => {
    if (!customPrompt.trim() || streaming) return;
    runAction('custom', customPrompt.trim());
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      setStreaming(false);
    }
  };

  return (
    <div className='flex flex-col h-full w-80 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center gap-2'>
          <HiSparkles className='text-purple-500 text-lg' />
          <h2 className='text-sm font-semibold text-gray-800 dark:text-white'>
            AI Insights
          </h2>
        </div>
        <button
          onClick={onClose}
          className='p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
        >
          <HiX className='text-lg' />
        </button>
      </div>

      <div className='flex flex-col gap-4 px-4 py-4 overflow-y-auto flex-1'>
        <div className='flex flex-col gap-2'>
          <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
            Quick Actions
          </p>
          {AI_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => runAction(action.id)}
              disabled={streaming}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left
                transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  activeAction === action.id && response
                    ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                }`}
            >
              <action.icon
                className={`text-xl flex-shrink-0
                  ${action.color === 'blue' ? 'text-blue-500' : 'text-green-500'}`}
              />
              <div>
                <p className='text-sm font-medium text-gray-800 dark:text-white'>
                  {action.label}
                </p>
                <p className='text-xs text-gray-400 dark:text-gray-500'>
                  {action.description}
                </p>
              </div>
              {streaming && activeAction === action.id && (
                <Spinner size='sm' className='ml-auto flex-shrink-0' />
              )}
            </button>
          ))}
        </div>

        <div className='flex flex-col gap-2'>
          <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
            Ask Anything
          </p>
          <div className='flex flex-col gap-2'>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleCustomSubmit();
                }
              }}
              placeholder='e.g. Make this document more formal...'
              rows={3}
              disabled={streaming}
              className='w-full text-sm px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500
                resize-none disabled:opacity-50 transition-colors'
            />
            <button
              onClick={handleCustomSubmit}
              disabled={!customPrompt.trim() || streaming}
              className='flex items-center justify-center gap-2 px-4 py-2 rounded-xl
                bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
            >
              <HiChat className='text-base' />
              Ask Gemini
            </button>
          </div>
        </div>

        {(response || streaming) && (
          <div className='flex flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <p className='text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                Response
              </p>
              <div className='flex items-center gap-1'>
                {response && !streaming && (
                  <button
                    onClick={handleCopy}
                    title='Copy response'
                    className='flex items-center gap-1 px-2 py-1 rounded-lg text-xs
                      text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                  >
                    <HiClipboardCopy className='text-sm' />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}

                {response && !streaming && activeAction !== 'custom' && (
                  <button
                    onClick={() => runAction(activeAction)}
                    title='Regenerate'
                    className='p-1.5 rounded-lg text-gray-400 hover:bg-gray-100
                      dark:hover:bg-gray-700 transition-colors'
                  >
                    <HiRefresh className='text-sm' />
                  </button>
                )}

                {streaming && (
                  <button
                    onClick={handleStop}
                    className='px-2 py-1 rounded-lg text-xs text-red-500
                      hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
                  >
                    Stop
                  </button>
                )}
              </div>
            </div>

            <div
              className='relative rounded-xl border border-purple-200 dark:border-purple-800
              bg-purple-50 dark:bg-purple-900/10 px-4 py-3 text-sm text-gray-800
              dark:text-gray-200 whitespace-pre-wrap leading-relaxed min-h-[80px]'
            >
              {response}
              {streaming && (
                <span className='inline-block w-0.5 h-4 bg-purple-500 ml-0.5 animate-pulse align-middle' />
              )}
            </div>
          </div>
        )}

        {!response && !streaming && (
          <div className='flex flex-col items-center justify-center py-8 text-center text-gray-400 dark:text-gray-500 gap-2'>
            <HiSparkles className='text-3xl text-purple-300 dark:text-purple-700' />
            <p className='text-sm'>
              Pick an action above or ask anything about your document.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
