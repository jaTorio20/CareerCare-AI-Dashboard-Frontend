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
        type="button"
        onClick={() => editor.chain().toggleBold().run()}
        disabled={!editor.can().chain().toggleBold().run()}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().toggleItalic().run()}
        disabled={!editor.can().chain().toggleItalic().run()}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().toggleUnderline().run()}
        disabled={!editor.can().chain().toggleUnderline().run()}
      >
        Underline
      </button>

      {/* font size select */}
      <select
        onChange={(e) => editor.chain().setFontSize(e.target.value).run()}
        defaultValue=""
      >
        <option value="" disabled>Font size</option>
        {sizes.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
                
      <button onClick={() => editor.chain().unsetFontSize().run()}>
        Reset size
      </button>

        {/* LINE SPACING */}
    <select
      onChange={(e) => editor?.chain().setLineHeight(e.target.value).run()}
      defaultValue=""
    >
      <option value="" disabled>Line spacing</option>
      <option value="1">Single</option>
      <option value="1.15">1.15</option>
      <option value="1.5">1.5 lines</option>
      <option value="2">Double</option>
    </select>

    <button onClick={() => editor?.chain().unsetLineHeight().run()}>
      Reset line spacing
    </button>

    {/* PARAGRAPH SPACING */}
    <select
      onChange={(e) => {
        const [top, bottom] = e.target.value.split(',')
        editor?.chain().setParagraphSpacing(top, bottom).run()
      }}
      defaultValue=""
    >
      <option value="" disabled>Paragraph spacing</option>
      <option value="0,0">None</option>
      <option value="6pt,6pt">6pt before/after</option>
      <option value="12pt,12pt">12pt before/after</option>
      <option value="24pt,24pt">24pt before/after</option>
    </select>

    <button onClick={() => editor?.chain().unsetParagraphSpacing().run()}>
      Reset paragraph spacing
    </button>

    {/* TEXT ALIGNMENT */}
    <select
      onChange={(e) => editor?.chain().setTextAlign(e.target.value).run()}
      defaultValue=""
      >
      <option value="" disabled>Text alignment</option>
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
      <option value="justify">Justify</option>
    </select>

    </div>
  )
}