"use client"

import { useState, useEffect, useCallback } from "react"
import { DataTable } from "@/components/tables/data-table"
import { columns, GalleryItem } from "@/components/tables/columns/c_gallery"
import { getSupabaseAdmin } from "@/utils/supabase/admin";

export default function GalleryTable() {
  const [data, setData] = useState<GalleryItem[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = await getSupabaseAdmin();
    const { data: galleryData, error } = await supabase
      .from('gallery')
      .select('*');

    if (error) {
      console.error("Error fetching gallery items:", error);
      return;
    }

    setData(galleryData as GalleryItem[]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return <DataTable columns={columns} data={data} onReload={fetchData} />;
}