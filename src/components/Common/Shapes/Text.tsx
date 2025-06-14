import React, { useEffect, useRef, useState } from "react";
import { Panel, usePanel } from "../../../context/PanelContext";

interface TextProps {
  panel: Panel;
}

const Text: React.FC<TextProps> = ({ panel }) => {
  const { updatePanel } = usePanel();
  const [text, setText] = useState(panel.title || "Double click to edit text");
  const divRef = useRef<HTMLDivElement>(null);

  const {
    style: {
      fillColor = "transparent",
      strokeColor = "#000000",
      strokeWidth = 1,
      fontColor = "#000000",
      fontSize = 16,
      fontWeight = "normal",
      fontStyle = "normal",
      textDecoration = "none",
      borderRadius = 0,
      boxShadow = "none",
    }
  } = panel;

  // Save content on blur
  const handleBlur = () => {
    const newText = divRef.current?.innerText || "";
    setText(newText);
    updatePanel(panel.id, { title: newText });
  };

  useEffect(() => {
    if (panel.title && panel.title !== text) {
      setText(panel.title);
    }
  }, [panel.title]);

  return (
    <div
      ref={divRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      style={{
        width: "100%",
        height: "100%",
        outline: "none",
        backgroundColor: fillColor,
        border: `${strokeWidth}px solid ${strokeColor}`,
        borderRadius,
        color: fontColor,
        fontSize,
        fontWeight,
        fontStyle,
        textDecoration,
        boxShadow,
        padding: "8px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        wordBreak: "break-word",
        cursor: "text"
      }}
    >
      {text}
    </div>
  );
};

export default Text;
