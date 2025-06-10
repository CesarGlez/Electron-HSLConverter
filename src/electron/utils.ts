import path from 'path';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function getPathName(inputPath: string): string {

    let fileName = path.basename(inputPath, '.mp4');

    function cleanFileName(name: string) {
      let cleaned = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      cleaned = cleaned.replace(/ñ/g, 'n').replace(/Ñ/g, 'N');

      cleaned = cleaned.replace(/\s+/g, '_');

      cleaned = cleaned.replace(/[^a-zA-Z0-9_-]/g, '');

      return cleaned;
    }

    fileName = cleanFileName(fileName);
    
    return fileName;
}