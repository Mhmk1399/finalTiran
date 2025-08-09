"use client";
import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import toast from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { CustomEditor } from "@/types/editor";

const MenuButton = ({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2  transition-colors ${
      active ? "bg-white text-black" : "hover:bg-gray-800 text-white"
    }`}
  >
    {children}
  </button>
);

const ColorPickerDropdown = ({
  isOpen,
  onClose,
  onColorSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onColorSelect: (color: string) => void;
}) => {
  const colors = [
    "#000000",
    "#434343",
    "#666666",
    "#999999",
    "#b7b7b7",
    "#cccccc",
    "#d9d9d9",
    "#efefef",
    "#f3f3f3",
    "#ffffff",
    "#980000",
    "#ff0000",
    "#ff9900",
    "#ffff00",
    "#00ff00",
    "#00ffff",
    "#4a86e8",
    "#0000ff",
    "#9900ff",
    "#ff00ff",
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute mt-2 p-2 bg-black border border-white  shadow-xl z-50 w-48">
      <div className="grid grid-cols-10 gap-1">
        {colors.map((color) => (
          <button
            key={color}
            className="w-6 h-6  border border-white hover:scale-110 transition-transform"
            style={{ backgroundColor: color }}
            onClick={() => {
              onColorSelect(color);
              onClose();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (tags.length >= 3) {
      toast.error("شما فقط میتوانید ۳ برچسب اضافه کنید");
      return;
    }

    if (tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        paragraph: { HTMLAttributes: { dir: "auto" } },
        bulletList: false,
        orderedList: false,
      }),
      BulletList.configure({
        keepMarks: true,
        HTMLAttributes: { class: "list-disc ml-4" },
      }),
      OrderedList.configure({
        keepMarks: true,
        HTMLAttributes: { class: "list-decimal ml-4" },
      }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline hover:text-blue-700",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: "left",
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none focus:outline-none min-h-[200px] rtl",
      },
    },

    onUpdate: ({ editor }: { editor: CustomEditor }) => {
      const text = editor.getText();
      const words: string[] = text
        .trim()
        .split(/\s+/)
        .filter((word: string) => word !== "");
      setWordCount(words.length);
    },
  }) as CustomEditor;

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().unsetLink().run();
      return;
    }
    editor?.chain().focus().setLink({ href: url }).run();
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !description || !seoTitle || !editor?.getHTML()) {
      toast.error("لطفا تمام فیلدها را پر کنید");
      return;
    }
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   toast.error("لطفا مجددا وارد شوید");
    //   return;
    // }
    const blogData = {
      title,
      description,
      seoTitle,
      content: editor?.getHTML(),
      image:
        "https://images.pexels.com/photos/1005644/pexels-photo-1005644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // You'll need to handle image upload
      tags,
    };

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // token: token, // The API expects token in headers
        },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        toast.success("بلاگ با موفقیت ایجاد شد");
        setTitle("");
        setDescription("");
        setSeoTitle("");
        setTags([]);
        editor?.commands.clearContent();
      }
    } catch (error) {
      console.error(error);
      toast.error("خطا در ایجاد بلاگ");
    }
  };
  // Reset form

  return (
    <div className="max-w-4xl mx-6 py-16 lg:mx-auto  min-h-screen">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl md:text-4xl font-black my-4 text-center text-black"
      >
        افزودن بلاگ جدید
      </motion.h2>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-base md:text-xl font-medium mb-8 text-center text-gray-400"
      >
        در این قسمت میتوانید بلاگ جدید خود را ایجاد کنید
      </motion.p>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />

      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        <div className="bg-white p-8 border border-gray-300 shadow-lg ">
          <label className="block mb-4 text-xl text-center text-black">
            <span className="text-black font-bold">قسمت سئو</span>
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            className="w-full px-6 py-4 mb-1 text-black  border border-gray-300 bg-white focus:outline-none focus:border-black transition-all duration-300"
            placeholder="عنوان سئو"
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-6 py-4 text-black rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-black transition-all duration-300"
            placeholder="توضیحات کوتاه"
            required
          />
          <div className="space-y-4 mt-5">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                className="w-full px-6 py-4 text-black  border border-gray-300 bg-white outline-none focus:border-black"
                placeholder="برچسبها را وارد کنید..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-black text-white px-6  hover:bg-gray-800 transition-all duration-300"
              >
                <i className="fas fa-plus mt-1.5"></i>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={index}
                  className="bg-black text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="hover:text-red-500 transition-colors"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </motion.span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-8 border border-gray-300 shadow-lg ">
          <label className="block text-2xl font-bold text-black text-center mb-6">
            عنوان بلاگ
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-6 py-4 text-black  border border-gray-300 bg-white focus:outline-none focus:border-black transition-all duration-300"
            placeholder="عنوان بلاگ"
          />

          <div>
            <label className="block text-2xl font-bold text-black text-center my-6">
              محتوای بلاگ
            </label>
            <div className="border border-gray-300  overflow-hidden shadow-lg">
              <div className="bg-black p-4 border-b border-gray-300 flex flex-wrap gap-3">
                <MenuButton
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  active={editor?.isActive("bold")}
                >
                  <i className="fas fa-bold"></i>
                </MenuButton>

                <MenuButton
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  active={editor?.isActive("italic")}
                >
                  <i className="fas fa-italic"></i>
                </MenuButton>

                <MenuButton onClick={setLink} active={editor?.isActive("link")}>
                  <i className="fas fa-link"></i>
                </MenuButton>

                <MenuButton
                  onClick={() => editor?.chain().focus().unsetLink().run()}
                  active={false}
                >
                  <i className="fas fa-unlink"></i>
                </MenuButton>

                {[2, 3, 4, 5].map((level) => (
                  <MenuButton
                    key={level}
                    onClick={() =>
                      editor
                        ?.chain()
                        .focus()
                        .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 })
                        .run()
                    }
                    active={editor?.isActive("heading", { level })}
                  >
                    H{level}
                  </MenuButton>
                ))}

                <div className="relative">
                  <MenuButton
                    onClick={() => setShowTextColorPicker(!showTextColorPicker)}
                    active={showTextColorPicker}
                  >
                    <i className="fas fa-font"></i>
                  </MenuButton>
                  <ColorPickerDropdown
                    isOpen={showTextColorPicker}
                    onClose={() => setShowTextColorPicker(false)}
                    onColorSelect={(color) =>
                      editor?.chain().focus().setColor(color).run()
                    }
                  />
                </div>

                <div className="relative">
                  <MenuButton
                    onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                    active={showBgColorPicker}
                  >
                    <i className="fas fa-fill-drip"></i>
                  </MenuButton>
                  <ColorPickerDropdown
                    isOpen={showBgColorPicker}
                    onClose={() => setShowBgColorPicker(false)}
                    onColorSelect={(color) =>
                      editor?.chain().focus().setHighlight({ color }).run()
                    }
                  />
                </div>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("left").run()
                  }
                  active={editor?.isActive({ textAlign: "left" })}
                >
                  <i className="fas fa-align-left"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("center").run()
                  }
                  active={editor?.isActive({ textAlign: "center" })}
                >
                  <i className="fas fa-align-center"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().setTextAlign("right").run()
                  }
                  active={editor?.isActive({ textAlign: "right" })}
                >
                  <i className="fas fa-align-right"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                  active={editor?.isActive("bulletList")}
                >
                  <i className="fas fa-list-ul"></i>
                </MenuButton>

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                  active={editor?.isActive("orderedList")}
                >
                  <i className="fas fa-list-ol"></i>
                </MenuButton>
              </div>

              <div className="p-6 text-black bg-white">
                <EditorContent editor={editor} />
              </div>

              <div className="mt-2 text-sm text-black text-right border-t border-gray-300 p-4 bg-white">
                تعداد کلمات: {wordCount}
              </div>
            </div>
          </div>
        </div>

        <div className="text-right pt-6">
          <button
            type="submit"
            className="bg-black text-white px-8 py-2.5 border border-white hover:bg-gray-800 w-full  hover:shadow-lg transition-all duration-300 font-bold text-lg"
          >
            انتشار بلاگ
          </button>
        </div>
      </form>
    </div>
  );
}
