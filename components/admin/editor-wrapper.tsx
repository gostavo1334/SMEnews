'use client'

import React from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

class MyUploadAdapter {
  loader: any;
  constructor(loader: any) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then((file: File) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ default: reader.result });
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    }));
  }
  abort() {}
}

function MyCustomUploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new MyUploadAdapter(loader);
  };
}

interface EditorWrapperProps {
  data: string;
  onChange: (data: string) => void;
}

export default function EditorWrapper({ data, onChange }: EditorWrapperProps) {
  return (
    <div className="min-h-[400px] prose prose-sm dark:prose-invert max-w-none">
      <CKEditor
        editor={ClassicEditor as any}
        data={data}
        onChange={(_event, editor) => {
          const data = editor.getData()
          onChange(data)
        }}
        config={{
          placeholder: 'សរសេរខ្លឹមសារអត្ថបទរបស់អ្នកនៅទីនេះ...',
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: [
            'heading', '|', 
            'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 
            'imageUpload', 'blockQuote', 'insertTable', 'mediaEmbed', '|', 
            'undo', 'redo'
          ],
        }}
      />
    </div>
  )
}
