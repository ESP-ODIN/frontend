import { DEV_MARKS_HIDDEN_CLASS, DEV_MARKS_STORAGE_KEY, devMarksEnabled } from "@/components/dev/dev-mark"

/**
 * Applique la préférence « pastilles masquées » avant l'affichage, pour éviter qu'elles
 * clignotent au chargement.
 */
export function DevMarksScript() {
  if (!devMarksEnabled) return null

  const script = `try{if(localStorage.getItem(${JSON.stringify(DEV_MARKS_STORAGE_KEY)})==="1")document.documentElement.classList.add(${JSON.stringify(DEV_MARKS_HIDDEN_CLASS)})}catch(e){}`

  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
