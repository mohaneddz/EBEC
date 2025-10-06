"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { getColumns, Issues, actions } from "@/components/tables/columns/c_issues"
import { getSupabaseAdmin } from "@/utils/supabase/admin";
import { getUser } from '@/server/users';

import Modal from "@/components/global/Modal";

export default function IssuesTable() {
    const [data, setData] = useState<Issues[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issues | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
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
                id: issue.id,
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
        setLoading(false);
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
            <DataTable columns={getColumns(onViewDetails)} data={data} onReload={fetchData} actions={actions} loading={loading}/>
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