'use client';

export interface ButtonPremiumProps {
    openModalPremium: () => void;
}

export default function ButtonPremium({ openModalPremium }: ButtonPremiumProps) {
    return (
        <button type='button' className='text-[#D2D2D2] hover:opacity-80 w-full text-left block px-4 py-2 text-sm bg-[#CD2E71] rounded-md' onClick={openModalPremium}>Premium</button>
    )
}
