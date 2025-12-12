// src/components/CoverLetterEditor.tsx
import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {TextStyle} from '@tiptap/extension-text-style'
import FontSize from '@/tiptap/extensions/FontSize'
import EditorMenuBar from './EditorMenubar'

type Props = {
  initialHTML: string
  onChange?: (html: string) => void
  editable?: boolean
}

export default function CoverLetterEditor({ initialHTML, onChange, editable }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        heading: false,
      }),

      TextStyle,   // required for font size
      FontSize,    // custom font size extension
    ],
    content: initialHTML,
    editable: editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

useEffect(() => {
  if (editor && typeof initialHTML === 'string') {
    // Only reset if editor is NOT focused (so you don't overwrite while typing)
    if (!editor.isFocused) {
      editor.commands.setContent(initialHTML)
    }
  }
}, [initialHTML, editor])

  if (!editor) return null

  return (
    <div>
      <EditorMenuBar editor={editor} />
      <div>
        <EditorContent 
        editor={editor} 
        onKeyDown={(e) => {
        if (e.key === 'Tab') {
          e.preventDefault()
          editor.commands.insertContent('\u00A0\u00A0\u00A0\u00A0') // 4 spaces
        }
  }}/>
      </div>
    </div>
  )
}
