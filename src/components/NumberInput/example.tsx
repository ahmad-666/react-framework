import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NumberInput from '.';

export default function NumberInputExample() {
    const [val, setVal] = useState<null | number>(5);
    const { control } = useForm<{ number: null | number }>({ defaultValues: { number: null } });

    return (
        <div>
            <NumberInput
                value={val}
                onChange={(v) => setVal(v)}
                onBlur={(e) => {
                    // consider we have some default value that when user not enter anything we want that default value
                    const defaultValue = 1;
                    const newVal = +e.target.value.replace(/\D/g, '');
                    if (!newVal) setVal(defaultValue);
                }}
                min={0}
                max={100000}
                showArrows
                clearable
            />
            <Controller
                control={control}
                name='number'
                rules={{
                    required: 'field is required',
                    validate(val) {
                        if (typeof val === 'number' && (val >= 0 || val <= 1000)) return true;
                        return 'value should be between 0,1000';
                    }
                }}
                render={({ field, fieldState }) => (
                    <NumberInput
                        {...field}
                        onChange={(val) => field.onChange(val)}
                        showArrows
                        min={0}
                        max={100000}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
        </div>
    );
}
