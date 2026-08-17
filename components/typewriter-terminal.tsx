"use client";

import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";

export function TypewriterTerminal({ codeString }: { codeString: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(codeString.slice(0, i));
      i++;
      if (i > codeString.length) {
        clearInterval(interval);
      }
    }, 45); // 45ms per character

    return () => clearInterval(interval);
  }, [codeString]);

  // Highlight the progressively revealed string
  const highlightedCode = Prism.highlight(displayed, Prism.languages.typescript, "typescript");

  return (
    <pre className="terminal-body" style={{ background: "transparent", margin: 0, padding: "8px", minHeight: "140px" }}>
      <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      {/* Blinking cursor */}
      <span className="inline-block w-2 h-4 ml-1 align-middle bg-green-400 animate-pulse" />
    </pre>
  );
}