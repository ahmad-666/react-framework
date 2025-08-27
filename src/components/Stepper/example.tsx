import { useState } from 'react';
import Stepper from '.';
import useMediaQuery from '@/hooks/useMediaQuery';

type Step = {
    step: number | string;
    subTitle: string;
    title: string;
    icon: string;
};

const steps: Step[] = [
    {
        step: 1,
        title: 'title#1',
        subTitle: 'subTitle#1',
        icon: 'ph:cloud-duotone'
    },
    {
        step: 2,
        title: 'title#2',
        subTitle: 'subTitle#2',
        icon: 'ph:cloud-lightning-duotone'
    },
    {
        step: 3,
        title: 'title#3',
        subTitle: 'subTitle#3',
        icon: 'ph:cloud-moon-duotone'
    }
];

export default function StepperExample() {
    const isMobile = useMediaQuery('(width: 800px)');
    const [step, setStep] = useState<number>(steps[0].step as number); //value of step can be number or string so we could use 'steps[0].title as string' too
    const isFirstStep = steps.at(0)?.step === step;
    const isLastStep = steps.at(-1)?.step === step;
    const prevStep = () => setStep((old) => Math.max(steps.at(0)?.step as number, old - 1));
    const nextStep = () => setStep((old) => Math.max(old + 1, steps.at(-1)?.step as number));

    return (
        <div>
            <div>
                <p className='text-title-lg'>#1: Stepper + for responsive we hide step content and use smaller step</p>
                <Stepper
                    direction='horizontal'
                    clickable={false}
                    value={step}
                    size={isMobile ? 12 : 'md'}
                    color='violet-600'
                    // icon='' // not set it so step number getting rendered in ui when step is in 'default' state
                    // activeIcon='' // we can use props like color,icon,... for each step too and here each step has its own unique icon
                    completeIcon='ph:check'
                    // stepClassName=''
                    // dividerClassName=''
                    className='mt-5'
                >
                    {steps.map((stp, i) => {
                        const status = i === step ? 'active' : i < step ? 'complete' : 'default';
                        return (
                            <Stepper.Item
                                key={stp.step}
                                value={stp.step}
                                activeIcon={stp.icon}
                                // color='' //each step can have different color but here they will have same color as entire Stepper
                            >
                                {!isMobile && (
                                    <div>
                                        <p className='text-body-sm text-slate-500'>{stp.subTitle}</p>
                                        <p className='text-body-md mt-2 font-semibold text-slate-800'>{stp.title}</p>
                                        <p
                                            className={`mt-2 rounded-full border px-1 py-0.5 ${status === 'default' ? 'border-slate-500 bg-slate-300 text-slate-500' : ''} ${status === 'active' ? 'border-violet-500 bg-violet-300 text-violet-500' : ''} ${status === 'complete' ? 'border-success-500 bg-success-300 text-success-500' : ''}`}
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
                    #2: Clickable Stepper with prev/next buttons and content for each step + for responsive make it
                    vertical step
                </p>
                <Stepper
                    direction={isMobile ? 'vertical' : 'horizontal'} //for mobile we set fixed height
                    clickable
                    value={step}
                    onChange={(value) => setStep(value as number)}
                    size='md'
                    color='cyan-600'
                    // icon='' //because we don't set it then step number will render
                    activeIcon='ph:grid-four-duotone'
                    completeIcon='ph:check'
                    className='tablet:h-auto mt-5 h-200'
                >
                    {steps.map((step) => (
                        <Stepper.Item key={step.step} value={step.step}>
                            <div>
                                <p className='text-body-sm text-slate-500'>{step.subTitle}</p>
                                <p className='text-body-md mt-2 font-semibold text-slate-800'>{step.title}</p>
                            </div>
                        </Stepper.Item>
                    ))}
                </Stepper>
                <div className='text-title-lg mt-5'>
                    {step === 1 && <div>1</div>}
                    {step === 2 && <div>2</div>}
                    {step === 3 && <div>3</div>}
                </div>
                <div className='mt-5 flex items-center justify-between gap-5'>
                    <button disabled={isFirstStep} onClick={prevStep}>
                        prev
                    </button>
                    <button disabled={isLastStep} onClick={nextStep}>
                        next
                    </button>
                </div>
            </div>
        </div>
    );
}
