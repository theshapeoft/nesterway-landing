"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import { cn } from "@/lib/utils";
import {
  TextB,
  TextItalic,
  ListBullets,
  ListNumbers,
} from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  maxLength?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

function ToolbarButton({
  isActive,
  onClick,
  disabled,
  children,
  title,
}: {
  isActive?: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        "hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1",
        isActive && "bg-primary/10 text-primary",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/30 px-2 py-1.5">
      <ToolbarButton
        isActive={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <TextB weight="bold" className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        isActive={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
      >
        <TextItalic weight="bold" className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        isActive={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        <ListBullets weight="bold" className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        isActive={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
      >
        <ListNumbers weight="bold" className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  content,
  onChange,
  maxLength,
  placeholder,
  className,
  disabled,
}: RichTextEditorProps) {
  const isInitialMount = useRef(true);
  const lastContent = useRef(content);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Disable features we don't need
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
        hardBreak: false,
      }),
      ...(maxLength
        ? [CharacterCount.configure({ limit: maxLength })]
        : [CharacterCount]),
    ],
    content,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none px-4 py-3 min-h-[100px] focus:outline-none",
          "[&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1",
          "[&>p:first-child]:mt-0 [&>p:last-child]:mb-0",
          "[&>ul:first-child]:mt-0 [&>ul:last-child]:mb-0",
          "[&>ol:first-child]:mt-0 [&>ol:last-child]:mb-0",
          "text-foreground"
        ),
        "data-placeholder": placeholder || "",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Check if content is just empty paragraph
      const isEmpty = html === "<p></p>" || html === "";
      lastContent.current = isEmpty ? "" : html;
      onChange(isEmpty ? "" : html);
    },
  });

  // Sync content from parent when it changes externally
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (editor && content !== lastContent.current) {
      lastContent.current = content;
      editor.commands.setContent(content || "");
    }
  }, [editor, content]);

  // Update editable state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  const characterCount = editor?.storage.characterCount?.characters() ?? 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-background transition-colors",
        "focus-within:border-transparent focus-within:ring-2 focus-within:ring-primary",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {maxLength && (
        <div className="flex justify-end border-t border-border bg-muted/30 px-3 py-1.5">
          <span
            className={cn(
              "text-xs",
              characterCount >= maxLength
                ? "text-destructive"
                : "text-muted-foreground"
            )}
          >
            {characterCount}/{maxLength}
          </span>
        </div>
      )}
    </div>
  );
}

// Utility function to sanitize HTML
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li"],
    ALLOWED_ATTR: [],
  });
}

// Utility to convert plain text to HTML (for backwards compatibility)
export function plainTextToHtml(text: string): string {
  if (!text) return "";
  // If already contains HTML tags, return as-is
  if (/<[a-z][\s\S]*>/i.test(text)) return text;
  // Convert plain text lines to paragraphs
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => `<p>${line}</p>`)
    .join("");
}

// Utility to strip HTML for plain text display
export function htmlToPlainText(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") {
    // Server-side: basic regex strip
    return html.replace(/<[^>]*>/g, "").trim();
  }
  // Client-side: use DOM
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
}
