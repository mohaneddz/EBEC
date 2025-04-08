import { useEffect, useState } from 'react'
import UpcomingAdminCard from '@/components/Admin/UpcomingAdminCard'
import ManagerAdminCard from '@/components/Admin/ManagerAdminCard'
import supabase from '@/config/supabaseClient'

const DEFAULT_PIC = "https://fdvaqkemvuyjgtoywjbt.supabase.co/storage/v1/object/public/logos//DEFAULT.jpg"

export default function Page() {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase.from('Forefront').select('*');
            // if (error) console.error('Error fetching data:', error);
            // else console.log('Fetched data:', data);
            setData(data);
        };

        fetchData();
    }, []);

    return (
        <div className='flex flex-col gap-4 h-full overflow-x-hidden'>
            <div className='flex flex-col gap-4 bg-gradient-to-br from-primary-dark to-primary-light p-8 rounded-t-lg '>
                <h1 className='text-5xl font-black text-secondary-light text-center'>DASHBOARD</h1>
            </div>


            <div className="layout h-full flex flex-col gap-4 overflow-x-hidden items-center">


                <h1 className='text-center text-primary-light font-black text-2xl mt-16'>Upcoming Events</h1>

                <div className="bg-gray-200 rounded-lg mx-8 h-min px-16">
                    {/* 3 cards that the user can select */}
                    <div className="grid lg:grid-rows-1 lg:grid-cols-3 justify-stretch content-center items-center gap-4 h-min p-4">

                        <UpcomingAdminCard number={1} />
                        <UpcomingAdminCard number={2} />
                        <UpcomingAdminCard number={3} />

                    </div>

                </div>

                <h1 className='text-center text-primary-light font-black text-2xl mt-16'>Managers Information</h1>

                <div className="bg-gray-200 rounded-lg mx-8 h-min px-16">

                    <div className="grid lg:grid-cols-3 gap-4 h-min p-4 w-max">
                        {/* button to refresh the table */}
                        {
                            data && data.map((item, index) => (
                                <ManagerAdminCard key={index} name={item.name} department={item.department} src={item.picture ? item.picture : DEFAULT_PIC } />
                            ))
                        }

                    </div>

                </div>

            </div>
        </div>
    )
}
