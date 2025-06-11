import { isDev } from '../../electron/utils';

export const upload_file = {
   url: isDev() ? '/icons/upload-file.png' : '/dist-react/icons/upload-file.png',
   alt: 'upload-file-icon',
}

export const add_icon = {
   url: isDev() ? '/icons/add-icon.png' : '/dist-react/icons/add-icon.png',
   alt: 'add-icon',
}