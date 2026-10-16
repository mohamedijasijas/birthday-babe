export const chapterPages = ['welcome', 'memories', 'reasons', 'voice', 'future', 'birthday'];

export function pageFromHash(hash) {
  const page = hash.replace(/^#\/?/, '').replace(/\/$/, '');
  return chapterPages.includes(page) ? page : 'welcome';
}
