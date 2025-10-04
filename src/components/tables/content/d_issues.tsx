"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { getColumns, Issues } from "@/components/tables/columns/c_issues"
import Modal from "@/components/global/Modal";
import { getSupabaseAdmin } from "@/utils/supabase/admin";
import { getUser } from '@/app/actions';

export default function IssuesTable() {
    const [data, setData] = useState<Issues[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issues | null>(null);

    const fetchData = useCallback(async () => {
        const supabase = await getSupabaseAdmin();
        const { data: issuesData, error } = await supabase
            .from('issues')
            .select('*');

        if (error) {
            console.error("Error fetching issues:", error);
            return;
        }
        const formattedData = await Promise.all(issuesData.map(async (issue) => {
            const userResponse = await getUser(issue.user_id);
            const user = userResponse.user;
            return {
                user_id: user?.id || '',
                email: user?.email || '',
                name: user?.user_metadata?.display_name || '',
                department: (user?.user_metadata?.department || '') as departments,
                issue: issue.issue,
                createdAt: new Date(issue.created_at),
                status: issue.status ,
            };
        }));

        setData(formattedData);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onViewDetails = (issue: Issues) => {
        setSelectedIssue(issue);
        setIsModalOpen(true);
    };

    return (
        <>
            <DataTable columns={getColumns(onViewDetails)} data={data} onReload={fetchData} />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Issue Details"
            >
                <p>{selectedIssue?.issue}</p>
            </Modal>
        </>
    );
}