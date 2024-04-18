/**
 * Get the content of a resource from the `content` member if possible,
 * otherwise by fetching the file from the `file` member
 *
 * @param {SignedResourceModel | PublishedResourceModel | VersionedNotulenModel} resource - resource to get the content of
 * @param {(statusText: string) => void} - Optional on-error callback to handle the status code
 **/
export async function getResourceContent(resource, onError) {
  if (resource?.content) {
    return resource.content;
  } else {
    const fileMeta = await resource.file;
    if (fileMeta && fileMeta.downloadLink) {
      const fileReq = await fetch(fileMeta.downloadLink);
      if (fileReq.ok) {
        return fileReq.text();
      } else {
        onError?.(fileReq.statusText);
      }
    }
  }
}
