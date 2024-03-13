/**
 * 下载 blob 文件
 * @param blob 需要下载的文件
 * @param filename 文件名
 */
export function downloadBlobFile(blob: Blob, filename = 'download-file') {
  const blobUrl = window.URL.createObjectURL(blob)
  const elA = Object.assign(document.createElement('a'), {
    style: { display: 'none' },
    href: blobUrl,
    download: filename,
  })

  document.body.appendChild(elA)
  elA.click()

  window.URL.revokeObjectURL(blobUrl)
  document.body.removeChild(elA)
}
