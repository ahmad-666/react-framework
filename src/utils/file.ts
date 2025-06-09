//? Basics ------------------------------------------
export const mimeToIcon = (mime: string) => {
    //we use vs-code icon pack which has color too
    if (mime.includes('image')) return 'vscode-icons:file-type-image';
    else if (mime.startsWith('video')) return 'vscode-icons:file-type-video';
    else if (mime === 'text/plain') return 'vscode-icons:file-type-text';
    else if (mime === 'application/pdf') return 'vscode-icons:file-type-pdf2';
    else if (
        mime === 'application/msword' ||
        mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
        return 'vscode-icons:file-type-word';
    else if (
        mime === 'application/vnd.ms-powerpoint' ||
        mime === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    )
        return 'vscode-icons:file-type-powerpoint';
    else if (
        mime === 'text/csv' ||
        mime === 'application/vnd.ms-excel' ||
        mime === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
        return 'vscode-icons:file-type-excel';
    else return 'vscode-icons:default-folder'; //default icon if mime not found
};
export const downloadFile = ({ blob, filename, extension }: { blob: Blob; filename: string; extension: string }) => {
    const url = URL.createObjectURL(blob); //generate url from blob which can be use on <a href /> , <img src />
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    link.click();
    link.remove();
};
