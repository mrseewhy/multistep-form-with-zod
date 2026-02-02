import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'



const formSchema = z.object({
  name: z.string().min(4, 'Characters must be more than 3')
})

type FormData = z.infer<typeof formSchema>

const App = () => {

  const { register, handleSubmit, resetField, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "" },
    mode: "onTouched"


  })

  const handleSubmitWithZod: SubmitHandler<FormData> = (data) => {
    console.log(data)
    // reset()
    resetField("name", { keepTouched: true })

  }


  return (
    <div>
      <form onSubmit={handleSubmit(handleSubmitWithZod)}>
        <input {...register('name')} type='text' className='border outline-o border-gray-600' />
        {errors.name && <span className='text-red-600'>{errors.name.message}</span>}
        <button disabled={isSubmitting} type="submit"> {isSubmitting ? 'Saving' : 'Submit'}</button>
      </form>
    </div>
  )
}

export default App