import { CarouselDemo } from '@/components/Carousel.jsx';
import { IconArrowBackUp } from "@tabler/icons-react";
const image1 = "/Assets/Hero/12.jpg";
import Link from 'next/link';

export default function Event() {
  return (
    <div className="relative min-h-screen">

      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="774.5"
        height="748.5"
        viewBox="0 0 1549.042 1497.154"
        className="absolute -top-80 -right-80 -z-10"
      >
        <defs>
          <pattern id="imagePattern" patternUnits="userSpaceOnUse" width="100%" height="100%">
            <image href={image1} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" />
          </pattern>
        </defs>
        <path
          id="Path_1348"
          d="M-268.447,1407.859c-57.044,282.493-422.576,619.3-422.576,619.3S-905.2,2194.742-1066.237,2253.6s-353.144-13.894-459.413-204.364c-48.99-87.805-70.948-104.507-141.862-228.761s-120.947-177.409-141.8-268.254c-15.75-171.988,44.143-285.293,44.143-285.293s228.146-367.248,553.725-459.682c199.9-56.754,569.536-47.747,786.312,133.47C-288.322,1055.081-246.428,1298.815-268.447,1407.859Z"
          transform="translate(2000 -1000)"
          fill="url(#imagePattern)"
        />
      </svg> */}


      {/* gradient background */}
      <div className="p-8 mb-16 bg-gradient-to-br from-primary-dark to-primary-light">

        <Link href="/events" className='z-40 inline-block'>
          <IconArrowBackUp className="z-40 my-4 ml-4 text-primary-dark h-12 w-12 p-2 flex-shrink-0 bg-white rounded-full" />
        </Link>

        <h1 className="text-7xl mb-4 font-bold flex items-center text-secondary-dark">
          Event Name!</h1>
        <h2 className="text-white text-3xl font-semibold">The best event</h2>
        <h3 className="text-slate-400 text-xl mb-8 font-medium">8 Nov | ENSIA</h3>
      </div>
      <p className='px-8 mb-8 text-lg leading-relaxed'>
        <span className="font-bold text-2xl">Lorem</span> ipsum dolor, sit amet consectetur adipisicing elit. Repellat temporibus illo ullam totam aperiam. Tempore corporis quos, possimus doloribus nobis incidunt, accusamus ea repellendus at saepe neque! Temporibus consequatur, quibusdam harum aspernatur quas minima ipsam voluptas consequuntur corrupti deleniti exercitationem incidunt perspiciatis, quae aperiam totam nostrum porro nulla sunt nihil molestiae cumque, a ad enim necessitatibus. Fugit cupiditate voluptatum ut doloremque sed ipsam quam reprehenderit quos corporis, aperiam amet libero laboriosam veniam modi harum necessitatibus qui molestias non hic optio at cum! Laudantium quasi incidunt deserunt? Repellendus id modi non assumenda recusandae hic similique dolor quam, ab explicabo earum mollitia?
      </p>

      <CarouselDemo />
    </div>
  );
}