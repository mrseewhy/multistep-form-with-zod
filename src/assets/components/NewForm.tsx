import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, type SubmitHandler, Controller, type FieldPath } from 'react-hook-form'
import { z } from 'zod'
import ct, { type Country, type Timezone } from 'countries-and-timezones'
import Select, { type SingleValue } from 'react-select'

const sizedata = ['1–5', '6–20', '21–50', '50+'] as const
const web_types = ['Landing Page', 'Marketing Site', 'Ecommerce', 'Blog'] as const

const formSchema = z.object({
    accountType: z.enum(
        ['individual', 'startup', 'established business', 'agency/partner'],
        { message: 'Invalid option, please select a valid one from the options above!' }
    ),
    fullName: z.string().min(4, 'Your full name must be at least 4 characters long'),
    email: z.string().email('Please enter a valid email'),
    country: z.string().min(1, 'Please select a country'),
    timezone: z.string().min(1, 'Please select timezone'),
    companyName: z.string().min(3, 'Your company must be at least 4 characters long').optional().nullable(),
    companySize: z.enum(sizedata).optional().nullable(),
    help: z.array(z.string()).min(1, 'Error! select an item'),
    websitetype: z.enum(web_types).optional(),
    roleCount: z.number().gte(1, 'Number must be 1 or more').optional().nullable(),
    authRequired: z.enum(['yes', 'no']).optional().nullable(),
})

type FormData = z.infer<typeof formSchema>

