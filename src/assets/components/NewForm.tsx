import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    accountType: z.enum(['individual', 'startup', 'established business', 'agency/partner'], 'invalid option, Please select a valid one!')
})

type FormData = z.infer<typeof formSchema>

const NewForm = () => {

    const [formData, setFormData] = React.useState<FormData>({})
    const [steps, setSteps] = React.useState([1, 2, 3, 4, 5, 6, 7, 8])
    const [currentStep, setCurrentStep] = React.useState(1)

    const { register, handleSubmit, watch, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: formData,
        mode: 'onTouched'
    })
    const formSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data, 'now', getValues())
    }
    const accountType = watch('accountType');

    const handleNext = () => {
        const value = getValues();
        if (!accountType) return
        if (currentStep < steps.length) {
            setFormData(prev => {
                const merged = { ...prev, ...value }
                console.log('saved snapshot', merged)
                return merged
            })
            setCurrentStep(prev => prev + 1)
        }
    }
    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1)
        }
    }
    return (
        <div className='w-full min-h-screen grid place-items-center'>
            <div className='w-[94vw] md:w-[80vw] lg:w-[1280px] min-h-[80vh] max-h-[90vh] flex rounded-2xl shadow-2xl shadow-gray-300'>
                <div className='hidden md:block md:w-2/5  bg-gray-900 rounded-l-2xl'>
                    <div className='p-8 flex flex-col items-start justify-center w-full h-full gap-6'>
                        <h1 className='text-purple-300 text-2xl sm:text-3xl lg:text-4xl font-bold'>The Great Saas Company</h1>
                        <p className='text-purple-50 leading-relaxed text-lg'>We offer the best AI automation service in the entire world. Kindly sign up to enjoy the best services </p>
                        <p className='h-12 w-44 bg-purple-300 flex items-center justify-center text-gray-800 text-sm font-bold rounded-md'>Get Started Here <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 ml-3">
                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                        </p>
                    </div>
                </div>
                <div className='w-full md:w-3/5 bg-gray-100 rounded-l-2xl md:rounded-l-none rounded-r-2xl'>
                    <div className='p-12 h-full'>
                        <div className='h-2/12'>
                            <h2 className='text-xl md:text-2xl mb-6'>Onboarding Process...</h2>
                        </div>
                        <div className='h-10/12'>
                            <form onSubmit={handleSubmit(formSubmit)} className='h-full'>
                                <div className='h-11/12'>
                                    <div>
                                        {currentStep === 1 &&
                                            <div>
                                                <fieldset>
                                                    <legend className='text-lg'>Select account type:</legend>
                                                    <div className='mt-4 flex flex-col gap-3'>
                                                        <label htmlFor='individual' className={`flex items-center h-10 rounded-md px-3 cursor-pointer ${accountType === "individual" ? "bg-purple-300" : "bg-gray-200"
                                                            } focus-within:ring-2 focus-within:ring-purple-500`}>
                                                            <input id='individual' {...register('accountType')} className='h-4 w-4 hidden sr-only' type='radio' name='accountType' value="individual"></input>
                                                            <span className='ml-1 flex gap-2 items-center justify-center'>Individual {accountType === "individual" && <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>}</span>
                                                        </label>
                                                        <label htmlFor='startup' className={`flex items-center h-10 rounded-md px-3 cursor-pointer ${accountType === "startup" ? "bg-purple-300" : "bg-gray-200"
                                                            } focus-within:ring-2 focus-within:ring-purple-500`}>
                                                            <input id='startup' {...register('accountType')} className='h-4 w-4 hidden sr-only' type='radio' name='accountType' value="startup"></input>
                                                            <span className='ml-1 flex gap-2 items-center justify-center'>Startup {accountType === "startup" && <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>}</span>
                                                        </label>
                                                        <label htmlFor='established-business' className={`flex items-center h-10 rounded-md px-3 cursor-pointer ${accountType === "established business" ? "bg-purple-300" : "bg-gray-200"
                                                            } focus-within:ring-2 focus-within:ring-purple-500 `}>
                                                            <input id='established-business' {...register('accountType')} className='h-4 w-4 hidden sr-only' type='radio' name='accountType' value="established business"></input>
                                                            <span className='ml-1 flex gap-2 items-center justify-center'>Established Business {accountType === "established business" && <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>}</span>
                                                        </label>
                                                        <label htmlFor='agency-partner' className={`flex items-center h-10 rounded-md px-3 cursor-pointer ${accountType === "agency/partner" ? "bg-purple-300" : "bg-gray-200"
                                                            } focus-within:ring-2 focus-within:ring-purple-500 `}>
                                                            <input id='agency-partner' {...register('accountType')} className='h-4 w-4 hidden sr-only' type='radio' name='accountType' value="agency/partner"></input>
                                                            <span className='ml-1 flex gap-2 items-center justify-center'>Agency/Partner {accountType === "agency/partner" && <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>}
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className='h-8 mt-4 ml-2 text-sm text-red-600 font-bold'>
                                                        {errors.accountType && <span>{errors.accountType.message}</span>}
                                                    </div>

                                                </fieldset>
                                            </div>}

                                        {currentStep === 2 && <div> This is current step 2 {formData.accountType} </div>}
                                        {currentStep === 3 && <div> This is current step 3 {formData.accountType} </div>}
                                        {currentStep === 4 && <div> This is current step 4 {formData.accountType} </div>}
                                        {currentStep === 5 && <div> This is current step 5 {formData.accountType} </div>}
                                        {currentStep === 6 && <div> This is current step 6 {formData.accountType} </div>}
                                        {currentStep === 7 && <div> This is current step 7 {formData.accountType} </div>}
                                        {currentStep === 8 && <div> This is current step 8 {formData.accountType} </div>}
                                    </div>
                                </div>
                                <div className='h-1/12 flex justify-between'>
                                    <div className='flex gap-4'>
                                        <button type='submit' className='h-10 w-20 text-sm font-bold bg-purple-300'>Submit</button>
                                        <button type='button' className='h-10 w-20 text-sm font-bold bg-purple-300'>Start</button>

                                    </div>
                                    <div className='flex gap-4'>
                                        <button onClick={handleBack} type='button' className='h-10 w-20 text-sm font-bold bg-purple-300'>Back</button>
                                        <button onClick={handleNext} type='button' className='h-10 w-20 text-sm font-bold bg-purple-300'>Next</button>

                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewForm