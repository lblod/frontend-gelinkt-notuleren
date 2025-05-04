export default function limitContent(text: string, limit: number) {
  if (!text) return '';
  if (text.length < limit) {
    return text;
  } else {
    return text.slice(0, limit) + '...';
  }
}
