import React from 'react'
import SortableTable from '@/components/Table';
import generateInfo from '@/utils/generateInfo';

const initialinfo = generateInfo();

const columns = [
    { key: 'images', label: 'Images', type: 'image', width: 150, maxImages: 1 },
    { key: 'name', label: 'Name', filterable: true, expandable: true },
    { key: 'email', label: 'Email', filterable: true },
    { key: 'department', label: 'Department', filterable: true },
    { key: 'role', label: 'Role' },
    { key: 'joinDate', label: 'Join Date' },
    { key: 'status', label: 'Status' },
];

export default function page() {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4 bg-gradient-to-br from-primary-dark to-primary-light p-8 rounded-t-lg '>
                <h1 className='text-5xl font-black text-secondary-light text-center'>MEMBERS</h1>
            </div>
            <SortableTable data={initialinfo} cols={columns}/>
        </div>
    )
}
