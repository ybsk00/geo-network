import type { ComponentType } from "react";
import type { BlogTemplateProps, TemplateId } from "@/lib/blog-templates/shared/types";
import { ClinicalDocs } from "./templates/ClinicalDocs";
import { ModernMinimal } from "./templates/ModernMinimal";
import { WarmLifestyle } from "./templates/WarmLifestyle";
import { DarkEditorial } from "./templates/DarkEditorial";
import { EditorialSerif } from "./templates/EditorialSerif";
import { MagazineCover } from "./templates/MagazineCover";
import { BoldDisplay } from "./templates/BoldDisplay";
import { NewspaperClassic } from "./templates/NewspaperClassic";
import { PhotoJournal } from "./templates/PhotoJournal";
import { TechMono } from "./templates/TechMono";

export const TEMPLATES: Record<TemplateId, ComponentType<BlogTemplateProps>> = {
  "clinical-docs": ClinicalDocs,
  "modern-minimal": ModernMinimal,
  "warm-lifestyle": WarmLifestyle,
  "dark-editorial": DarkEditorial,
  "editorial-serif": EditorialSerif,
  "magazine-cover": MagazineCover,
  "bold-display": BoldDisplay,
  "newspaper-classic": NewspaperClassic,
  "photo-journal": PhotoJournal,
  "tech-mono": TechMono,
};
