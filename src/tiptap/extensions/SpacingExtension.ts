import type { CommandProps } from '@tiptap/core'
import {Extension} from '@tiptap/core'


declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (height: string) => ReturnType
      unsetLineHeight: () => ReturnType
    }
    paragraphSpacing: {
      setParagraphSpacing: (top: string, bottom: string) => ReturnType
      unsetParagraphSpacing: () => ReturnType
    }
  }
}

export const LineHeight = Extension.create({
  name: 'lineHeight',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight || null,
            renderHTML: attrs =>
              attrs.lineHeight ? { style: `line-height:${attrs.lineHeight}` } : {},
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight:
        (height: string) =>
        ({ commands }: CommandProps) => {
          return commands.updateAttributes('paragraph', { lineHeight: height })
        },
      unsetLineHeight:
        () =>
        ({ commands }: CommandProps) => {
          return commands.updateAttributes('paragraph', { lineHeight: null })
        },
    }
  },
})

export const ParagraphSpacing = Extension.create({
  name: 'paragraphSpacing',

  addGlobalAttributes() {
    return [
      {
        types: ['paragraph'],
        attributes: {
          marginTop: {
            default: null,
            parseHTML: element => element.style.marginTop || null,
            renderHTML: attrs =>
              attrs.marginTop ? { style: `margin-top:${attrs.marginTop}` } : {},
          },
          marginBottom: {
            default: null,
            parseHTML: element => element.style.marginBottom || null,
            renderHTML: attrs =>
              attrs.marginBottom ? { style: `margin-bottom:${attrs.marginBottom}` } : {},
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setParagraphSpacing:
        (top: string, bottom: string) =>
        ({ commands }: CommandProps) => {
          return commands.updateAttributes('paragraph', {
            marginTop: top,
            marginBottom: bottom,
          })
        },
      unsetParagraphSpacing:
        () =>
        ({ commands }: CommandProps) => {
          return commands.updateAttributes('paragraph', {
            marginTop: null,
            marginBottom: null,
          })
        },
    }
  },
})
