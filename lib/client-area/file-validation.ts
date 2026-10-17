export const maxFileBytes = 10 * 1024 * 1024;

export function fileContentType(name: string, bytes: Buffer): string | null {
  const extension = name.split('.').at(-1)?.toLowerCase();
  if (extension === 'pdf' && bytes.subarray(0, 5).toString() === '%PDF-') return 'application/pdf';
  if (extension === 'doc' && bytes.subarray(0, 8).equals(Buffer.from([208,207,17,224,161,177,26,225]))) return 'application/msword';
  if (extension === 'docx' && bytes.subarray(0, 4).equals(Buffer.from([80,75,3,4])) && bytes.includes(Buffer.from('word/document.xml')) && bytes.includes(Buffer.from('[Content_Types].xml'))) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (extension === 'png' && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (['jpg','jpeg'].includes(extension ?? '') && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (extension === 'webp' && bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP') return 'image/webp';
  if (extension === 'gif' && ['GIF87a','GIF89a'].includes(bytes.toString('ascii',0,6))) return 'image/gif';
  return null;
}
