import { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline,
} from "lucide-react"

type Props = {
  editor: Editor | null
  zoom: number
  setZoom: (z: number) => void
}

export default function EditorMenuBar({ editor, zoom, setZoom}: Props) {
  if (!editor) return null

  const sizes = ["10pt", "12pt", "14pt", "16pt", "18pt", "20pt", "24pt"]
  const zoomLevels = [50, 55, 65, 75, 85, 100]
  const fontList = ["Arial, sans-serif", "Times New Roman, serif", "Georgia, serif", "Calibri, sans-serif"]
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4 bg-gray-100 p-2 rounded-lg shadow-sm">
      
      {/* Font Family */}
      <div className="flex items-center gap
       shadow-sm rounded">
        <select
          onChange={(e) => editor.chain().setFontFamily(e.target.value).run()}
          defaultValue=""
          className="cursor-pointer rounded focus:outline-none
           border-gray-300 text-sm "
        >
          <option value="" disabled>Font Family</option>
          {fontList.map((f) => (
            <option key={f} value={f}>
              {f.split(",")[0]} {/* show readable name */}
            </option>
          ))}
        </select>
        <button
          onClick={() => editor.chain().unsetFontFamily().run()}
          className="px-2 py-1 text-xs rounded bg-gray-200 hover:bg-gray-300"
        >
          Reset
        </button>
      </div>
      
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
      <div className="flex items-center gap-2 shadow-sm">
        <select
          onChange={(e) => editor.chain().setFontSize(e.target.value).run()}
          defaultValue=""
          className="cursor-pointer rounded focus:outline-none
           border-gray-300 text-sm"
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
      <div className="flex items-center gap-2 shadow-sm">
        <select
          onChange={(e) => editor.chain().setLineHeight(e.target.value).run()}
          defaultValue=""
          className="
          cursor-pointer focus:outline-none
           rounded text-sm"
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
      <div className="flex items-center gap-2 shadow-sm">
        <select
          onChange={(e) => {
            const [top, bottom] = e.target.value.split(",")
            editor.chain().setParagraphSpacing(top, bottom).run()
          }}
          defaultValue=""
          className="focus:outline-none
          cursor-pointer rounded
           border-gray-300 text-sm"
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
      <div className="flex items-center gap-2 shadow-sm">
        <select
          onChange={(e) => {
            const alignment = e.target.value;
            if (alignment) {
              editor.chain().setTextAlign(alignment as "left" | "center" | "right" | "justify").run();
            }
          }}
          defaultValue=""
          className="cursor-pointer rounded focus:outline-none border border-gray-300 text-sm px-2 py-1"
        >
          <option value="" disabled>
            Text Alignment
          </option>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-2 shadow-sm">
        <select
          onChange={(e) => {
            const zoomValue = parseInt(e.target.value);
            if (!isNaN(zoomValue)) {
              setZoom(zoomValue);
            }
          }}
          value={zoom}
          className="cursor-pointer rounded focus:outline-none border border-gray-300 text-sm px-2 py-1"
        >
          {zoomLevels.map((z) => (
            <option key={z} value={z}>
              {z}%
            </option>
          ))}
        </select>
      </div>

    </div>
  )
}
