"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Film,
  Star,
  MessageCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    total_movies: number;
    total_reviews: number;
    avg_rating: number;
    total_ratings: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/recommendations/admin/stats", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error("Erreur lors de la récupération des statistiques");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const barChartData = stats
    ? [
        { name: "Films", value: stats.total_movies },
        { name: "Avis", value: stats.total_reviews },
        { name: "Total notes", value: stats.total_ratings },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-lg font-medium">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-center items-center space-y-2 p-6">
          <Film className="w-10 h-10 text-blue-500" />
          <CardTitle>Films</CardTitle>
          <CardContent className="text-4xl font-extrabold">
            {stats?.total_movies ?? "-"}
          </CardContent>
          <Badge variant="outline" className="uppercase tracking-wide text-blue-600">
            Total des films
          </Badge>
        </Card>

        <Card className="flex flex-col justify-center items-center space-y-2 p-6">
          <MessageCircle className="w-10 h-10 text-green-500" />
          <CardTitle>Avis</CardTitle>
          <CardContent className="text-4xl font-extrabold">
            {stats?.total_reviews ?? "-"}
          </CardContent>
          <Badge variant="outline" className="uppercase tracking-wide text-green-600">
            Total des avis
          </Badge>
        </Card>

        <Card className="flex flex-col justify-center items-center space-y-2 p-6">
          <Star className="w-10 h-10 text-yellow-400" />
          <CardTitle>Note moyenne</CardTitle>
          <CardContent className="text-4xl font-extrabold">
            {stats?.avg_rating?.toFixed(2) ?? "-"}
          </CardContent>
          <Badge variant="outline" className="uppercase tracking-wide text-yellow-500">
            Sur {stats?.total_ratings ?? 0} notes
          </Badge>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques visuelles</CardTitle>
        </CardHeader>
        <CardContent style={{ height: 300 }}>
          {stats ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Aucune donnée disponible</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
