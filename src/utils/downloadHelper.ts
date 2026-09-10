/**
 * High quality media downloader for posts, reels, and stories in Blue Instagram.
 */
export async function downloadMediaFile(
  url: string,
  filename: string,
  onStart?: () => void,
  onSuccess?: () => void,
  onError?: (err: unknown) => void
): Promise<boolean> {
  onStart?.();

  // Try fetching blob directly to trigger browser file download with custom filename
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1500);

    onSuccess?.();
    return true;
  } catch (err) {
    // If CORS or origin restriction blocks client-side fetch, gracefully trigger direct download
    console.warn('Direct blob fetch failed, falling back to anchor download:', err);
    try {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      onSuccess?.();
      return true;
    } catch (fallbackErr) {
      console.error('Download fallback failed:', fallbackErr);
      onError?.(fallbackErr);
      return false;
    }
  }
}
