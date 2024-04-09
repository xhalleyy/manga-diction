import React from 'react'
import { NavbarComponent } from '../components/NavbarComponent'
import { Badge, Button } from 'flowbite-react'

const page = () => {
    return (
        <div className='bg-offwhite h-screen'>

            <NavbarComponent />

            <div className='flex'>

                <div style={{ width: '30%' }} className='flex flex-col'>
                    <div className=' flex justify-end pt-10'>
                        <img className='rounded-lg' src='/aot.png' />

                    </div>

                    <div className='flex justify-end pt-8'>
                        <Button className='bg-darkblue rounded-2xl enabled:hover:bg-darkblue focus:ring-0 px-12 font-mainFont'>
                            <span className='text-xl'>Favorite Manga +</span>
                        </Button>
                    </div>

                </div>

                <div style={{ width: '80%' }} className='flex flex-col mt-10 ml-5 mr-10 rounded-lg '>
                    {/* manga name, tags, sypnosis */}
                    <div className='bg-white border-darkbrown border-2 rounded-t-lg'>
                        <div className='p-5 inline-flex'>
                            <p className='text-3xl text-darkbrown font-bold'> Manga Title </p>
                            <div className='p-2'>
                                <Badge className='bg-darkblue rounded-xl text-white px-2 mr-1 font-mainFont'>Completed</Badge>
                            </div>
                        </div>

                        <div className='px-5'>
                            <div className='inline-flex'>
                                <Badge className='bg-ivory font-normal rounded-md font-mainFont text-black text-sm px-3 py-1 mr-1'>tags</Badge>
                                <Badge className='bg-ivory font-normal rounded-md font-mainFont text-black text-sm px-3 py-1 mr-1'>tags</Badge>
                                <Badge className='bg-ivory font-normal rounded-md font-mainFont text-black text-sm px-3 py-1 mr-1'>tags</Badge>
                                <Badge className='bg-ivory font-normal rounded-md font-mainFont text-black text-sm px-3 py-1 mr-1'>tags</Badge>
                            </div>

                        </div>

                        <div className='p-5'>
                            <span className='font-mainFont'>
                                Several hundred years ago, humans were nearly exterminated by Titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for pleasure rather than as a food source.
                                A small percentage of humanity survived by walling themselves in a city protected by extremely high walls, even taller than the biggest of Titans. Flash forward to the present and the southern district of Shinganshina has not seen a Titan in over 100 years.

                                Teenage boy Eren and his foster sister Mikasa witness something horrific as one of the outer district walls is damaged by a 60 meter (196.85 feet) Titan causing a breach in the wall. As the smaller Titans flood the city, the two kids watch in horror the tragic events that follow, as the Titans devour people unimpeded.
                                Eren vows that he will wipe out every single Titan and take revenge for all of mankind.
                            </span>
                        </div>
                    </div>

                    {/* manga author, demographic, chapters, last updated */}
                    <div className='bg-ivory leading-loose text-darkbrown border-2 border-t-0 border-darkbrown rounded-b-lg font-mainFont p-5'>
                        <p className='font-bold'> Author:
                            <span className='font-normal'> Author name</span>
                        </p>

                        <p className='font-bold'> Demographics:
                            <span className='font-normal'> Shonen </span>
                        </p>

                        <p className='font-bold'> Chapters:
                            <span className='font-normal'> 260 </span>
                        </p>

                        <p className='font-bold'> Last Updated:
                            <span className='font-normal'> May 26, 2020</span>
                        </p>
                    </div>


                </div>

            </div>


        </div>
    )
}

export default page
