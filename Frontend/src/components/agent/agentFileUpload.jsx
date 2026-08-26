import { useEffect, useRef, useState } from "react";

export default function AgentFile({
  label = "Hello",
  setFormData,
  name,
  resetKey,
}) {
  const [url, setUrl] = useState(null);
  const inputRef = useRef(null);

  // Reset this component whenever the parent changes resetKey
  useEffect(() => {
    setUrl(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetKey]);

  const handleChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Clean up previous object URL
    if (url) {
      URL.revokeObjectURL(url);
    }

    const imageUrl = URL.createObjectURL(file);

    setUrl(imageUrl);

    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
  };

  const handleClear = (e) => {
    e.stopPropagation();

    // Clear preview
    if (url) {
      URL.revokeObjectURL(url);
    }

    setUrl(null);

    // Clear actual file input
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Clear file from parent form state
    setFormData((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  return (
    <div className="mt-5 h-50 w-full overflow-hidden">
      <div className="flex justify-between">
        <h3 className="mb-2 block text-sm font-medium text-slate-300">
          {label} <span className="text-[#de873c]">*</span>
        </h3>

        <button
          type="button"
          className="cursor-pointer text-sm text-blue-300 underline"
          onClick={handleClear}
        >
          Clear
        </button>
      </div>

      <div
        className={`h-40 w-full cursor-pointer overflow-hidden rounded-lg ${
          !url ? "flex items-center justify-center bg-gray-300" : ""
        }`}
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          name={name}
        />

        {url && (
          <div
            className="
              relative
              h-40
              w-full
              bg-center
              bg-cover
              transition-transform
              duration-300
              hover:scale-110

              after:absolute
              after:inset-0
              after:bg-black
              after:opacity-0
              after:transition-opacity
              after:duration-300
              hover:after:opacity-40

              before:absolute
              before:inset-0
              before:flex
              before:items-center
              before:justify-center
              before:content-['+_Click_to_change_image']
              before:text-xl
              before:font-bold
              before:text-white
              before:bg-[rgba(0,0,0,0.8)]
              before:opacity-0
              before:transition-opacity
              before:duration-200
              hover:before:opacity-100
            "
            style={{
              backgroundImage: `url(${url})`,
            }}
          />
        )}

        {!url && (
          <p className="text-2xl font-bold text-gray-700">
            + Click to add item
          </p>
        )}
      </div>
    </div>
  );
}
