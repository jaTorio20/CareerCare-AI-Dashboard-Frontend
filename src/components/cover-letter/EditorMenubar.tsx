import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react"

type Props = {
  editor: Editor | null
}

export default function EditorMenuBar({ editor }: Props) {
  if (!editor) return null

  const sizes = ["10pt", "12pt", "14pt", "16pt", "18pt", "20pt", "24pt"]

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 bg-gray-100 p-2 rounded-lg shadow-sm">
      {/* Inline formatting */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => editor.chain().toggleBold().run()}
          disabled={!editor.can().chain().toggleBold().run()}
          className="cursor-pointer p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Bold"
        >
          <Bold className="w-5 h-5 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().toggleItalic().run()}
          disabled={!editor.can().chain().toggleItalic().run()}
          className="cursor-pointer p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Italic"
        >
          <Italic className="w-5 h-5 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().toggleUnderline().run()}
          disabled={!editor.can().chain().toggleUnderline().run()}
          className="cursor-pointer p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          title="Underline"
        >
          <Underline className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Font size */}
      <div className="flex items-center gap-2">
        <select
          onChange={(e) => editor.chain().setFontSize(e.target.value).run()}
          defaultValue=""
          className="cursor-pointer rounded hover:bg-gray-200 border-gray-300 text-sm"
        >
          <option value="" disabled>
            Font size
          </option>
          {sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          onClick={() => editor.chain().unsetFontSize().run()}
          className="cursor-pointer px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Line spacing */}
      <div className="flex items-center gap-2">
        <select
          onChange={(e) => editor.chain().setLineHeight(e.target.value).run()}
          defaultValue=""
          className="hover:bg-gray-200 cursor-pointer rounded border-gray-300 text-sm"
        >
          <option value="" disabled>
            Line spacing
          </option>
          <option value="1">Single</option>
          <option value="1.15">1.15</option>
          <option value="1.5">1.5 lines</option>
          <option value="2">Double</option>
        </select>
        <button
          onClick={() => editor.chain().unsetLineHeight().run()}
          className="cursor-pointer px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Paragraph spacing */}
      <div className="flex items-center gap-2">
        <select
          onChange={(e) => {
            const [top, bottom] = e.target.value.split(",")
            editor.chain().setParagraphSpacing(top, bottom).run()
          }}
          defaultValue=""
          className="hover:bg-gray-200 cursor-pointer rounded border-gray-300 text-sm"
        >
          <option value="" disabled>
            Paragraph spacing
          </option>
          <option value="0,0">None</option>
          <option value="6pt,6pt">6pt before/after</option>
          <option value="12pt,12pt">12pt before/after</option>
          <option value="24pt,24pt">24pt before/after</option>
        </select>
        <button
          onClick={() => editor.chain().unsetParagraphSpacing().run()}
          className="cursor-pointer px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Text alignment */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().setTextAlign("left").run()}
          className="cursor-pointer p-2 rounded hover:bg-gray-200"
          title="Align Left"
        >
          <AlignLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => editor.chain().setTextAlign("center").run()}
          className="cursor-pointer p-2 rounded hover:bg-gray-200"
          title="Align Center"
        >
          <AlignCenter className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => editor.chain().setTextAlign("right").run()}
          className="cursor-pointer p-2 rounded hover:bg-gray-200"
          title="Align Right"
        >
          <AlignRight className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={() => editor.chain().setTextAlign("justify").run()}
          className="cursor-pointer p-2 rounded hover:bg-gray-200"
          title="Justify"
        >
          <AlignJustify className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  )
}
