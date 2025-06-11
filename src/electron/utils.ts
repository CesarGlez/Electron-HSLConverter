import path from 'path';

export function isDev(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function getPathName(inputPath: string): {name: string; format: string} {

  
  const file= path.basename(inputPath);
  const file_slice = file.split('.');

  let fileName = file_slice[0];
  const fileExtension = file_slice[1];

  function cleanFileName(name: string) {
    let cleaned = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    cleaned = cleaned.replace(/ñ/g, 'n').replace(/Ñ/g, 'N');

    cleaned = cleaned.replace(/\s+/g, '_');

    cleaned = cleaned.replace(/[^a-zA-Z0-9_-]/g, '');

    return cleaned;
  }

  fileName = cleanFileName(fileName);

  return {
    name: fileName,
    format: fileExtension 
  };
}