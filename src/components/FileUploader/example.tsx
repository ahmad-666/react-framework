import { useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import FileUploader from '.';

type Fields = {
    files: File[];
};
const MAX_FILES_COUNT = 3;
const MAX_FILE_SIZE_MB = 1; //in megabytes
const ACCEPTED_MIME_TYPES = ['image/png', 'image/jpeg'];

export default function FileUploaderExample() {
    const [file, setFile] = useState<null | File>(null);
    const { control, handleSubmit } = useForm<Fields>({
        defaultValues: {
            files: []
        }
    });
    const onSubmit = ({ files }: Fields) => {};

    return (
        <div>
            <div>
                <p>#1: Simple inline Single File Uploader</p>
                <FileUploader
                    variant='inline'
                    override //for multiple:false --> override:true means always apply new file even file is empty(null,undefined)
                    multiple={false}
                    onChange={(newFiles) => setFile(newFiles[0] || null)}
                    accept='image/*'
                    color='orange-600'
                    className='mt-4'
                />
                {!!file && (
                    <a
                        target='_blank'
                        href={URL.createObjectURL(file)}
                        className='text-body-sm line-clamp-1 max-w-50 text-slate-400'
                    >
                        {file.name}
                    </a>
                )}
            </div>
            <div className='mt-10'>
                <p>
                    #2: Multiple outline File Uploader with override option + validation with react-hook-form for
                    mime,size,number of files
                </p>
                <form onSubmit={handleSubmit(onSubmit)} className='mt-4'>
                    <Controller
                        control={control}
                        name='files'
                        rules={{
                            validate: (files) => {
                                if (!files.length) return 'field is required';
                                else if (files.length > MAX_FILES_COUNT) return `max files count is ${MAX_FILES_COUNT}`;
                                else if (files.some((file) => file.size > MAX_FILE_SIZE_MB * 1024 * 1024))
                                    return `max file size is ${MAX_FILE_SIZE_MB}mb`;
                                else if (files.some((file) => !ACCEPTED_MIME_TYPES.includes(file.type)))
                                    return `only ${ACCEPTED_MIME_TYPES.join(', ')} files are acceptable`;
                                return true;
                            }
                        }}
                        render={({ field, fieldState }) => (
                            <div>
                                <FileUploader
                                    id='id'
                                    name='name'
                                    variant='outline'
                                    value={field.value} //only set it we actually have it
                                    multiple
                                    override={false} //for multiple:true --> override:false means append new files to old files instead of override
                                    onChange={(newFiles) => field.onChange(newFiles)}
                                    accept={ACCEPTED_MIME_TYPES.join(', ')}
                                    label='Upload Image'
                                    color='fuchsia-600'
                                    icon='solar:cloud-upload-bold-duotone'
                                    title='Upload'
                                    description='You can upload or drag & drop png,jpeg images'
                                    readOnly={false}
                                    disabled={false}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                >
                                    <p className='text-fuchsia-800'>
                                        max file size can be {MAX_FILE_SIZE_MB}mb and max number of files can be{' '}
                                        {MAX_FILES_COUNT}
                                    </p>
                                </FileUploader>
                                <div className='mt-4 divide-y divide-slate-200'>
                                    {field.value.map((file, i) => (
                                        <div key={i} className='flex items-center gap-6 py-2'>
                                            <a
                                                target='_blank'
                                                href={URL.createObjectURL(file)}
                                                className='inline-flex items-center gap-2'
                                            >
                                                <Image
                                                    src={URL.createObjectURL(file)}
                                                    alt={file.name}
                                                    width={100}
                                                    height={100}
                                                    className='w-15 rounded-sm'
                                                />
                                                <p className='line-clamp-1'>{file.name}</p>
                                            </a>
                                            <button
                                                onClick={() => field.onChange(field.value.filter((_, j) => j !== i))}
                                                className='text-red-600'
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    />
                    <button type='submit' className='mt-4'>
                        submit
                    </button>
                </form>
            </div>
        </div>
    );
}
