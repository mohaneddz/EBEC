"use client";
import UpcomingEventCard from "@/components/eventsCards/AdminUpcomingEventCard";
import AdminEventCard from "@/components/eventsCards/AdminEventCard";
import { useState } from "react";


const image1 = "/Assets/Hero/5.jpg";
const image2 = "/Assets/Hero/8.jpg";
const image3 = "/Assets/Hero/12.jpg";
const image4 = "/Assets/Hero/3.jpg";
const image5 = "/Assets/Hero/15.jpg";
const image6 = "/Assets/Hero/1.jpg";
const image7 = "/Assets/Hero/9.jpg";
const image8 = "/Assets/Hero/4.jpg";
const image9 = "/Assets/Hero/11.jpg";
const image10 = "/Assets/Hero/7.jpg";

export default function EventsPage() {

    const [allEvents, setAllEvents] = useState([
        {
            id: '1',
            name: "Tech Conference 2024",
            subtitle: "Innovation and Networking",
            shortDescription: "Join industry leaders for keynotes and workshops.",
            longDescription: "A deep dive into the latest trends in technology...",
            date: "2024-11-15",
            location: "San Francisco, CA",
            images: [{ id: 'img1', url: image1, isMain: true }]
        },
        {
            id: '2',
            name: "Art and Music Festival",
            subtitle: "Celebrate Creativity",
            shortDescription: "A vibrant showcase of art, music, and local cuisine.",
            longDescription: "Experience a weekend of artistic expression...",
            date: "2024-07-22",
            location: "Austin, TX",
            images: [{ id: 'img2', url: image2, isMain: true }]
        },
        {
            id: '3',
            name: "Foodies Delight",
            subtitle: "A Culinary Adventure",
            shortDescription: "Explore a world of flavors with top chefs and gourmet food trucks.",
            longDescription: "Indulge in a culinary adventure featuring renowned chefs...",
            date: "2024-09-08",
            location: "New York, NY",
            images: [{ id: 'img3', url: image3, isMain: true }]
        },
        {
            id: '4',
            name: "Outdoor Adventure Expo",
            subtitle: "Gear Up for the Great Outdoors",
            shortDescription: "Discover the latest gear and tips for your next outdoor adventure.",
            longDescription: "Get ready for your next outdoor escapade!...",
            date: "2024-06-10",
            location: "Denver, CO",
            images: [{ id: 'img4', url: image4, isMain: true }]
        },
        {
            id: '5',
            name: "Coding Bootcamp Intensive",
            subtitle: "Learn to Code in 12 Weeks",
            shortDescription: "An immersive coding bootcamp for aspiring web developers.",
            longDescription: "Transform your career with our intensive coding bootcamp!...",
            date: "2024-08-01",
            location: "Online",
            images: [{ id: 'img5', url: image5, isMain: true }]
        },
        {
            id: '6',
            name: "Sustainable Living Workshop",
            subtitle: "Eco-Friendly Practices",
            shortDescription: "Learn practical tips for a more sustainable lifestyle.",
            longDescription: "Empower yourself to live a more sustainable life!...",
            date: "2024-10-20",
            location: "Portland, OR",
            images: [{ id: 'img6', url: image6, isMain: true }]
        },
        {
            id: '7',
            name: "Photography Masterclass",
            subtitle: "Capture Stunning Images",
            shortDescription: "Enhance your photography skills with expert guidance.",
            longDescription: "Unleash your inner photographer!...",
            date: "2024-12-05",
            location: "Los Angeles, CA",
            images: [{ id: 'img7', url: image7, isMain: true }]
        }
    ]);

    const [featuredEvents, setUpcomingEvents] = useState([
        {
            id: '8',
            name: "Club Fair",
            date: "September 15, 2021",
            location: "Main Hall",
            description: "The Club Fair is a great opportunity for students to learn...",
            image: image8
        },
        {
            id: '9',
            name: "Homecoming",
            date: "October 15, 2021",
            location: "Football Field",
            description: "Homecoming is a time for alumni to return to campus...",
            image: image9
        },
        {
            id: '10',
            name: "Spring Fling",
            date: "April 15, 2022",
            location: "Quad",
            description: "Spring Fling is a fun-filled day of games, food...",
            image: image10
        }
    ]);


    const handleEventDelete = (eventId) => {
        setAllEvents(allEvents.filter(event => event.id !== eventId));
    };

    return (
        <div>
            <div className="">
                <h2 className='w-full mr-24 hover:cursor-pointer select-none text-5xl font-bold flex items-center gap-8 text-white bg-gradient-to-br from-primary-light to-primary-dark font-poppins p-8 rounded-lg'>Upcoming Events</h2>
                <div className="relative w-full my-8 mr-24 py-8 px-16 bg-zinc-50 rounded-xl overflow-x-auto flex justify-center items-center overflow-y-visible">
                    <div className="flex justify-center w-min gap-16">
                        {featuredEvents.map(event => (
                            <UpcomingEventCard
                                key={event.id}
                                initialData={event}
                            />
                        ))}
                    </div>
                </div>
                <h2 className='w-full mr-24 hover:cursor-pointer select-none text-5xl font-bold flex items-center gap-8 text-white bg-gradient-to-br from-primary-light to-primary-dark font-poppins p-8 rounded-lg'
                >Events List</h2>
                <div className="my-8 p-8  w-full mr-24 bg-zinc-50 rounded-xl overflow-x-auto overflow-y-visible">
                    <div className="flex flex-wrap gap-8 p-16 justify-center items-center content-center">
                        {allEvents.map(event => (
                            <AdminEventCard
                                key={event.id}
                                initialData={event}
                                onDelete={handleEventDelete}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}