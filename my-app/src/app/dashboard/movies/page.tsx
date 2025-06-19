"use client";

import { useEffect, useState, ChangeEvent, FormEvent, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Film, Calendar, Star, User, List, ImageIcon, Video } from "lucide-react";

type Movie = {
  id: number;
  title: string;
  description: string;
  rating: number | null;
  release_year?: number | null;
  director?: string | null;
  poster_url?: string | null;
  video_path?: string | null;
  genres?: string[];
  actors?: string[];
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [director, setDirector] = useState("");
  const [actorsInput, setActorsInput] = useState("");
  const [genresInput, setGenresInput] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const posterInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("http://localhost:5000/movies");
      if (!res.ok) throw new Error("Erreur lors de la récupération des films");
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePosterChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setPosterFile(e.target.files[0]);
      const url = URL.createObjectURL(e.target.files[0]);
      setPosterPreview(url);
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setVideoFile(e.target.files[0]);
  };

  const handleAddMovie = async (e: FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !director.trim()) {
      setErrorMessage("Le titre et le réalisateur sont obligatoires.");
      setSuccessMessage("");
      return;
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    if (releaseYear !== "") formData.append("release_year", String(releaseYear));
    if (rating !== "") formData.append("rating", String(rating));
    formData.append("description", description.trim());
    formData.append("director", director.trim());

    actorsInput
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0)
      .forEach((actor) => formData.append("actors", actor));

    genresInput
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0)
      .forEach((genre) => formData.append("genres", genre));

    if (posterFile) formData.append("poster", posterFile);
    if (videoFile) formData.append("video", videoFile);

    try {
      const res = await fetch("http://localhost:5000/movies/full", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de l'ajout du film.");
      }

      const result = await res.json();
      setSuccessMessage(result.message || "Film ajouté avec succès !");
      setErrorMessage("");
      resetForm();
      fetchMovies();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || "Erreur lors de l'ajout.");
      setSuccessMessage("");
    }
  };

  const resetForm = () => {
    setTitle("");
    setReleaseYear("");
    setRating("");
    setDescription("");
    setDirector("");
    setActorsInput("");
    setGenresInput("");
    setPosterFile(null);
    setVideoFile(null);
    setPosterPreview(null);
    if (posterInputRef.current) posterInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/movies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      fetchMovies();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Film className="w-6 h-6 text-indigo-600" />
            Ajouter un film
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddMovie} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <Film className="w-4 h-4 text-indigo-500" /> Titre *
              </label>
              <Input
                placeholder="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 text-indigo-500" /> Année de sortie
              </label>
              <Input
                type="number"
                placeholder="Année de sortie"
                value={releaseYear}
                onChange={(e) =>
                  setReleaseYear(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <Star className="w-4 h-4 text-yellow-400" /> Note
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="Note"
                value={rating}
                onChange={(e) =>
                  setRating(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <List className="w-4 h-4 text-indigo-500" /> Description
              </label>
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <User className="w-4 h-4 text-indigo-500" /> Réalisateur *
              </label>
              <Input
                placeholder="Réalisateur"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <User className="w-4 h-4 text-indigo-500" /> Acteurs (séparés par virgule)
              </label>
              <Input
                placeholder="Acteurs (séparés par virgule)"
                value={actorsInput}
                onChange={(e) => setActorsInput(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <List className="w-4 h-4 text-indigo-500" /> Genres (séparés par virgule)
              </label>
              <Input
                placeholder="Genres (séparés par virgule)"
                value={genresInput}
                onChange={(e) => setGenresInput(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <ImageIcon className="w-4 h-4 text-indigo-500" /> Affiche
              </label>
              <input
                ref={posterInputRef}
                type="file"
                accept="image/*"
                onChange={handlePosterChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                "
              />
              {posterPreview && (
                <img
                  src={posterPreview}
                  alt="Aperçu affiche"
                  className="mt-2 max-h-40 rounded-md shadow-md object-contain"
                />
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-1 text-sm font-medium text-gray-700">
                <Video className="w-4 h-4 text-indigo-500" /> Vidéo
              </label>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                "
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" className="w-full md:w-auto">
                Ajouter
              </Button>
            </div>
          </form>

          {successMessage && (
            <p className="text-green-600 mt-4 font-semibold">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-600 mt-4 font-semibold">{errorMessage}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Film className="w-5 h-5 text-indigo-600" />
            Liste des films
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-full rounded-md border border-gray-200">
            <TableHeader className="bg-indigo-50">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Réalisateur</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow
                  key={movie.id}
                  className="hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <TableCell>{movie.id}</TableCell>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell className="max-w-xs truncate" title={movie.description ?? ""}>
                    {movie.description ?? "-"}
                  </TableCell>
                  <TableCell>{movie.rating ?? "-"}</TableCell>
                  <TableCell>{movie.release_year ?? "-"}</TableCell>
                  <TableCell>{movie.director ?? "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(movie.id)}
                      aria-label={`Supprimer le film ${movie.title}`}
                    >
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
