import React from 'react'
import SortableTable from '@/components/Table'

// Emails ( Contact Forms )
const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'E-Mail' },
    { key: 'message', label: 'Message', expandable: true },
    { key: 'date', label: 'Date', filterable: true },
    { key: 'type', label: 'Type', filterable: true, expandable: true },
]

const data = [
    { name: 'John Doe', email: 'John@email.com', message: 'Hello', date: '2021-10-10', type: 'Contact' },
    { name: 'Jane Doe', email: 'Jhan@gmail.com', message: 'Hi', date: '2021-10-10', type: 'Contact' },
    { name: 'Jane Doe', email: 'Jhan@gmail.com', message: 'Hi', date: '2021-10-10', type: 'Contact' },
    { name: 'Jane Doe', email: 'Jhan@gmail.com', message: 'Hi', date: '2021-10-10', type: 'Contact' },
    { name: 'Jane Doe', email: 'Jhan@gmail.com', message: 'Hi', date: '2021-10-10', type: 'Contact' },
    { name: 'Jane Doe', email: 'Jhan@gmail.com', message: 'Hi', date: '2021-10-10', type: 'Contact' },
    { name: 'Jane Doe', email: 'Jhan@gmail.com', message: 'Hi', date: '2021-10-10', type: 'Contact' },
    { name: 'Jane Doe', email: 'Jhan@gmail.com', message: 'Hi', date: '2021-10-10', type: 'Contact' },
    { name: 'Jane Doe', email: 'Jhan@gmail.com', message: 'Hi', date: '2021-10-10', type: 'Contact' },
]


export default function page() {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 bg-gradient-to-br from-primary-dark to-primary-light p-8 rounded-t-lg '>
                <h1 className='text-5xl font-black text-secondary-light text-center'>E-MAILS</h1>
            </div>
                <SortableTable cols={columns} data={data} />
        </div>
    )
}
