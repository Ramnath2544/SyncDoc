import { Tooltip } from 'flowbite-react';
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdFormatQuote,
  MdCode,
  MdHorizontalRule,
  MdUndo,
  MdRedo,
} from 'react-icons/md';

const ToolbarButton = ({ onClick, active, disabled, tooltip, children }) => (
  <Tooltip content={tooltip} placement='bottom'>
    <button
      type='button'
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={`p-1.5 rounded-md text-lg transition-colors duration-150
        ${
          active
            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  </Tooltip>
);

const Divider = () => (
  <span className='w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1' />
);

export default function EditorToolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className='flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-[5]'>
      <ToolbarButton
        tooltip='Heading 1'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
      >
        <span className='text-sm font-bold px-0.5'>H1</span>
      </ToolbarButton>
      <ToolbarButton
        tooltip='Heading 2'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
      >
        <span className='text-sm font-bold px-0.5'>H2</span>
      </ToolbarButton>
      <ToolbarButton
        tooltip='Heading 3'
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
      >
        <span className='text-sm font-bold px-0.5'>H3</span>
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        tooltip='Bold (Ctrl+B)'
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
      >
        <MdFormatBold />
      </ToolbarButton>
      <ToolbarButton
        tooltip='Italic (Ctrl+I)'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
      >
        <MdFormatItalic />
      </ToolbarButton>
      <ToolbarButton
        tooltip='Underline (Ctrl+U)'
        onClick={() => editor.chain().focus().toggleUnderline?.() ?? null}
        active={editor.isActive('underline')}
      >
        <MdFormatUnderlined />
      </ToolbarButton>
      <ToolbarButton
        tooltip='Strikethrough'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
      >
        <MdStrikethroughS />
      </ToolbarButton>
      <ToolbarButton
        tooltip='Inline Code'
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
      >
        <MdCode />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        tooltip='Bullet List'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
      >
        <MdFormatListBulleted />
      </ToolbarButton>
      <ToolbarButton
        tooltip='Numbered List'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
      >
        <MdFormatListNumbered />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        tooltip='Blockquote'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
      >
        <MdFormatQuote />
      </ToolbarButton>
      <ToolbarButton
        tooltip='Code Block'
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
      >
        <span className='text-xs font-mono font-bold px-0.5'>{`</>`}</span>
      </ToolbarButton>
      <ToolbarButton
        tooltip='Horizontal Rule'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        active={false}
      >
        <MdHorizontalRule />
      </ToolbarButton>

      <Divider />

      <ToolbarButton
        tooltip='Undo (Ctrl+Z)'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        active={false}
      >
        <MdUndo />
      </ToolbarButton>
      <ToolbarButton
        tooltip='Redo (Ctrl+Y)'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        active={false}
      >
        <MdRedo />
      </ToolbarButton>

      <div className='ml-auto text-xs text-gray-400 dark:text-gray-500 pr-1 select-none'>
        {editor.storage.characterCount?.characters()} chars
      </div>
    </div>
  );
}
