// src/components/DocsIndexList/index.jsx
import React from "react";
import { useCurrentSidebarCategory } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";

export default function DocsIndexList() {
  const category = useCurrentSidebarCategory();

  if (!category) {
    return <p>Loading docs...</p>;
  }

  // Get items from current category
  const items = category?.items || [];

  // Filter and sort by position
  const orderedDocs = items
    .filter((item) => item.type === "link" && item.unlisted != true)
    .sort((a, b) => {
      const getPosNum = (label) => parseInt(label?.match(/^(\d+)/)?.[1] || "0");
      return getPosNum(a.label) - getPosNum(b.label);
    });

  //console.log("items:", items);
  //console.log("orderedDocs:", orderedDocs);

  return (
    <ul className="docs-list">
      {orderedDocs.length === 0 ? (
        <li>No docs found</li>
      ) : (
        orderedDocs.map((link) => (
          <li key={link.id}>
            <Link to={`/docs/${link.docId}`}>{link.label}</Link>
          </li>
        ))
      )}
    </ul>
  );
}
