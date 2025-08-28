import { useState } from 'react';
import Stepper from '.';
import useMediaQuery from '@/hooks/useMediaQuery';

type Step = {
    step: number | string;
    subTitle: string;
    title: string;
    icon: string;
    color: string;
};

const steps: Step[] = [
    {
        step: 1,
        title: 'title#1',
        subTitle: 'subTitle#1',
        icon: 'ph:cloud-duotone',
        color: 'violet-600'
    },
    {
        step: 2,
        title: 'title#2',
        subTitle: 'subTitle#2',
        icon: 'ph:cloud-lightning-duotone',
        color: 'pink-600'
    },
    {
        step: 3,
        title: 'title#3',
        subTitle: 'subTitle#3',
        icon: 'ph:cloud-moon-duotone',
        color: 'amber-600'
    }
];

export default function StepperExample() {
    const isMobile = useMediaQuery('(width< 800px)');
    const [step, setStep] = useState<number>(steps[0].step as number); //value of step can be number or string so we could use 'steps[0].title as string' too
    const isFirstStep = steps.at(0)?.step === step;
    const isLastStep = steps.at(-1)?.step === step;
    const prevStep = () => setStep((old) => Math.max(steps.at(0)?.step as number, old - 1));
    const nextStep = () => setStep((old) => Math.min(old + 1, steps.at(-1)?.step as number));

    return (
        <div>
            <div>
                <p className='text-title-lg'>
                    #1: Simple Stepper with custom icon,color per step + for responsive we hide step content and use
                    smaller step
                </p>
                <Stepper
                    direction='horizontal'
                    clickable={false}
                    value={step}
                    size={isMobile ? 22 : 'md'}
                    color='violet-600'
                    // icon='' // not set it so step number getting rendered in ui when step is in 'default' state
                    // activeIcon='' // we can use props like color,icon,... for each step too and here each step has its own unique icon
                    completeIcon='ph:check'
                    // stepClassName=''
                    // dividerClassName=''
                    className='mt-5'
                >
                    {steps.map((stp, i) => {
                        const status = i + 1 === step ? 'active' : i + 1 < step ? 'complete' : 'default';
                        return (
                            <Stepper.Item
                                key={stp.step}
                                value={stp.step}
                                activeIcon={stp.icon} //specific icon per step
                                color={stp.color} //specific color per step
                            >
                                {!isMobile && (
                                    <div className='flex flex-col items-center gap-1.5'>
                                        <p className='text-label-md text-slate-500'>{stp.subTitle}</p>
                                        <p className='text-label-lg font-semibold text-slate-800'>{stp.title}</p>
                                        <p
                                            className={`text-body-sm rounded-full border px-3 py-0.5 ${status === 'default' ? 'border-slate-500 bg-slate-100 text-slate-500' : ''} ${status === 'active' ? 'border-violet-500 bg-violet-100 text-violet-500' : ''} ${status === 'complete' ? 'border-green-500 bg-green-100 text-green-500' : ''}`}
                                        >
                                            {status === 'active'
                                                ? 'Active'
                                                : status === 'complete'
                                                  ? 'Complete'
                                                  : 'Pending'}
                                        </p>
                                    </div>
                                )}
                            </Stepper.Item>
                        );
                    })}
                </Stepper>
            </div>
            <div className='mt-15'>
                <p className='text-title-lg'>
                    #2: Clickable Stepper with same step color,icon and prev/next buttons and content for each step +
                    for responsive make it vertical step
                </p>
                <Stepper
                    direction={isMobile ? 'vertical' : 'horizontal'} //for mobile we set fixed height
                    clickable
                    value={step}
                    onChange={(value) => setStep(value as number)}
                    size='md'
                    color='sky-600'
                    // icon='' //because we don't set it then step number will render
                    activeIcon='ph:grid-four-duotone'
                    completeIcon='ph:check'
                    className='tablet:h-auto mt-5 h-200'
                >
                    {steps.map((step) => (
                        <Stepper.Item key={step.step} value={step.step}>
                            <div className='tablet:items-center flex flex-col items-start gap-1.5'>
                                <p className='text-label-md text-slate-500'>{step.subTitle}</p>
                                <p className='text-label-lg font-semibold text-slate-800'>{step.title}</p>
                            </div>
                        </Stepper.Item>
                    ))}
                    {steps.map((step) => (
                        <Stepper.Content key={step.step} value={step.step} className='text-title-lg'>
                            <div>{step.step}</div>
                        </Stepper.Content>
                    ))}
                </Stepper>
                <div className='mt-5 overflow-hidden'>
                    {/*  prev/next btn are outside of Stepper component  */}
                    <div className='mt-5 flex items-center justify-between gap-5'>
                        <button
                            disabled={isFirstStep}
                            onClick={prevStep}
                            className={`${isFirstStep ? 'pointer-events-none opacity-30' : ''}`}
                        >
                            prev
                        </button>
                        <button
                            disabled={isLastStep}
                            onClick={nextStep}
                            className={`${isLastStep ? 'pointer-events-none opacity-30' : ''}`}
                        >
                            next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
