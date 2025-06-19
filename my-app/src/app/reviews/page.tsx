"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Review = {
  user_id: number;
  movie_id: number;
  review_text: string;
  rating: number;
  timestamp: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/reviews"); // à adapter
      if (!res.ok) throw new Error("Erreur lors de la récupération des avis");
      const data = await res.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (movie_id: number, user_id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/reviews/${movie_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression de l'avis");
      fetchReviews();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader><CardTitle>Gestion des avis</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Movie ID</TableHead>
              <TableHead>Note</TableHead>
              <TableHead>Avis</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={`${review.user_id}-${review.movie_id}`}>
                <TableCell>{review.user_id}</TableCell>
                <TableCell>{review.movie_id}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.review_text}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(review.movie_id, review.user_id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
