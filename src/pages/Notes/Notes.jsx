/* ============================================================
   MyNotes Page — Rich text note-taking workspace
   
   ARCHITECTURE:
   - Notes list on the left
   - Rich editor on the right (opens when a note is selected)
   - The editor uses contenteditable + execCommand for rich text
     (native browser API — no extra libraries needed)
   
   EDITOR FEATURES:
   - Paragraph styles (H1, H2, H3, Body)
   - Bold, Italic, Underline, Strikethrough
   - Text color, Highlight color
   - Alignment (Left, Center, Right)
   - Bullet list, Numbered list
   - Horizontal divider
   - Link insert/remove
   - Image upload
   - CTA button insert
   - Table insert
   
   React concepts used:
   - useRef: direct access to the contenteditable div
   - useState: current note, selection, active formats
   - useCallback: stable function references for toolbar actions
   ============================================================ */

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Plus, Trash2, Save, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  Link, Link2Off, Image, Minus, Type, Table,
  PenSquare, Search, Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../../components/Modal/Modal';
import './Notes.css';

/* Format a date string nicely */
function formatNoteDate(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/* ---- Rich Text Editor Toolbar ---- */
function EditorToolbar({ editorRef, onExec }) {
  const [showColorPicker, setShowColorPicker] = useState(null); // 'text' | 'highlight' | null
  const [showLinkInput,   setShowLinkInput]   = useState(false);
  const [linkUrl,         setLinkUrl]         = useState('');
  const [showTableModal,  setShowTableModal]  = useState(false);
  const [tableRows,       setTableRows]       = useState(3);
  const [tableCols,       setTableCols]       = useState(3);

  const exec = useCallback((cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    onExec?.();
  }, [editorRef, onExec]);

  const COLORS = ['#1a1630','#ef4444','#f59e0b','#22c55e','#3b82f6','#7c6fe0','#ec4899','#ffffff'];
  const HIGHLIGHTS = ['#fef3c7','#dcfce7','#dbeafe','#ede9f9','#fee2e2','#fce7f3','transparent'];

  const insertLink = () => {
    if (!linkUrl) return;
    exec('createLink', linkUrl);
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const insertImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        exec('insertImage', ev.target.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const insertCTAButton = () => {
    const text = prompt('Button text:', 'Open Resource');
    const url  = prompt('Button URL:', 'https://');
    if (!text) return;
    const html = `<a href="${url}" class="note-cta-btn" contenteditable="false">${text}</a>&nbsp;`;
    exec('insertHTML', html);
  };

  const insertTable = () => {
    let html = `<table class="note-table"><tbody>`;
    for (let r = 0; r < tableRows; r++) {
      html += '<tr>';
      for (let c = 0; c < tableCols; c++) {
        html += r === 0
          ? `<th contenteditable="true">Header ${c + 1}</th>`
          : `<td contenteditable="true">Cell</td>`;
      }
      html += '</tr>';
    }
    html += '</tbody></table><br>';
    exec('insertHTML', html);
    setShowTableModal(false);
  };

  return (
    <div className="editor-toolbar">
      {/* Heading styles */}
      <select
        className="toolbar-select"
        onChange={e => { exec('formatBlock', e.target.value); e.target.value = 'p'; }}
        defaultValue="p"
        title="Paragraph style"
      >
        <option value="p">Body</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="blockquote">Quote</option>
      </select>

      <div className="toolbar-divider" />

      {/* Basic formatting */}
      <ToolbarBtn icon={<Bold size={15} />}          onClick={() => exec('bold')}          title="Bold (Ctrl+B)" />
      <ToolbarBtn icon={<Italic size={15} />}        onClick={() => exec('italic')}        title="Italic (Ctrl+I)" />
      <ToolbarBtn icon={<Underline size={15} />}     onClick={() => exec('underline')}     title="Underline (Ctrl+U)" />
      <ToolbarBtn icon={<Strikethrough size={15} />} onClick={() => exec('strikeThrough')} title="Strikethrough" />

      <div className="toolbar-divider" />

      {/* Text color */}
      <div className="toolbar-color-wrap">
        <ToolbarBtn icon={<Type size={15} />} onClick={() => setShowColorPicker(p => p === 'text' ? null : 'text')} title="Text color" />
        {showColorPicker === 'text' && (
          <div className="toolbar-color-picker">
            {COLORS.map(c => (
              <button key={c} className="color-swatch" style={{ background: c, border: c === '#ffffff' ? '1px solid var(--border-medium)' : 'none' }}
                onClick={() => { exec('foreColor', c); setShowColorPicker(null); }} />
            ))}
          </div>
        )}
      </div>

      {/* Highlight color */}
      <div className="toolbar-color-wrap">
        <ToolbarBtn icon={<span style={{ fontSize: 14, fontWeight: 800, background: '#fef3c7', padding: '0 2px', borderRadius: 2 }}>H</span>}
          onClick={() => setShowColorPicker(p => p === 'highlight' ? null : 'highlight')} title="Highlight" />
        {showColorPicker === 'highlight' && (
          <div className="toolbar-color-picker">
            {HIGHLIGHTS.map(c => (
              <button key={c} className="color-swatch" style={{ background: c === 'transparent' ? 'white' : c, border: '1px solid var(--border-medium)' }}
                onClick={() => { exec('hiliteColor', c); setShowColorPicker(null); }} />
            ))}
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      {/* Alignment */}
      <ToolbarBtn icon={<AlignLeft size={15} />}   onClick={() => exec('justifyLeft')}   title="Align left" />
      <ToolbarBtn icon={<AlignCenter size={15} />} onClick={() => exec('justifyCenter')} title="Align center" />
      <ToolbarBtn icon={<AlignRight size={15} />}  onClick={() => exec('justifyRight')}  title="Align right" />

      <div className="toolbar-divider" />

      {/* Lists */}
      <ToolbarBtn icon={<List size={15} />}        onClick={() => exec('insertUnorderedList')} title="Bullet list" />
      <ToolbarBtn icon={<ListOrdered size={15} />} onClick={() => exec('insertOrderedList')}   title="Numbered list" />

      {/* Divider */}
      <ToolbarBtn icon={<Minus size={15} />} onClick={() => exec('insertHorizontalRule')} title="Horizontal divider" />

      <div className="toolbar-divider" />

      {/* Link */}
      <div className="toolbar-link-wrap">
        <ToolbarBtn icon={<Link size={15} />} onClick={() => setShowLinkInput(l => !l)} title="Insert link" />
        {showLinkInput && (
          <div className="toolbar-link-input">
            <input
              type="url"
              placeholder="https://..."
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && insertLink()}
              autoFocus
            />
            <button onClick={insertLink}>Insert</button>
          </div>
        )}
      </div>
      <ToolbarBtn icon={<Link2Off size={15} />} onClick={() => exec('unlink')} title="Remove link" />

      <div className="toolbar-divider" />

      {/* Image upload */}
      <ToolbarBtn icon={<Image size={15} />} onClick={insertImage} title="Insert image" />

      {/* CTA button */}
      <ToolbarBtn icon={<span style={{ fontSize: 11, fontWeight: 700, padding: '0 2px' }}>CTA</span>}
        onClick={insertCTAButton} title="Insert CTA button" />

      {/* Table */}
      <div className="toolbar-table-wrap">
        <ToolbarBtn icon={<Table size={15} />} onClick={() => setShowTableModal(true)} title="Insert table" />
        {showTableModal && (
          <div className="toolbar-table-picker">
            <div className="table-picker-title">Insert Table</div>
            <div className="table-picker-inputs">
              <label>Rows
                <input type="number" min="1" max="10" value={tableRows} onChange={e => setTableRows(+e.target.value)} />
              </label>
              <label>Columns
                <input type="number" min="1" max="8" value={tableCols} onChange={e => setTableCols(+e.target.value)} />
              </label>
            </div>
            <div className="table-picker-actions">
              <button onClick={insertTable}>Insert</button>
              <button onClick={() => setShowTableModal(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Small toolbar button */
function ToolbarBtn({ icon, onClick, title }) {
  return (
    <button className="toolbar-btn" onClick={onClick} title={title} type="button">
      {icon}
    </button>
  );
}

/* ---- Note Editor ---- */
function NoteEditor({ note, onChange, onSave }) {
  const editorRef = useRef(null);
  const [title, setTitle] = useState(note?.title || '');

  // Sync editor content when note changes
  useEffect(() => {
    if (editorRef.current && note) {
      editorRef.current.innerHTML = note.content || '';
      setTitle(note.title || '');
    }
  }, [note?.id]);

  const handleSave = () => {
    const content = editorRef.current?.innerHTML || '';
    onSave({ title: title.trim() || 'Untitled Note', content });
  };

  if (!note) return (
    <div className="editor-empty">
      <PenSquare size={40} style={{ color: 'var(--text-tertiary)' }} />
      <p>Select a note to edit, or create a new one</p>
    </div>
  );

  return (
    <div className="note-editor">
      {/* Note title */}
      <input
        type="text"
        className="note-title-input"
        placeholder="Note title..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* Toolbar */}
      <EditorToolbar editorRef={editorRef} onExec={() => {}} />

      {/* Contenteditable area */}
      <div
        ref={editorRef}
        className="note-content-area"
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Start writing your note..."
        onInput={() => onChange?.()}
      />

      {/* Save button */}
      <div className="editor-footer">
        <button className="btn btn-primary btn-sm" onClick={handleSave}>
          <Save size={14} /> Save Note
        </button>
        <span className="editor-footer-hint">Changes are saved locally</span>
      </div>
    </div>
  );
}

/* ---- Main Notes Page ---- */
function Notes() {
  const { notes, addNote, updateNote, deleteNote, showToast } = useApp();
  const [selectedId,    setSelectedId]    = useState(notes[0]?.id || null);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const selectedNote = notes.find(n => n.id === selectedId);

  const filtered = notes.filter(n =>
    !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewNote = () => {
    const n = addNote({
      title: 'New Note',
      content: '',
      tags: [],
    });
    setSelectedId(n.id);
    showToast('New note created', 'success');
  };

  const handleSave = (updates) => {
    if (!selectedId) return;
    updateNote(selectedId, updates);
    showToast('Note saved', 'success');
  };

  const handleDelete = (id) => {
    deleteNote(id);
    if (selectedId === id) setSelectedId(notes.find(n => n.id !== id)?.id || null);
    setConfirmDelete(null);
    showToast('Note deleted', 'success');
  };

  return (
    <div className="notes-page">
      {/* Left panel: notes list */}
      <div className="notes-sidebar">
        <div className="notes-sidebar-header">
          <h2 className="notes-sidebar-title">My Notes</h2>
          <button className="btn btn-primary btn-sm" onClick={handleNewNote}>
            <Plus size={14} /> New
          </button>
        </div>

        {/* Search */}
        <div className="notes-search">
          <Search size={14} />
          <input
            type="search"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Notes list */}
        <div className="notes-list">
          {filtered.length === 0 && (
            <div className="notes-empty-list">No notes found</div>
          )}
          {filtered.map(note => (
            <div
              key={note.id}
              className={`note-list-item ${selectedId === note.id ? 'note-list-item-active' : ''}`}
              onClick={() => setSelectedId(note.id)}
              role="button"
              tabIndex={0}
            >
              <div className="note-list-title">{note.title}</div>
              <div className="note-list-meta">
                <Clock size={10} />
                {formatNoteDate(note.updatedAt)}
              </div>
              <div className="note-list-preview" dangerouslySetInnerHTML={{
                __html: note.content?.replace(/<[^>]+>/g, ' ').slice(0, 80) || 'Empty note'
              }} />
              <button
                className="note-list-delete"
                onClick={e => { e.stopPropagation(); setConfirmDelete(note.id); }}
                aria-label="Delete note"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: editor */}
      <div className="notes-editor-panel">
        <NoteEditor
          key={selectedId}
          note={selectedNote}
          onChange={() => {}}
          onSave={handleSave}
        />
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Note"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            This note will be permanently deleted. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(null)}>Cancel</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(confirmDelete)}>Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Notes;
