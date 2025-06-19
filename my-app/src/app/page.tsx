"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import axios from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<{ total_movies: number; total_reviews: number; avg_rating: number } | null>(null);

  useEffect(() => {
    axios.get("/admin/stats").then((res) => setStats(res.data)).catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <Card>
        <CardHeader><CardTitle>Films</CardTitle></CardHeader>
        <CardContent className="text-2xl font-bold">{stats?.total_movies ?? "-"}</CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Avis</CardTitle></CardHeader>
        <CardContent className="text-2xl font-bold">{stats?.total_reviews ?? "-"}</CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Note moyenne</CardTitle></CardHeader>
        <CardContent className="text-2xl font-bold">{stats?.avg_rating?.toFixed(2) ?? "-"}</CardContent>
      </Card>
    </div>
  );
}
