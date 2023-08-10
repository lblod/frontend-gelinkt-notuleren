export default function generateExportFromHtmlBody(filename, htmlBody) {
  var element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(htmlBody),
  );
  element.setAttribute('download', `${filename}.html`);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
