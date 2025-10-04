import ServicesCards from '@/components/main/ServicesCards';

export default function ServicesSection() {

    const services = [
        { title: "Training & Workshops", icon: "IconBook", link: "/events" },
        { title: "Networking Events", icon: "IconUsers", link: "/events" },
        { title: "Club Activities", icon: "IconCalendarEvent", link: "/events" },
        { title: "Competitions", icon: "IconTrophy", link: "/events" }
    ];

    const backgroundSvg = encodeURIComponent(`
        <svg id="visual" viewBox="0 0 960 540" width="960" height="540" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="960" height="540" fill="#ffffff"></rect>
            <g transform="translate(960, 0)">
                <path d="M0 216C-25.7 189.8 -51.5 163.7 -86 149C-120.5 134.2 -163.9 130.9 -187.1 108C-210.2 85.1 -213.1 42.5 -216 0L0 0Z" fill="#feb60f"></path>
            </g>
            <g transform="translate(0, 540)">
                <path d="M0 -216C36.1 -207.9 72.3 -199.7 105.5 -182.7C138.7 -165.7 169.1 -139.9 187.1 -108C205 -76.1 210.5 -38 216 0L0 0Z" fill="#feb60f"></path>
            </g>
        </svg>
    `);

    return (
        <div
            className="flex flex-col w-screen min-h-min h-screen justify-center bg-white"
            style={{
                backgroundImage: `url("data:image/svg+xml,${backgroundSvg}")`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 flex flex-col min-h-min">

                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-40 md:mt-0">

                    <svg xmlns="http://www.w3.org/2000/svg" width="100.27" height="98.45" viewBox="0 0 100.27 98.45" className='absolute opacity-95 -right-4 -top-24 lg:-left-24 md:top-0'>
                        <defs>
                            <linearGradient id="linear-gradient" x1="-0.284" y1="-0.633" x2="1.896" y2="2.49" gradientUnits="objectBoundingBox">
                                <stop offset="0" stopColor="#1b2755"></stop>
                                <stop offset="1" stopColor="#0a1029"></stop>
                            </linearGradient>
                            <filter id="Path_767" x="0" y="0" width="100.27" height="98.45" filterUnits="userSpaceOnUse">
                                <feOffset dx="1" dy="1" ></feOffset>
                                <feGaussianBlur stdDeviation="0.5" result="blur"></feGaussianBlur>
                                <feFlood floodOpacity="0.149"></feFlood>
                                <feComposite operator="in" in2="blur"></feComposite>
                                <feComposite in="SourceGraphic"></feComposite>
                            </filter>
                        </defs>
                        <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Path_767)">
                            <path id="Path_767-2" d="M251.206,96.089a44.7,44.7,0,0,1,7.8-1.324c21.3-1.642,43.618,14.256,48.006,35.268,5.265,25.217-12.216,53.169-37.32,58.967s-53.347-12.1-58.321-37.384C206.565,127.191,227.572,102.259,251.206,96.089Z" transform="translate(-210.18 -94.15)" fill="url(#linear-gradient)"></path>
                        </g>
                    </svg>

                    <div className="max-w-xl mb-12">
                        <h2 className="text-4xl vsm:text-5xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-8">
                            <span className='relative'>
                                <div className="h-1 w-full bg-secondary-500 absolute -bottom-2"></div>
                                Why
                            </span>
                            &nbsp;EBEC?
                        </h2>
                        <p className="text-lg text-gray-600">
                            <b>EBEC</b> offers various services to help students develop their entrepreneurial and business skills. Through our programs, you&lsquo;ll gain practical experience and valuable connections in the business world.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {services.map((service, index) => (
                            <ServicesCards
                                key={index}
                                title={service.title}
                                link={service.link}
                                Icon={service.icon}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};