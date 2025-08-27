import Image from 'next/image';

type ShowcaseCardProps = {
    image: string;
    title: string;
    description: string;
    className?: string;
};

export default function ShowcaseCard({ image, title, description, className }: ShowcaseCardProps) {
    return (

        <div className={`hover:scale-105 transition-all duration-200 hover:shadow-xl hover:cursor-pointer active:scale-95 z-10 group min-h-min h-min min-w-min  lg:w-full bg-white flex flex-col rounded-sm overflow-hidden shadow-md shadow-black/20 ${className}`}>

            <div className="relative object-cover border-b-8 border-secondary-dark ">
                <Image height={200} width={200} src={image} alt="Showcase Card" className="w-full" />
                <div className="absolute top-0 w-full h-full bg-gradient-to-t from-primary-dark via-primary-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            </div>

            <div className="flex flex-col justify-center gap-4 items-center h-full w-full text-center bg-light">
                <div className="flex flex-col justify-center items-center p-4">
                    <h1 className="text-xl lg:text-4xl bg-gradient-to-br mb-2 from-secondary-dark to-secondary-light bg-clip-text text-transparent font-black">{title}</h1>
                    <p className="text-lg text-primary-light ">{description}</p>
                </div>
            </div>

        </div>
    );
}