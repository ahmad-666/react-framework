import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import TextField from '.';

export default function TextfieldExample() {
    const [val1, setValue1] = useState('');
    const { control, handleSubmit } = useForm<{ desc: string }>({
        defaultValues: {
            desc: ''
        },
        mode: 'onSubmit'
    });
    const onSubmit = () => {};

    return (
        <div>
            <div>
                <h5 className='mb-8'>#1: Textfield example:</h5>
                <TextField
                    variant='fill'
                    size='lg'
                    color='orange-500'
                    value={val1}
                    onChange={(e) => setValue1(e.target.value)}
                    label='label'
                    prependInnerIcon='mdi:user'
                />
            </div>
            <div>
                <h5 className='mb-8'>#2: Textarea example with react-hook-form:</h5>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name='desc'
                        rules={{ required: 'required' }}
                        render={({ field, fieldState }) => (
                            <TextField
                                as='textarea'
                                {...field}
                                placeholder='placeholder'
                                minRows={2}
                                maxRows={5}
                                error={!!fieldState.error}
                                message={fieldState.error?.message}
                            />
                        )}
                    />
                    <button type='submit'>submit</button>
                </form>
            </div>
        </div>
    );
}
