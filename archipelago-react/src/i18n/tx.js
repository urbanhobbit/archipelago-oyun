// Resolves a {tr,en} content object (or array of such objects) to the current locale string.
// Non-object values pass through unchanged so plain fields (ids, numbers) stay untouched.
export function tx(field, locale) {
  if (field == null) return field;
  if (Array.isArray(field)) return field.map(f => tx(f, locale));
  if (typeof field === 'object' && ('tr' in field || 'en' in field)) {
    return field[locale] ?? field.tr;
  }
  return field;
}
