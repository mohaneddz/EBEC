import React from 'react'
import SortableTable from '@/components/Table'

// Events
const columns = [
    { key: 'eventName', label: 'Event' },
    { key: 'mainPicutre', label: 'Main Picture', type: 'image', width: 150, maxImages: 1 }, 
    { key: 'pictures', label: 'Pictures', type: 'image', width: 150, maxImages: 4 },
    { key: 'date', label: 'Date', filterable: true },
    { key: 'location', label: 'Location' },
    { key: 'description', label: 'Description', expandable: true },
    { key: 'type', label: 'Type', filterable: true },
    { key: 'attendees', label: 'Attendees', filterable: true },
];

const data = [
    {
        eventName: 'Tech Conference 2024',
        date: '2024-03-15',
        location: 'San Francisco, CA',
        description: 'Annual technology conference featuring industry leaders and innovative startups.',
        type: 'Technology',
        attendees: 500 ,
        pictures: [],
        mainPicutre: [],
    },
    {
        eventName: 'Art Exhibition: Modern Masters',
        date: '2024-04-22',
        location: 'New York City, NY',
        description: 'A curated exhibition showcasing the works of renowned modern artists.',
        type: 'Art',
        attendees: 250,
        pictures: [],
        mainPicutre: [],
    },
    {
        eventName: 'Music Festival: Summer Sounds',
        date: '2024-07-05',
        location: 'Los Angeles, CA',
        description: 'A three-day music festival featuring diverse genres and renowned artists.',
        type: 'Music',
        attendees: 10000,
        pictures: [],
        mainPicutre: [],
    },
    {
        eventName: 'Food & Wine Festival',
        date: '2024-09-10',
        location: 'Napa Valley, CA',
        description: 'A culinary experience with wine tasting and gourmet food.',
        type: 'Food & Wine',
        attendees: 1500,
        pictures: [],
        mainPicutre: [],
    },
    {
        eventName: 'Coding Bootcamp Intensive',
        date: '2024-11-01',
        location: 'Online',
        description: 'A 12-week intensive coding bootcamp to learn web development.',
        type: 'Education',
        attendees: 50 ,
        pictures: [],
        mainPicutre: [],
    },
    {
        eventName: 'Charity Gala: A Night of Hope',
        date: '2024-12-15',
        location: 'Chicago, IL',
        description: 'A fundraising gala to support local charities and community initiatives.',
        type: 'Charity',
        attendees: 300,
        pictures: [],
        mainPicutre: [],
    },
    {
        eventName: 'Startup Pitch Competition',
        date: '2025-01-20',
        location: 'Boston, MA',
        description: 'A competition for early-stage startups to pitch their ideas to investors.',
        type: 'Business',
        attendees: 100,
        pictures: [],
        mainPicutre: [],
    },
    {
        eventName: 'Film Festival: Indie Lens',
        date: '2025-02-10',
        location: 'Austin, TX',
        description: 'Showcasing independent films and documentaries from around the world.',
        type: 'Film',
        attendees: 400,
        pictures: [],
        mainPicutre: [],
    },
    {
        eventName: 'Sustainability Summit',
        date: '2025-03-05',
        location: 'Seattle, WA',
        description: 'A summit focused on sustainable practices and environmental solutions.',
        type: 'Environment',
        attendees: 200,
    }
];

export default function page() {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 bg-gradient-to-br from-primary-dark to-primary-light p-8 rounded-t-lg '>
                <h1 className='text-5xl font-black text-secondary-light text-center'>EVENTS</h1>
            </div>
            <SortableTable cols={columns} data={data} />
        </div>
    )
}
