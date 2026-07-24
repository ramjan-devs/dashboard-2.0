/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { Extension, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Table,
  TableRow,
  TableHeader,
  TableCell,
} from "@tiptap/extension-table";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Trash2,
  Plus,
  Minus,
  Palette,
} from "lucide-react";

// ---------------------------------------------------------------------------
// FontSize custom extension
// ---------------------------------------------------------------------------
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: any) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    } as any;
  },
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

// ---------------------------------------------------------------------------
// Toolbar button
// ---------------------------------------------------------------------------
const ToolbarBtn = ({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
      active
        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
        : "text-gray-500 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-accent hover:text-gray-800 dark:hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element: HTMLElement) =>
          element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },
});

const TIPTAP_EXTENSIONS = [
  StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
  Underline,
  TextStyle,
  FontSize,
  Color,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ["heading", "paragraph", "tableCell", "tableHeader"] }),
  Table.configure({ resizable: true }),
  TableRow,
  CustomTableHeader,
  CustomTableCell,
];

// ---------------------------------------------------------------------------
// TipTapEditor
// ---------------------------------------------------------------------------
const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing...",
  fontSize,
  onFontSizeChange,
}) => {
  const cellBgInputRef = useRef<HTMLInputElement>(null);
  const tablePickerRef = useRef<HTMLDivElement>(null);
  const [tablePickerOpen, setTablePickerOpen] = useState(false);
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const GRID_SIZE = 8;

  // Close picker when clicking outside
  useEffect(() => {
    if (!tablePickerOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (tablePickerRef.current && !tablePickerRef.current.contains(e.target as Node)) {
        setTablePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [tablePickerOpen]);

  const normalize = useCallback((html: string) => {
    if (!html) return "";
    return html
      .replace(/\u2011/g, "-")
      .replace(/&#8209;/g, "-")
      .replace(/\u00a0/g, " ")
      .replace(/&nbsp;/g, " ");
  }, []);

  const editor = useEditor({
    extensions: TIPTAP_EXTENSIONS,
    content: normalize(value),
    editorProps: {
      attributes: {
        class: "tiptap-editor-content",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  // Sync when value changes from outside (e.g. edit modal opening with existing content)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const current = editor.getHTML();
    const normalizedValue = normalize(value);
    const normalizedCurrent = normalize(current);
    if (normalizedValue !== normalizedCurrent) {
      // setContent preserves table HTML natively — no Delta conversion issues
      editor.commands.setContent(normalizedValue, { emitUpdate: false });
    }
  }, [value, editor, normalize]);

  const applyFontSize = useCallback(
    (size: number) => {
      if (!editor) return;
      (editor.chain().focus() as any).setFontSize(`${size}px`).run();
      onFontSizeChange(size);
    },
    [editor, onFontSizeChange],
  );

  const handleFontSizeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 8 || val > 72) return;
    applyFontSize(val);
  };

  if (!editor) {
    return (
      <div className="h-40 bg-gray-50 dark:bg-accent/30 animate-pulse rounded-xl border border-gray-100 dark:border-border flex items-center justify-center text-sm font-semibold text-gray-400">
        Loading Rich Editor...
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Font size control – positioned absolutely at the top-right, opposite the Content label */}
      <div className="absolute right-1 -top-8 z-10 flex items-center">
        <div className="flex items-center gap-1 bg-white dark:bg-card px-2 py-0.5 rounded-lg border border-gray-100 dark:border-border shadow-sm">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider pr-1 border-r border-gray-200 dark:border-border/50">
            px
          </span>
          <button
            type="button"
            onClick={() => applyFontSize(Math.max(8, fontSize - 1))}
            className="p-0.5 hover:bg-gray-100 dark:hover:bg-accent rounded cursor-pointer text-gray-500"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            value={fontSize}
            onChange={handleFontSizeInput}
            className="w-8 text-center bg-transparent font-bold text-xs outline-none text-gray-900 dark:text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => applyFontSize(Math.min(72, fontSize + 1))}
            className="p-0.5 hover:bg-gray-100 dark:hover:bg-accent rounded cursor-pointer text-gray-500"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 dark:border-border shadow-sm overflow-hidden bg-white dark:bg-card focus-within:ring-4 focus-within:ring-blue-50 dark:focus-within:ring-blue-900/20">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50/80 dark:bg-accent/30 border-b border-gray-100 dark:border-border">
          {/* Heading select */}
          <select
            className="text-xs font-semibold bg-transparent text-gray-600 dark:text-muted-foreground outline-none cursor-pointer mr-1"
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                  ? "h2"
                  : editor.isActive("heading", { level: 3 })
                    ? "h3"
                    : "p"
            }
            onChange={(e) => {
              const val = e.target.value;
              if (val === "p") editor.chain().focus().setParagraph().run();
              else
                editor
                  .chain()
                  .focus()
                  .setHeading({ level: parseInt(val[1]) as 1 | 2 | 3 })
                  .run();
            }}
          >
            <option value="p">Normal</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>

          <div className="w-px h-5 bg-gray-200 dark:bg-border mx-1" />

          {/* Formatting */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-gray-200 dark:bg-border mx-1" />

          {/* Text color */}
          <label
            title="Text color"
            className="cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent relative"
          >
            <span className="text-xs font-bold text-gray-600 dark:text-muted-foreground">
              A
            </span>
            <input
              type="color"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={(e) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
            />
          </label>

          {/* Highlight */}
          <label
            title="Highlight color"
            className="cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-accent relative"
          >
            <span className="text-xs font-bold text-yellow-500">H</span>
            <input
              type="color"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={(e) =>
                editor
                  .chain()
                  .focus()
                  .setHighlight({ color: e.target.value })
                  .run()
              }
            />
          </label>

          <div className="w-px h-5 bg-gray-200 dark:bg-border mx-1" />

          {/* Lists */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <List className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Ordered list"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-gray-200 dark:bg-border mx-1" />

          {/* Alignment */}
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </ToolbarBtn>

          <div className="w-px h-5 bg-gray-200 dark:bg-border mx-1" />

          {/* Table Operations Group */}
          <div className="flex flex-wrap items-center gap-0.5 border border-gray-100 dark:border-border/30 rounded-lg p-0.5 bg-gray-100/30 dark:bg-accent/5">
            {/* Insert Table — Grid Picker */}
            <div ref={tablePickerRef} className="relative">
              <button
                type="button"
                title="Insert Table"
                onClick={() => setTablePickerOpen((v) => !v)}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  tablePickerOpen
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-muted-foreground hover:bg-gray-100 dark:hover:bg-accent hover:text-gray-800 dark:hover:text-foreground"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>

              {/* Grid Picker Popup */}
              {tablePickerOpen && (
                <div className="absolute top-full left-0 mt-1.5 z-50 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl shadow-xl p-2.5 select-none">
                  <div
                    className="grid gap-0.5"
                    style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                    onMouseLeave={() => setHoveredCell({ row: 0, col: 0 })}
                  >
                    {Array.from({ length: GRID_SIZE }, (_, rowIdx) =>
                      Array.from({ length: GRID_SIZE }, (_, colIdx) => (
                        <div
                          key={`${rowIdx}-${colIdx}`}
                          className={`w-5 h-5 rounded border cursor-pointer transition-all ${
                            rowIdx < hoveredCell.row && colIdx < hoveredCell.col
                              ? "bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-500"
                              : "bg-gray-50 dark:bg-accent/30 border-gray-200 dark:border-border"
                          }`}
                          onMouseEnter={() =>
                            setHoveredCell({ row: rowIdx + 1, col: colIdx + 1 })
                          }
                          onClick={() => {
                            if (hoveredCell.row > 0 && hoveredCell.col > 0) {
                              editor
                                .chain()
                                .focus()
                                .insertTable({
                                  rows: hoveredCell.row,
                                  cols: hoveredCell.col,
                                  withHeaderRow: true,
                                })
                                .run();
                            }
                            setTablePickerOpen(false);
                            setHoveredCell({ row: 0, col: 0 });
                          }}
                        />
                      ))
                    )}
                  </div>
                  {/* Label */}
                  <div className="mt-2 text-center text-[11px] font-bold text-gray-500 dark:text-muted-foreground tracking-wider">
                    {hoveredCell.row > 0 && hoveredCell.col > 0
                      ? `${hoveredCell.col} × ${hoveredCell.row}`
                      : "0 × 0"}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px h-4 bg-gray-200 dark:bg-border/50 mx-0.5" />

            {/* Columns */}
            <ToolbarBtn
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              title="Insert Column Left"
            >
              <span className="text-[9px] font-bold">+C L</span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              title="Insert Column Right"
            >
              <span className="text-[9px] font-bold">+C R</span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().deleteColumn().run()}
              title="Delete Column"
            >
              <span className="text-[9px] font-bold text-red-500">-Col</span>
            </ToolbarBtn>

            <div className="w-px h-4 bg-gray-200 dark:bg-border/50 mx-0.5" />

            {/* Rows */}
            <ToolbarBtn
              onClick={() => editor.chain().focus().addRowBefore().run()}
              title="Insert Row Above"
            >
              <span className="text-[9px] font-bold">+R A</span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().addRowAfter().run()}
              title="Insert Row Below"
            >
              <span className="text-[9px] font-bold">+R B</span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().deleteRow().run()}
              title="Delete Row"
            >
              <span className="text-[9px] font-bold text-red-500">-Row</span>
            </ToolbarBtn>

            <div className="w-px h-4 bg-gray-200 dark:bg-border/50 mx-0.5" />

            {/* Cell Merging */}
            <ToolbarBtn
              onClick={() => editor.chain().focus().mergeCells().run()}
              title="Merge Selected Cells"
            >
              <span className="text-[9px] font-bold">Merge</span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().splitCell().run()}
              title="Split Merged Cell"
            >
              <span className="text-[9px] font-bold">Split</span>
            </ToolbarBtn>

            <div className="w-px h-4 bg-gray-200 dark:bg-border/50 mx-0.5" />

            {/* Headers */}
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleHeaderRow().run()}
              title="Toggle Header Row"
            >
              <span className="text-[9px] font-bold">H-Row</span>
            </ToolbarBtn>
            <ToolbarBtn
              onClick={() => editor.chain().focus().toggleHeaderColumn().run()}
              title="Toggle Header Column"
            >
              <span className="text-[9px] font-bold">H-Col</span>
            </ToolbarBtn>

            <div className="w-px h-4 bg-gray-200 dark:bg-border/50 mx-0.5" />

            {/* Cell BG Color Picker */}
            <button
              type="button"
              onClick={() => cellBgInputRef.current?.click()}
              title="Cell Background Color"
              className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-accent text-gray-500 hover:text-gray-800 dark:hover:text-foreground flex items-center gap-0.5 cursor-pointer text-xs font-semibold"
            >
              <Palette className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[9px] font-bold text-gray-400">BG</span>
              <input
                ref={cellBgInputRef}
                type="color"
                className="sr-only"
                onChange={(e) =>
                  editor
                    .chain()
                    .focus()
                    .setCellAttribute("backgroundColor", e.target.value)
                    .run()
                }
              />
            </button>

            <div className="w-px h-4 bg-gray-200 dark:bg-border/50 mx-0.5" />

            {/* Delete Table */}
            <ToolbarBtn
              onClick={() => editor.chain().focus().deleteTable().run()}
              title="Delete Entire Table"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </ToolbarBtn>
          </div>
        </div>

        {/* ── Editor content ── */}
        <EditorContent
          editor={editor}
          className="tiptap-wrapper"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default TipTapEditor;
