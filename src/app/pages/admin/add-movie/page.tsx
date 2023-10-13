'use client'

// components next
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// components react
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// components
import AuthAdmin from '@/app/components/auth-admin/authAdmin';

// api
import { API } from '@/app/api/api';

// types
import { AddMovieValues } from '@/types/addMovie';
import { UserAuth } from '@/types/userAuth';

// alert
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// ----------------------------------------------------------

function AddMovie() {
  // session
  const {data: session, status} = useSession();
  const userAuth: UserAuth | undefined = session?.user;

  const router = useRouter();

  // state categories
  const [categories, setCategories] = useState<any[]>([]); 

  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  const errorMessages = {
    title: 'Title is required',
    releaseDate: 'Release date is required',
    category_id: 'Category is required',
    price: 'Price is required',
    link: 'Link is required',
    description: 'Description is required',
    thumbnail: 'Thumbnail is required',
    trailer: 'Trailer is required',
    fullMovie: 'Full movie is required',
  };

  // handle add movie
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<AddMovieValues>({
    defaultValues: {
      title: '',
      releaseDate: '',
      category: [],
      price: 0,
      link: '',
      description: '',
      thumbnail: [],
      trailer: [],
      fullMovie: [],
      selectAll: false,
    }
  });
  
  const onSubmit: SubmitHandler<AddMovieValues> = async (data) => {
    // console.log(data);
    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: 'Bearer ' + userAuth?.data?.token,
      },
    };
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('release_date', data.releaseDate);
    const categoryId = data.category.map(Number);
    formData.append('category_id', JSON.stringify(categoryId));
    formData.append('price', data.price.toString());
    formData.append('link', data.link);
    formData.append('description', data.description);
    formData.append('thumbnail', data.thumbnail[0]);
    formData.append('trailer', data.trailer[0]);
    formData.append('full_movie', data.fullMovie[0]);
    
    try {
      const res = await API.post('/movie', formData, config);
      if (res.status === 200) {
        toast.success('Movie successfully added!', { position: 'top-right', autoClose: 2000, hideProgressBar: false, closeOnClick: true, pauseOnHover: false,draggable: true, progress: undefined, theme: 'colored', style: {marginTop: '65px'}});
        router.push('/pages/admin/list-movie');
        reset();

      }
    } catch (e) {
      console.log('API Error:', e);
      toast.error('Movie failed added!', { position: 'top-right', autoClose: 2000, hideProgressBar: false, closeOnClick: true, pauseOnHover: false,draggable: true, progress: undefined, theme: 'colored', style: {marginTop: '65px'}});
    }
  };

  const onError = () => {
    console.log('Add Movie failed');
  }

  const selectedCategoryId = watch('category');
  // handle select all checkbox
  const handleChangeSelectAll = (checked: any) => {
    setValue('selectAll', checked);
    const categoryIds = categories.map((category) => category.id);
    setValue('category', checked ? categoryIds : []);
  };

  // handle each category
  const handleChangeCategory = (categoryId: number) => {
    const updatedSelectedCategoryId = selectedCategoryId.includes(categoryId)
      ? selectedCategoryId.filter((id) => id !== categoryId)
      : [...selectedCategoryId, categoryId];
    setValue('category', updatedSelectedCategoryId);
  };

  return (
    <section className='w-full mt-20 px-32 max-md:px-5 pb-10'>
      <form encType='multipart/form-data'>
        <p className='w-full font-bold text-2xl text-[#D2D2D2]'>Add Movie</p>
        <div className='border-b border-gray-900/10 pb-8'>
          <div className='mt-5 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6'>
            <div className='col-span-full'>
              <label htmlFor='title' className='text-base text-[#D2D2D2]'>Title</label>
              <div className='relative mt-2 flex items-center'>
                <input type='text' id='title' autoComplete='off' className='block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6' {...register('title', { required: errorMessages.title })} /> 
              </div>
              {errors.title ? <p className='mt-1 text-red-500'>{errors.title.message}</p> : ''}
            </div>

            <div className='col-span-full'>
              <label htmlFor='release_date' className='text-base text-[#D2D2D2]'>Release Date</label>
              <div className='relative mt-2 flex items-center'>
                <input type='date' id='release_date' autoComplete='off' className='block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6' {...register('releaseDate', { required: errorMessages.releaseDate })} /> 
              </div>
              {errors.releaseDate ? <p className='mt-1 text-red-500'>{errors.releaseDate.message}</p> : ''}
            </div>

            <div className='col-span-full'>
              <label htmlFor='category' className='text-base text-[#D2D2D2]'>Category</label>
              <div className='relative mt-2 flex items-start'>
                <div className='w-full h-fit flex flex-wrap'>
                  {categories?.map((category) => {
                    return (
                      <div className='w-1/6 max-sm:w-1/3 mb-3 flex items-center' key={category.id}>
                        <input type='checkbox' id={category.name} className='w-5 h-5 bg-[#535252] text-[#CD2E71] focus:ring-[#CD2E71] rounded' value={category.id} {...register('category', { required: { value: true, message: errorMessages.category_id }})} checked={selectedCategoryId.includes(category.id)} onChange={() => handleChangeCategory(category.id)} />
                        <label htmlFor={category.name} className='ml-2 text-[#D2D2D2]'>{category.name}</label>
                      </div>
                    )
                  })}
                  <div className='flex items-center mb-3'>
                    <input type='checkbox' id='select-all' className='w-5 h-5 bg-[#535252] text-[#CD2E71] focus:ring-[#CD2E71] rounded' {...register('selectAll')} onChange={(e) => handleChangeSelectAll(e.target.checked)} />
                    <label htmlFor='select-all' className='ml-2 mr-5 text-[#D2D2D2]'>Select all</label>
                  </div>
                </div>
              </div>
              {selectedCategoryId.length === 0 && errors.category ? <p className='text-red-500'>{errors.category.message}</p> : ''}
            </div>

            <div className='col-span-full'>
              <label htmlFor='price' className='text-base text-[#D2D2D2]'>Price</label>
              <div className='relative mt-2 flex items-center'>
                <input type='text' id='price' autoComplete='off' className='block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6' {...register('price', { required: errorMessages.price, validate: (value) => { if(isNaN(value)) { return 'Price must be a valid number'; } if(value < 1) { return 'Price must be greater than 1'; } return true; }})} /> 
              </div>
              {errors.price ? <p className='mt-1 text-red-500'>{ errors.price.message }</p> : ''}
            </div>

            <div className='col-span-full'>
              <label htmlFor='link' className='text-base text-[#D2D2D2]'>Link</label>
              <div className='relative mt-2 flex items-center'>
                <input type='text' id='link' autoComplete='off' className='block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6' {...register('link', { required: errorMessages.link })} /> 
              </div>
              {errors.link ? <p className='mt-1 text-red-500'>{errors.link.message}</p> : ''}
            </div>

            <div className='col-span-full'>
              <label htmlFor='description' className='text-base text-[#D2D2D2]'>Description</label>
              <div className='relative mt-2 flex items-center'>
                <textarea id='description' rows={3} className='block w-full bg-[#535252] rounded-md border-0 p-1.5 text-[#D2D2D2] shadow-sm ring-2 ring-inset ring-[#D2D2D2] placeholder:text-[#D2D2D2] focus:ring-2 focus:ring-inset focus:ring-[#D2D2D2] sm:text-sm sm:leading-6' defaultValue={''} {...register('description', { required: errorMessages.description })} />
              </div>
              {errors.description ? <p className='mt-1 text-red-500'>{errors.description.message}</p> : ''}
            </div>

            <div className='col-span-full'>
              <label htmlFor='thumbnail' className='text-base text-[#D2D2D2]'>Upload Thumbnail</label>
              <div className='relative mt-2 items-center'>
                <input type='file' id='thumbnail' className='w-full m-0 bg-[#535252] flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:text-[#D2D2D2] dark:file:bg-[#0D0D0D] dark:file:text-[#D2D2D2] ring-2 ring-inset ring-[#D2D2D2]' {...register('thumbnail', { required: errorMessages.thumbnail })} accept='.jpg,.jpeg,.png,.svg' />
                {errors.thumbnail ? <p className='mt-1 text-red-500'>{errors.thumbnail.message}</p> : ''}
                <p className='mt-1 text-sm text-[#D2D2D2] dark:text-[#D2D2D2]' id='file_input_help'>SVG, PNG, JPG, JPEG.</p>
              </div>
            </div>

            <div className='col-span-full'>
              <label htmlFor='trailer' className='text-base text-[#D2D2D2]'>Upload Trailer</label>
              <div className='relative mt-2 items-center'>
                <input type='file' id='trailer' className='w-full m-0 bg-[#535252] flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:text-[#D2D2D2] dark:file:bg-[#0D0D0D] dark:file:text-[#D2D2D2] ring-2 ring-inset ring-[#D2D2D2]' {...register('trailer', { required: errorMessages.trailer })} accept='.mp4,.mkv,.avi,.wmv' />
                {errors.trailer ? <p className='mt-1 text-red-500'>{errors.trailer.message}</p> : ''}
                <p className='mt-1 text-sm text-[#D2D2D2] dark:text-[#D2D2D2]' id='file_input_help'>MP4, MKV, AVI, WMV.</p>
              </div>
            </div>

            <div className='col-span-full'>
              <label htmlFor='full_movie' className='text-base text-[#D2D2D2]'>Upload Full Movie</label>
              <div className='relative mt-2 items-center'>
                <input type='file' id='full_movie' className='w-full m-0 bg-[#535252] flex-auto rounded-md px-3 py-[0.32rem] transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:border-inherit file:rounded-md file:px-3 file:py-[0.32rem] file:transition file:duration-150 file:[margin-inline-end:0.75rem] focus:outline-none dark:text-[#D2D2D2] dark:file:bg-[#0D0D0D] dark:file:text-[#D2D2D2] ring-2 ring-inset ring-[#D2D2D2]' {...register('fullMovie', { required: errorMessages.fullMovie })} accept='.mp4,.mkv,.avi,.wmv' />
                {errors.fullMovie ? <p className='mt-1 text-red-500'>{errors.fullMovie.message}</p> : ''}
                <p className='mt-1 text-sm text-[#D2D2D2] dark:text-[#D2D2D2]' id='file_input_help'>MP4, MKV, AVI, WMV.</p>
              </div>
            </div>

          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6'>
          <button type='submit' className='w-200 px-3 py-1.5 rounded-md shadow-sm bg-[#CD2E71] hover:opacity-80 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600' onClick={(e) => handleSubmit(onSubmit, onError)(e)}>Add Movie</button>
        </div>
      </form>
    </section>
  )
}

export default AuthAdmin(AddMovie);

async function getAllCategories() {
  const response = await fetch('http://localhost:5000/api/v1/categories', {
    cache: 'no-cache',
  });
  
  if(!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return await response.json()
}


