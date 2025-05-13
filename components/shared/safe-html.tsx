"use client";

import DOMPurify from "dompurify";

interface SafeHTMLProps {
  html: string;
}

export const SafeHTML: React.FC<SafeHTMLProps> = ({ html }) => {
  const sanitizedHTML = DOMPurify.sanitize(html);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};