const NewForm = () => {
    const [formData, setFormData] = React.useState<Partial<FormData>>({})
    const [timeZones, setTimeZones] = React.useState<Timezone[]>([])

    const countryList = React.useMemo<Country[]>(() => {
        return Object.values(ct.getAllCountries()).sort((a, b) =>
            a.name.localeCompare(b.name)
        )
    }, [])

    const countryOptions = countryList.map(country => ({
        value: country.name,
        label: `${country.name} (${country.id})`,
    }))

    const stepFields: Record<number, FieldPath<FormData>[]> = {
        1: ['accountType'],
        2: ['fullName', 'email', 'country', 'timezone', 'companyName', 'companySize'],
        3: ['help', 'websitetype', 'roleCount', 'authRequired'],
    }

    const pageHeadings = [
        'Account Type',
        'Basic Identity',
        'Project Type & Scope',
        'Budget & Timeline Qualification',
        'Technical Preferences',
        'Communication & Availability',
        'Final Review & Submission',
        'Thank You',
    ]

    const steps = [1, 2, 3, 4, 5, 6, 7, 8]
    const [currentStep, setCurrentStep] = React.useState(1)

    const {
        register,
        handleSubmit,
        watch,
        getValues,
        control,
        trigger,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: formData,
        mode: 'onTouched',
        reValidateMode: 'onChange',
    })

    const formSubmit: SubmitHandler<FormData> = data => {
        console.log(data, getValues())
    }

    const accountType = watch('accountType')
    const country = watch('country')
    const help = watch('help') ?? []

    const handleNext = async () => {
        const isValid = await trigger(stepFields[currentStep] ?? [])
        if (!isValid) return

        const value = getValues()

        setFormData(prev => ({ ...prev, ...value }))
        if (currentStep < steps.length) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1)
    }

    const handleBackToStart = () => setCurrentStep(1)

    React.useEffect(() => {
        if (!country) return

        const selected = countryList.find(c => c.name === country)
        if (!selected) return

        const tzs = Object.values(ct.getTimezonesForCountry(selected.id))
        setTimeZones(tzs)
    }, [country, countryList])

    React.useEffect(() => {
        if (accountType === 'individual') {
            setValue('companyName', undefined)
            setValue('companySize', undefined)
        }
    }, [accountType, setValue])

    React.useEffect(() => {
        if (!help.includes('website')) {
            setValue('websitetype', undefined)
        }
    }, [help, setValue])

    React.useEffect(() => {
        if (!help.includes('web app') && !help.includes('mobile app')) {
            setValue('roleCount', undefined)
            setValue('authRequired', undefined)
        }
    }, [help, setValue])

    return (
        <div className='w-full min-h-screen grid place-items-center'>
            <div className='w-[94vw] md:w-[80vw] lg:w-[1280px] min-h-[80vh] max-h-[90vh] flex rounded-2xl shadow-2xl shadow-gray-300'>
                <div className='hidden md:block md:w-2/5  bg-purple-950 rounded-l-2xl'>
                    <div className='p-8 flex flex-col items-start justify-center w-full h-full gap-6'>
                        <h1 className='text-purple-200 text-2xl sm:text-3xl lg:text-4xl font-bold'>The Great Saas Company</h1>
                        <p className='text-purple-50 leading-relaxed text-lg'>We offer the best AI automation service in the entire world. Kindly sign up to enjoy the best services </p>
                        <p className='h-12 w-44 bg-purple-200 flex items-center justify-center text-gray-800 text-sm font-bold rounded-md'>Get Started Here <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 ml-3">
                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                        </svg>
                        </p>
                    </div>
                </div>
                <div className='w-full md:w-3/5 bg-purple-50 rounded-l-2xl md:rounded-l-none rounded-r-2xl'>
                    <div className='p-12 h-full'>
                        <div className='h-2/12 mb-4'>
                            <h2 className='text-xl md:text-2xl  text-purple-950 font-bold'>Onboarding Process...</h2>
                            <p className='text-red-700 font-bold text-sm'>
                                Step {currentStep}: {pageHeadings[currentStep - 1]}
                            </p>
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
                                                        <label htmlFor='individual' className={`flex items-center h-10 rounded-md px-3 cursor-pointer ${accountType === "individual" ? "bg-purple-300 font-semibold" : "bg-purple-100"
                                                            } focus-within:ring-2 focus-within:ring-purple-500`}>
                                                            <input id='individual' {...register('accountType')} className='h-4 w-4 hidden sr-only' type='radio' name='accountType' value="individual"></input>
                                                            <span className='ml-1 flex gap-2 items-center justify-center'>Individual {accountType === "individual" && <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>}</span>
                                                        </label>
                                                        <label htmlFor='startup' className={`flex items-center h-10 rounded-md px-3 cursor-pointer ${accountType === "startup" ? "bg-purple-300 font-semibold" : "bg-purple-100"
                                                            } focus-within:ring-2 focus-within:ring-purple-500`}>
                                                            <input id='startup' {...register('accountType')} className='h-4 w-4 hidden sr-only' type='radio' name='accountType' value="startup"></input>
                                                            <span className='ml-1 flex gap-2 items-center justify-center'>Startup {accountType === "startup" && <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>}</span>
                                                        </label>
                                                        <label htmlFor='established-business' className={`flex items-center h-10 rounded-md px-3 cursor-pointer ${accountType === "established business" ? "bg-purple-300 font-semibold" : "bg-purple-100"
                                                            } focus-within:ring-2 focus-within:ring-purple-500 `}>
                                                            <input id='established-business' {...register('accountType')} className='h-4 w-4 hidden sr-only' type='radio' name='accountType' value="established business"></input>
                                                            <span className='ml-1 flex gap-2 items-center justify-center'>Established Business {accountType === "established business" && <span>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>}</span>
                                                        </label>
                                                        <label htmlFor='agency-partner' className={`flex items-center h-10 rounded-md px-3 cursor-pointer ${accountType === "agency/partner" ? "bg-purple-300 font-semibold" : "bg-purple-100"
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

                                        {currentStep === 2 &&
                                            <div>
                                                <div className='flex flex-col gap-4'>
                                                    <div className='flex gap-4 w-full'>
                                                        <div className='flex flex-col gap-1 w-1/2'>
                                                            <label htmlFor='fullName'>Full Name:</label>
                                                            <input id='fullName' {...register('fullName')} type='text' placeholder='John Doe' className='h-10 w-full border border-purple-300 rounded-md p-2 outline-0 focus:ring-2 ring-purple-500 ' />
                                                            <span className='text-xs h-4 text-red-600'>
                                                                {errors.fullName && <span>{errors.fullName.message}</span>}
                                                            </span>
                                                        </div>
                                                        <div className='flex flex-col gap-1 w-1/2'>
                                                            <label htmlFor='email'>Email:</label>
                                                            <input id='email' {...register('email')} type='email' placeholder='johndoe@email.com' className='h-10 w-full border border-purple-300 rounded-md p-2 outline-0 focus:ring-2 ring-purple-500 ' />
                                                            <span className='text-xs h-4 text-red-600'>
                                                                {errors.email && <span>{errors.email.message}</span>}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className='flex gap-4 w-full'>
                                                        <div className='flex flex-col gap-1 w-1/2'>
                                                            <label htmlFor='country'>Select Country:</label>

                                                            <Controller
                                                                name="country"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        {...field}
                                                                        options={countryOptions}
                                                                        isClearable
                                                                        placeholder="Select a country"
                                                                        value={field.value ? countryOptions.find(opt => opt.value === field.value) : null}
                                                                        onChange={(option) => field.onChange(option ? option.value : '')}
                                                                        styles={{
                                                                            control: (base, state) => ({
                                                                                ...base,
                                                                                height: '2.5rem',                // h-10
                                                                                minHeight: '2.5rem',
                                                                                borderRadius: '0.375rem',        // rounded-md
                                                                                borderColor: state.isFocused ? '#a855f7' : '#d8b4fe', // border-purple-300 and focus
                                                                                boxShadow: state.isFocused ? '0 0 0 2px #a855f7' : 'none',
                                                                                padding: '0 0.5rem',             // p-2
                                                                            }),
                                                                            input: (base) => ({
                                                                                ...base,
                                                                                margin: 0,
                                                                                padding: 0,
                                                                            }),
                                                                        }}
                                                                    />
                                                                )}
                                                            />

                                                            <span className='text-xs h-4 text-red-600'>
                                                                {errors.country && <span>{errors.country.message}</span>}
                                                            </span>
                                                        </div>
                                                        <div className='flex flex-col gap-1 w-1/2'>
                                                            <label htmlFor='timezone'>Select Timezone: </label>
                                                            <select {...register('timezone')} className='h-10 w-full border border-purple-300 rounded-md px-4 py-2 outline-0 focus:ring-2 ring-purple-500' >
                                                                <option value="">--select time zone --</option>
                                                                {timeZones.map((tz, index) => (
                                                                    <option key={tz.id + index} value={tz.name}>
                                                                        {tz.name} – UTC {tz.dstOffsetStr}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <span className='text-xs h-4 text-red-600'>
                                                                {errors.timezone && <span>{errors.timezone.message}</span>}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {accountType !== 'individual' &&
                                                        <div>
                                                            <p className='mt-2 text-xl mb-2 text-purple-950'>For Startups, Estatblished Businesses, Agencies and Partners</p>
                                                            <div className='flex gap-4 w-full'>
                                                                <div className='flex flex-col gap-1 w-1/2'>
                                                                    <label htmlFor='companyName'>Company Name:</label>
                                                                    <input id='companyName' {...register('companyName')} type='text' placeholder='Premeier Company' className='h-10 w-full border border-purple-300 rounded-md p-2 outline-0 focus:ring-2 ring-purple-500 ' />
                                                                    <span className='text-xs h-4 text-red-600'>
                                                                        {errors.companyName && <span>{errors.companyName.message}</span>}
                                                                    </span>
                                                                </div>

                                                                <div className='flex flex-col gap-1 w-1/2'>
                                                                    <label htmlFor='companySize'>Company Size: </label>
                                                                    <select {...register('companySize')} className='h-10 w-full border border-purple-300 rounded-md px-4 py-2 outline-0 focus:ring-2 ring-purple-500' >
                                                                        <option value="">--select company size --</option>
                                                                        {sizedata.map((size, index) => <option key={index + 1} value={size}>{size}</option>)}

                                                                    </select>

                                                                    <span className='text-xs h-4 text-red-600'>
                                                                        {errors.companySize && <span>{errors.companySize.message}</span>}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                </div>


                                            </div>
                                        }
                                        {currentStep === 3 &&
                                            <div>
                                                <div>
                                                    <fieldset>
                                                        <legend> What do you need help with? </legend>
                                                        <div className='flex flex-row gap-4'>
                                                            <label> <input {...register('help')} type='checkbox' value='website' className='mr-1' />Website</label>
                                                            <label> <input {...register('help')} type='checkbox' value='web app' className='mr-1' />Web App</label>
                                                            <label> <input {...register('help')} type='checkbox' value='mobile app' className='mr-1' />Mobile App</label>
                                                            <label> <input {...register('help')} type='checkbox' value='branding' className='mr-1' />Branding</label>
                                                            <label> <input {...register('help')} type='checkbox' value='ongoing support' className='mr-1' />Ongoing Support</label>
                                                        </div>
                                                        <span className='text-xs h-4 text-red-600'>
                                                            {errors.help && <span>{errors.help.message}</span>}
                                                        </span>

                                                    </fieldset>
                                                </div>
                                                {help && help.includes('website') &&
                                                    <div className='flex flex-col gap-1 w-1/2'>
                                                        <label htmlFor='websitetype'>Website Type: </label>
                                                        <select {...register('websitetype')} className='h-10 w-full border border-purple-300 rounded-md px-4 py-2 outline-0 focus:ring-2 ring-purple-500' >
                                                            <option value="">--select website type --</option>
                                                            {web_types.map((webType, index) => <option key={index + 1} value={webType}>{webType}</option>)}
                                                        </select>

                                                        <span className='text-xs h-4 text-red-600'>
                                                            {errors.websitetype && <span>{errors.websitetype.message}</span>}
                                                        </span>
                                                    </div>}
                                                {help && (help.includes('web app') || help.includes('mobile app')) &&
                                                    <div>
                                                        <p className='mt-2 text-xl mb-2 text-purple-950'>For Web Apps and Mobile Apps</p>

                                                        <div className='w-full flex gap-4'>
                                                            <div className='flex flex-col gap-1 w-1/2'>
                                                                <label htmlFor='roleCount'>User roles count:</label>
                                                                <input id='roleCount' {...register('roleCount', { valueAsNumber: true })} type='number' className='h-10 w-full border border-purple-300 rounded-md p-2 outline-0 focus:ring-2 ring-purple-500 ' />
                                                                <span className='text-xs h-4 text-red-600'>
                                                                    {errors.roleCount && <span>{errors.roleCount.message}</span>}
                                                                </span>
                                                            </div>
                                                            <div className='flex flex-col gap-1 w-1/2'>
                                                                <label htmlFor='authRequired'>Authentication required? </label>
                                                                <select {...register('authRequired')} className='h-10 w-full border border-purple-300 rounded-md px-4 py-2 outline-0 focus:ring-2 ring-purple-500' >
                                                                    <option value="">--select company size--</option>
                                                                    <option value="yes">Yes</option>
                                                                    <option value="no">No</option>

                                                                </select>
                                                                <span className='text-xs h-4 text-red-600'>
                                                                    {errors.authRequired && <span>{errors.authRequired.message}</span>}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </div>}
                                        {currentStep === 4 && <div> This is current step 4 {formData.accountType} </div>}
                                        {currentStep === 5 && <div> This is current step 5 {formData.accountType} </div>}
                                        {currentStep === 6 && <div> This is current step 6 {formData.accountType} </div>}
                                        {currentStep === 7 && <div> This is current step 7 {formData.accountType} </div>}
                                        {currentStep === 8 && <div> This is current step 8 {formData.accountType} </div>}
                                    </div>
                                </div>
                                <div className='h-1/12 flex justify-between'>
                                    <div className='flex gap-4'>
                                        {currentStep === 7 && <button type='submit' className='h-10 w-20 text-sm font-bold bg-purple-950 text-purple-50 rounded-md '>Submit</button>}
                                        {currentStep <= 6 && <button type='button' className='h-10 w-20 text-sm font-bold bg-purple-300 text-purple-950 rounded-md'>Save</button>}

                                    </div>
                                    <div className='flex gap-4'>
                                        {currentStep > 1 && currentStep <= 7 && <button onClick={handleBack} type='button' className='h-10 w-20 text-sm font-bold bg-purple-300 text-purple-950 rounded-md'>Back</button>}
                                        {currentStep <= 7 && <button onClick={handleNext} type='button' className='h-10 w-20 text-sm font-bold bg-purple-950 text-purple-50 rounded-md'>Next</button>}
                                        {currentStep === 8 && <button onClick={handleBackToStart} type='button' className='h-10 w-20 text-sm font-bold bg-purple-950 text-purple-50 rounded-md'>Start</button>}

                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default NewForm
