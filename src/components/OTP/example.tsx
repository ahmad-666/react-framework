import { useForm, Controller } from 'react-hook-form';
import Form from '@/components/Form';
import OTP from '@/components/OTP';

const OTPExample = () => {
    const { control, reset, handleSubmit } = useForm<{ otp: string }>({ defaultValues: { otp: '' }, mode: 'onSubmit' });
    const onSubmit = () => {
        reset();
    };

    return (
        <div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    control={control}
                    name='otp'
                    rules={{ required: 'required', minLength: { value: 5, message: 'min length is 5' } }}
                    render={({ field, fieldState }) => (
                        <OTP
                            type='text'
                            value={field.value}
                            onChange={(newVal) => field.onChange(newVal)}
                            length={5}
                            placeholder='12345'
                            label='OTP'
                            variant='outline'
                            size='md'
                            color='sky-600'
                            readOnly={false}
                            disabled={false}
                            error={!!fieldState.error}
                            message={fieldState.error?.message}
                        />
                    )}
                />
                <button type='submit'>submit</button>
            </Form>
        </div>
    );
};

export default OTPExample;
