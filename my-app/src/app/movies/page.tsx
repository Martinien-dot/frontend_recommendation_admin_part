"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import axios from "@/lib/api";

type Movie = {
  id: number;
  title: string;
  description: string;
  rating: number | null;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    axios.get("/movies").then((res) => setMovies(res.data.movies)).catch(console.error);
  };

  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post("/movies", { title, description })
      .then(() => {
        setTitle("");
        setDescription("");
        fetchMovies();
      })
      .catch(console.error);
  };

  const handleDelete = (id: number) => {
    axios.delete(`/movies/${id}`).then(fetchMovies).catch(console.error);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader><CardTitle>Ajouter un film</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAddMovie} className="space-y-4">
            <Input placeholder="Titre du film" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <Button type="submit">Ajouter</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Liste des films</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell>{movie.id}</TableCell>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>{movie.description}</TableCell>
                  <TableCell>{movie.rating ?? "-"}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(movie.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
