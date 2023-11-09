import dynamic from "next/dynamic";
import React, { useCallback, useMemo } from "react";
// import SimpleMDE, { SimpleMdeReact } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export default function RichTextEditor({ setValue, value }) {
  const delay = 500000;

  const onChange = useCallback((value) => {
    setValue(value);
  }, []);
  return <SimpleMdeReact value={value} onChange={onChange} options={{}} />;
}
