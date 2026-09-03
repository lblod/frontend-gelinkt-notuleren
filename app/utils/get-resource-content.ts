import type PublishedResource from 'frontend-gelinkt-notuleren/models/published-resource';
import type SignedResource from 'frontend-gelinkt-notuleren/models/signed-resource';
import type VersionedNotulen from 'frontend-gelinkt-notuleren/models/versioned-notulen';

/**
 * Get the content of a resource from the `content` member if possible,
 * otherwise by fetching the file from the `file` member
 *
 * @param resource - resource to get the content of
 * @param onError - Optional on-error callback to handle the status code
 **/
export async function getResourceContent(
  resource: SignedResource | PublishedResource | VersionedNotulen,
  onError?: (statusText: string) => void,
) {
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
