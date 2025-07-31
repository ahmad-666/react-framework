import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import AutoComplete, { type Option } from '.';

type CustomOption = Option & { desc: string };
const options: CustomOption[] = Array.from({ length: 50 }, (_, i) => ({
    value: i + 1,
    label: `item-${i + 1}`,
    desc: 'desc'
}));

const AutoCompleteExample = () => {
    const [val1, setVal1] = useState<null | CustomOption>(null);
    const [val2, setVal2] = useState<null | CustomOption>(null);
    const [val3, setVal3] = useState<CustomOption[]>([]);
    const { control, handleSubmit, reset } = useForm<{ country: null | Option }>({
        defaultValues: { country: null },
        mode: 'onSubmit'
    });
    const [search, setSearch] = useState('5');
    const [menu, setMenu] = useState(true);
    const onSubmit = (data: { country: null | Option }) => {
        reset();
    };

    return (
        <div>
            <div>
                <h5 className='mb-8'>#1: Simple select</h5>
                <AutoComplete
                    mode='select'
                    placeholder='Placeholder'
                    options={options}
                    value={val1}
                    onChange={(newVal) => setVal1(newVal)}
                />
            </div>
            <div>
                <h5 className='mb-8'>#1: Simple autocomplete</h5>
                <AutoComplete
                    labelPos='inside'
                    mode='autocomplete'
                    variant='outline'
                    size='md'
                    // placeholder='Placeholder'
                    label='Label'
                    options={options}
                    clearable
                    value={val2}
                    onChange={(newVal) => setVal2(newVal)}
                />
            </div>
            <div className='mt-20'>
                <h5 className='mb-8'>#2: Multiple combobox with custom valueRender,optionRender:</h5>
                <AutoComplete
                    labelPos='outside'
                    mode='combobox'
                    variant='fill'
                    size='lg'
                    label='Label'
                    options={options}
                    multiple
                    value={val3}
                    onChange={(newVal) => setVal3(newVal)}
                    clearable
                />
            </div>
            <div className='mt-20'>
                <h5 className='mb-8'>
                    #3: Single autocomplete with validation using reach-hook-form and controlled search,menu props:
                </h5>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name='country'
                        rules={{ required: 'required' }}
                        render={({ field, fieldState }) => (
                            <AutoComplete
                                {...field}
                                mode='autocomplete'
                                options={options}
                                value={field.value}
                                onChange={(newVal) => field.onChange(newVal)}
                                search={search}
                                onSearchChange={setSearch}
                                menu={menu}
                                onMenuChange={setMenu}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <button type='submit'>submit</button>
                </form>
            </div>
        </div>
    );
};

export default AutoCompleteExample;
