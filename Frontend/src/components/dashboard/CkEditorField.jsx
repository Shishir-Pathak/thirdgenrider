import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
	BlockQuote,
	Bold,
	ClassicEditor,
	Code,
	Essentials,
	Heading,
	HorizontalLine,
	Italic,
	Link,
	List,
	Paragraph,
	RemoveFormat,
	Underline,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const editorConfig = {
	licenseKey: "GPL",
	plugins: [
		BlockQuote,
		Bold,
		Code,
		Essentials,
		Heading,
		HorizontalLine,
		Italic,
		Link,
		List,
		Paragraph,
		RemoveFormat,
		Underline,
	],
	toolbar: [
		"undo",
		"redo",
		"|",
		"heading",
		"|",
		"bold",
		"italic",
		"underline",
		"code",
		"removeFormat",
		"|",
		"link",
		"bulletedList",
		"numberedList",
		"blockQuote",
		"horizontalLine",
	],
};

export default function CkEditorField({
	value = "",
	onChange,
	disabled = false,
	minHeight = 300,
}) {
	return (
		<div
			className="min-w-[200px] max-w-full overflow-x-hidden rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-600 dark:bg-slate-800 [&_.ck-content]:min-h-[300px]"
			style={{ "--editor-min-height": `${minHeight}px` }}
		>
			<CKEditor
				editor={ClassicEditor}
				config={editorConfig}
				data={value || ""}
				disabled={disabled}
				onChange={(_event, editor) => onChange(editor.getData())}
			/>
		</div>
	);
}
