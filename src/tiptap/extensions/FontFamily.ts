import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    FontFamily: {
      setFontFamily: (font: string) => ReturnType
      unsetFontFamily: () => ReturnType
    }
  }
}

const FontFamily = Extension.create({
  name: 'fontFamily',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'], // attach to TextStyle mark
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => element.style.fontFamily || null,
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {}
              return { style: `font-family: ${attributes.fontFamily}` }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontFamily:
        (font: string | null) =>
        ({ chain }) => {
          if (!font) return chain().setMark('textStyle', { fontFamily: null }).run()
          return chain().setMark('textStyle', { fontFamily: font }).run()
        },
      unsetFontFamily:
        () =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { fontFamily: null })
            .removeEmptyTextStyle()
            .run()
        },
    }
  },
})

export default FontFamily
