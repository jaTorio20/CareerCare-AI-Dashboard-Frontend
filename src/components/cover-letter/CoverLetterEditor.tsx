// src/components/CoverLetterEditor.tsx
import { useEffect, useState, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {TextStyle} from '@tiptap/extension-text-style'
import FontSize from '@/tiptap/extensions/FontSize'
import EditorMenuBar from './EditorMenubar'
import { LineHeight, ParagraphSpacing } from '@/tiptap/extensions/SpacingExtension'
import TextAlign from '@tiptap/extension-text-align'
import FontFamily from '@/tiptap/extensions/FontFamily'

type Props = {
  initialHTML: string
  onChange?: (html: string) => void
  editable?: boolean
}

export default function CoverLetterEditor({ initialHTML, onChange, editable }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [autoZoom, setAutoZoom] = useState(true)

  const PAGE_WIDTH = 816
  const PAGE_HEIGHT = 900

  function getZoomForScreen() {
    if (window.innerWidth >= 1068) return 100
    if (window.innerWidth >= 798) return 75
    return 50
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        code: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        heading: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      ParagraphSpacing,
      LineHeight,
      TextStyle,
      FontSize,
      FontFamily,
    ],
    content: initialHTML,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && typeof initialHTML === "string" && !editor.isFocused) {
      editor.commands.setContent(initialHTML)
    }
  }, [initialHTML, editor])

  // Track container width for responsive scaling
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth)
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Auto zoom based on screen size
  useEffect(() => {
    if (!autoZoom || containerWidth === 0) return

    let newZoom = 100
    if (containerWidth >= 1024) newZoom = 100
    else if (containerWidth >= 768) newZoom = 75
    else newZoom = 50

    setZoom(newZoom)
  }, [containerWidth, autoZoom])

  // Auto zoom stops if user adjust on its own
  useEffect(() => {
    if (!autoZoom) return

    const updateZoom = () => {
      setZoom(getZoomForScreen())
    }

    updateZoom()
    window.addEventListener("resize", updateZoom)

    return () => window.removeEventListener("resize", updateZoom)
  }, [autoZoom])

  if (!editor) return null

   const scale = Math.min(zoom / 100, containerWidth / PAGE_WIDTH)

  return (
    <div className="w-full" ref={containerRef}>
      {/* Toolbar — full width, sticky */}
      <div className=" bg-white border-b border-gray-600">
        <EditorMenuBar editor={editor} zoom={zoom} 
            setZoom={(z: number) => {
            setAutoZoom(false)
            setZoom(z)
          }}
        />
      </div>

      {/* Page container */}
      <div className="flex overflow-x-auto py-6 justify-center">
        <div 
          style={{
            width: PAGE_WIDTH * scale,
            height: PAGE_HEIGHT * scale,
            minWidth: 200,
          }}
        >
          <div className=''
            style={{
              width: PAGE_WIDTH,
              height: PAGE_HEIGHT,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <EditorContent
              editor={editor}
              className=" outline-none h-full"
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault()
                  editor.commands.insertContent("\u00A0\u00A0\u00A0\u00A0")
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>

  )
}
