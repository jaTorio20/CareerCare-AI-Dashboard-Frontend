import { Editor } from '@tiptap/react'

type Props = {
  editor: Editor | null
}

export default function EditorMenuBar({ editor }: Props) {
  if (!editor) return null

  const sizes = ['10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt']

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
      {/* inline formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
      >
        Underline
      </button>

      {/* font size select */}
      <select
        onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        defaultValue=""
      >
        <option value="" disabled>Font size</option>
        {sizes.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <button onClick={() => editor.chain().focus().unsetFontSize().run()}>
        Reset size
      </button>
    </div>
  )
}