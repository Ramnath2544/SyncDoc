import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Spinner, Avatar } from 'flowbite-react';
import { HiPaperAirplane, HiX } from 'react-icons/hi';

let socket = null;

export default function ChatSidebar({ documentId, onClose }) {
  const { currentUser } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket = io('http://localhost:3000', { withCredentials: true });
    socket.emit('join-document', documentId);

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.emit('leave-document', documentId);
      socket.disconnect();
      socket = null;
    };
  }, [documentId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${documentId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [documentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    setSending(true);

    try {
      const res = await fetch(`/api/messages/${documentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: text.trim() }),
      });
      const savedMessage = await res.json();

      if (res.ok) {
        socket.emit('send-message', {
          documentId,
          message: savedMessage,
        });
        setText('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isMine = (msg) =>
    msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;

  return (
    <div className='flex flex-col h-full w-72 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
      <div className='flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
        <h2 className='text-sm font-semibold text-gray-800 dark:text-white'>
          Document Chat
        </h2>
        <button
          onClick={onClose}
          className='p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
        >
          <HiX className='text-lg' />
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-3'>
        {loading && (
          <div className='flex justify-center py-8'>
            <Spinner size='md' />
          </div>
        )}

        {!loading && messages.length === 0 && (
          <div className='flex flex-col items-center justify-center h-full text-center text-gray-400 dark:text-gray-500 gap-2'>
            <p className='text-2xl'>💬</p>
            <p className='text-sm'>No messages yet.</p>
            <p className='text-xs'>Start the conversation!</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const mine = isMine(msg);
          return (
            <div
              key={msg._id || i}
              className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar
                img={msg.sender?.profilePicture}
                rounded
                size='xs'
                placeholderInitials={msg.sender?.username?.[0]?.toUpperCase()}
                className='flex-shrink-0 mb-1'
              />

              <div
                className={`flex flex-col max-w-[75%] ${mine ? 'items-end' : 'items-start'}`}
              >
                {!mine && (
                  <span className='text-xs text-gray-400 dark:text-gray-500 mb-0.5 ml-1'>
                    {msg.sender?.username}
                  </span>
                )}

                <div
                  className={`px-3 py-2 rounded-2xl text-sm break-words
                    ${
                      mine
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-sm'
                    }`}
                >
                  {msg.text}
                </div>
                <span className='text-xs text-gray-300 dark:text-gray-600 mt-0.5 mx-1'>
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className='px-3 py-3 border-t border-gray-200 dark:border-gray-700'>
        <div className='flex items-center gap-2'>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder='Type a message...'
            className='flex-1 text-sm px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600
              bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100
              placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors'
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className='p-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40
              disabled:cursor-not-allowed text-white transition-colors flex-shrink-0'
          >
            {sending ? (
              <Spinner size='xs' />
            ) : (
              <HiPaperAirplane className='text-base rotate-90' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
