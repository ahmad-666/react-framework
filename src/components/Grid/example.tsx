import React from 'react';

export default function GridExample() {
    return (
        <div>
            <div className='mobile:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 desktop:grid-cols-5 laptop:gap-10 grid grid-cols-1 gap-5'>
                {Array.from({ length: 10 }).map((_, index) => (
                    <div
                        key={index}
                        className='text-title-lg flex items-center justify-center rounded-lg bg-stone-800 p-10 text-white'
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

//? Because we use tailwind then no need for creating separate Grid component
