"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns, Form } from "@/components/tables/columns/c_forms"
import { getSupabaseAdmin } from "@/utils/supabase/admin";

export default function FormsTable() {
    const [data, setData] = useState<Form[]>([]);

    const fetchData = useCallback(async () => {
        const supabase = await getSupabaseAdmin();
        const { data: formsData, error } = await supabase
            .from('forms')
            .select('*');

        if (error) {
            console.error("Error fetching forms:", error);
            return;
        }

        setData(formsData as Form[]);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return <DataTable columns={columns} data={data} onReload={fetchData} />;
}
