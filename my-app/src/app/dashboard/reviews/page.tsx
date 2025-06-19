"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, MessageCircle, User, Film, Star } from "lucide-react";

type Review = {
  user_id: number;
  movie_id: number;
  review_text: string;
  rating: number;
  timestamp: string;
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setErrorMessage("");
      const res = await fetch("http://localhost:5000/reviews/all"); // adapter selon API
      if (!res.ok) throw new Error("Erreur lors de la récupération des avis");
      const data = await res.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error(error);
      setErrorMessage("Impossible de charger les avis.");
    }
  };

  const handleDelete = async (movie_id: number, user_id: number) => {
    try {
      setErrorMessage("");
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
      setErrorMessage("Erreur lors de la suppression de l'avis.");
    }
  };

  return (
    <Card className="mt-8 max-w-7xl mx-auto px-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-600">
          <MessageCircle className="w-6 h-6" />
          Gestion des avis
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {errorMessage && (
          <p className="mb-4 text-red-600 font-medium">{errorMessage}</p>
        )}
        <Table className="min-w-full rounded-md border border-gray-200">
          <TableHeader className="bg-indigo-50">
            <TableRow>
              <TableHead>
                <User className="inline w-4 h-4 mr-1 text-indigo-500" />
                User ID
              </TableHead>
              <TableHead>
                <Film className="inline w-4 h-4 mr-1 text-indigo-500" />
                Movie ID
              </TableHead>
              <TableHead>
                <Star className="inline w-4 h-4 mr-1 text-yellow-400" />
                Note
              </TableHead>
              <TableHead>Avis</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow
                key={`${review.user_id}-${review.movie_id}`}
                className="hover:bg-indigo-50 transition-colors cursor-default"
              >
                <TableCell>{review.user_id}</TableCell>
                <TableCell>{review.movie_id}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell
                  className="max-w-xs truncate"
                  title={review.review_text}
                >
                  {review.review_text}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(review.movie_id, review.user_id)}
                    aria-label={`Supprimer l'avis de l'utilisateur ${review.user_id} pour le film ${review.movie_id}`}
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
