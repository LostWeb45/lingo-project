import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";

export const RichTextEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      OrderedList,
      Heading.configure({ levels: [1, 2, 3] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded p-2 space-y-2">
      <div className="flex space-x-2 border-b pb-2">
        <button
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          **B**
        </button>
        <button
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>
        <button
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • Bullet List
        </button>
        <button
          className="px-2 py-1 bg-gray-200 rounded"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. Ordered List
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};
