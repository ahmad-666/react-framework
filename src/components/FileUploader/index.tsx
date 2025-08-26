'use client';

import { useState, useEffect, type ReactNode, type ChangeEvent, type DragEvent, type CSSProperties } from 'react';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import FormLabel from '@/components/FormLabel';
import FormMessage from '@/components/FormMessage';
import useColor from '@/hooks/useColor';

type Variant = 'inline' | 'outline';
type Props = {
    id?: string;
    name?: string;
    /** inline for simple button uploader , outline for advances features such as drag & drop container box with and children */
    variant?: Variant;
    multiple?: boolean;
    /** for both multiple:false|true we have File[] for value prop
     *
     *  we should specially set it for multiple:true+override:false cases
     * */
    value?: File[];
    /** just like vanilla onChange event of input[type="file"] we return File[] even for multiple:false */
    onChange?: (files: File[]) => void;
    /**
     * useful for both multiple:false|true
     *
     * for multiple:false --> if true we override previously uploaded file when new file arrives even if new file is empty | null | undefined else we only set valid file as value
     *
     * for multiple:true --> if true we override previously uploaded file(s) else we append new file(s) to old file(s)
     *  */
    override?: boolean;
    /** 'accept' attribute for input[type='file'] ... e.g 'image/*, video/mp4' */
    accept?: string;
    label?: string;
    color?: string;
    /** only for variant:'outline' */
    icon?: string;
    /** only for variant:'outline' */
    title?: string;
    /** only for variant:'outline' */
    description?: string;
    readOnly?: boolean;
    disabled?: boolean;
    hideMessage?: boolean;
    error?: boolean;
    helperText?: string;
    children?: ReactNode;
    containerClassName?: string;
    className?: string;
};

export default function FileUploader({
    id,
    name,
    variant = 'inline',
    multiple = false,
    value = [],
    onChange,
    override = false,
    accept = '*/*',
    label,
    color = 'sky-600',
    icon = 'solar:cloud-upload-bold-duotone',
    title = 'Upload File',
    description = 'Click to upload or drag and drop',
    readOnly = false,
    disabled = false,
    hideMessage = false,
    error = false,
    helperText,
    children,
    containerClassName = '',
    className = ''
}: Props) {
    const parsedColor = useColor(color);
    const [files, setFiles] = useState<File[]>(value);
    const [dragging, setDragging] = useState(false);
    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const uploadedFiles = Array.from(e.target.files || []) as File[];
        let newFiles: null | File[] = [];
        if (!multiple) newFiles = override ? [uploadedFiles[0]] : uploadedFiles[0] ? [uploadedFiles[0]] : null;
        else newFiles = override ? uploadedFiles : [...files, ...uploadedFiles];
        if (Array.isArray(newFiles)) {
            setFiles(newFiles);
            onChange?.(newFiles);
        }
    };
    const onDragOver = (e: DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        setDragging(true);
    };
    const onDragLeave = (e: DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        setDragging(false);
    };
    const onDrop = (e: DragEvent<HTMLInputElement>) => {
        e.preventDefault();
        setDragging(false);
        const dropFiles = Array.from(e.dataTransfer.files || []) as File[];
        let newFiles: null | File[] = [];
        if (!multiple) newFiles = override ? [dropFiles[0]] : dropFiles[0] ? [dropFiles[0]] : null;
        else newFiles = override ? dropFiles : [...files, ...dropFiles];
        if (Array.isArray(newFiles)) {
            setFiles(newFiles);
            onChange?.(newFiles);
        }
    };
    useEffect(() => {
        setFiles(value);
    }, [JSON.stringify(value)]); // use JSON.stringify to avoid infinite re-render

    return (
        <div
            className={`inline-block ${readOnly ? 'pointer-events-none' : ''} ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
            style={
                {
                    '--color': parsedColor
                } as CSSProperties
            }
        >
            <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
                {/* because we use <label> <input type="file" /> </label> then using id is not required */}
                <label htmlFor={id} className='cursor-pointer'>
                    <input
                        id={id}
                        name={name}
                        type='file'
                        hidden
                        multiple={multiple}
                        accept={accept}
                        readOnly={readOnly}
                        disabled={disabled}
                        onChange={onFileChange}
                        className='hidden h-0 w-0 opacity-0'
                    />
                    {!!label && (
                        <FormLabel component='p' className='mb-3'>
                            {label}
                        </FormLabel>
                    )}
                    {variant === 'inline' && (
                        <Button
                            component='div'
                            variant='fill'
                            size='md'
                            color={color}
                            className={`${containerClassName}`}
                        >
                            {dragging ? 'Drop here' : children || 'File Uploader ...'}
                        </Button>
                    )}
                    {variant === 'outline' && (
                        <div
                            className={`flex flex-col items-center justify-center gap-3 overflow-hidden rounded-md border border-dashed p-12 transition-colors duration-150 ${!dragging ? 'border-slate-400 bg-slate-200' : 'border-(--color) bg-[color-mix(in_srgb,var(--color),white_85%)]'} ${containerClassName}`}
                        >
                            <Icon icon={icon} size={60} color={color} />
                            <p className='text-title-lg text-center text-slate-800'>{dragging ? 'Drop Here' : title}</p>
                            <p className='text-body-md text-center text-slate-400'>{description}</p>
                            {children}
                        </div>
                    )}
                </label>
            </div>
            {!hideMessage && (
                <FormMessage error={error} className='mt-3'>
                    {helperText}
                </FormMessage>
            )}
        </div>
    );
}

//? We handle thumbnails , clickable links , ... on parent
