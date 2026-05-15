"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createPilgrimageText } from "@/utils/pilgrimageContent";

const PilgrimageContentContext = createContext(null);

/**
 * @param {object} props
 * @param {string} props.namespace - "haj" | "omra"
 * @param {object|null} props.content - Strapi page content JSON
 * @param {object|null} props.media - Strapi media URLs JSON
 */
export function PilgrimageContentProvider({
  children,
  namespace,
  content,
  media,
}) {
  const { t } = useTranslation();

  const value = useMemo(
    () => ({
      namespace,
      content: content || null,
      media: media || null,
      pt: createPilgrimageText(content, namespace, t),
      hasStrapiContent: Boolean(content),
    }),
    [namespace, content, media, t],
  );

  return (
    <PilgrimageContentContext.Provider value={value}>
      {children}
    </PilgrimageContentContext.Provider>
  );
}

export function usePilgrimageContent() {
  const ctx = useContext(PilgrimageContentContext);
  if (!ctx) {
    throw new Error(
      "usePilgrimageContent must be used within PilgrimageContentProvider",
    );
  }
  return ctx;
}
