'use client';

// components next
import { useRouter } from 'next/navigation';

// components react
import React, { Suspense } from 'react';

// components
import DinamicImage from '../dinamic-image/dinamicImage';

// css
import './card-movie.module.css';
// ----------------------------------------------------------

// perbedaan penggunaan interface dan type ada dibawah penjelasannya
// type CurrentMovieProps = {
  // currentMovies: any;
// }

interface CurrentMovieProps {
  currentMovies: any;
}
  
export default function CardMovie({ currentMovies }: CurrentMovieProps) {
  const router = useRouter();

  return (
    <React.Fragment>
      <div className='w-full mt-16 px-4 md:px-10 lg:px-20 pb-10'>
        <p className='w-full mb-5 font-bold text-2xl text-[#D2D2D2]'>List Movie</p> 
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-1'>
          {currentMovies?.map((movie: any, i: number) => {
            return (
              <div className='w-30% flex flex-col justify-between rounded-md bg-[#0D0D0D] overflow-hidden' key={i}>
                <div className='w-full h-52'>
                  <DinamicImage movie={movie} />
                </div>
  
                <div className='p-5'>
                  <button type='button' className='inline-flex items-center py-2 text-xl font-medium text-center text-[#D2D2D2] rounded-md hover:opacity-80' onClick={() => router.push(`/pages/users/detail-movie/${movie?.id}`)}>{movie?.title}</button>
                  <p className='mb-3 font-normal text-[#D2D2D2] dark:text-[#D2D2D2]'>{ movie?.description.length > 100 ? `${movie?.description.substring(0, 100)}...` : movie?.description }</p>
                </div>
              </div>
              )
            })
          }
        </div>
      </div>
    </React.Fragment>
  );
}

/* << Dalam banyak kasus, perbedaan antara type dan interface mungkin tidak terlalu terasa. Namun, berikut adalah beberapa perbedaan antara keduanya: >>

1. Fitur Extends 
- interface mendukung fitur extends, yang memungkinkan Anda untuk menggabungkan beberapa interface ke dalam satu interface baru. 
- type mendukung fitur union, intersection, dan conditional types yang memungkinkan Anda untuk melakukan manipulasi tipe data yang lebih kompleks.

2. Merging:
- interface mendukung "merging", yang berarti jika Anda mendefinisikan interface dengan nama yang sama di beberapa tempat, TypeScript akan menggabungkannya menjadi satu interface.
- type tidak mendukung merging seperti yang dilakukan oleh interface.

3. Implements dan Extends:
- interface mendukung pernyataan implements dan extends, yang memungkinkan Anda mengimplementasikan atau meng-extend interface dalam kelas atau interface lain.
- type tidak mendukung implements atau extends.

Pada akhirnya, dalam kasus sederhana seperti di atas, perbedaan antara menggunakan type dan interface mungkin tidak signifikan. Anda bisa memilih salah satu berdasarkan preferensi atau standar proyek yang sedang Anda kerjakan. Jika Anda perlu fitur-fitur seperti extends atau implements, atau Anda ingin mendefinisikan tipe data yang lebih kompleks, Anda mungkin lebih memilih menggunakan interface.

<< yang sering digunakan untuk project yang lebih kompleks apa? >>
Ketika datang ke proyek yang lebih kompleks, banyak pengembang memilih untuk menggunakan interface. Meskipun baik type maupun interface dapat digunakan dalam proyek kompleks, berikut adalah beberapa alasan mengapa interface sering lebih disukai:

1. Merging: interface mendukung fitur "merging", yang memungkinkan Anda untuk mendefinisikan ulang interface dengan nama yang sama di beberapa file dan TypeScript akan menggabungkannya menjadi satu interface. Ini sangat berguna dalam proyek besar dan kompleks di mana struktur tipe data mungkin tersebar di banyak bagian kode.

2. Implements dan Extends: interface mendukung pernyataan implements dan extends. Ini memungkinkan Anda untuk membuat struktur tipe yang lebih kompleks dengan berdasarkan atau meng-extend tipe yang ada.

3. Library Compatibility: Banyak pustaka dan modul eksternal umumnya menyediakan definisi tipe menggunakan interface, yang bisa membuat integrasi dengan pustaka tersebut lebih mudah jika Anda juga menggunakan interface.

4. Consistency and Convention:Dalam banyak proyek, terutama yang besar dan kompleks, sering kali diadopsi konvensi untuk menggunakan interface untuk mendefinisikan tipe data objek dan struktur. Ini membantu menjaga konsistensi dalam kode dan memudahkan kolaborasi di antara banyak pengembang.

Meskipun interface umumnya lebih disukai dalam proyek yang kompleks, type juga memiliki kegunaan yang kuat, terutama ketika Anda perlu mendefinisikan tipe yang lebih fleksibel atau kompleks seperti union, intersection, atau conditional types.

Intinya, baik type maupun interface memiliki tempat mereka masing-masing dalam proyek. Anda bisa memilih sesuai dengan kebutuhan dan preferensi tim Anda. Jika proyek Anda sudah memiliki konvensi atau standar, pastikan untuk mengikuti panduan tersebut untuk menjaga konsistensi dalam kode. */




