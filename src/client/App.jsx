import { useEffect, useState } from "react";
import "./App.css";
import MovieForm from "./components/MovieForm";
import UserForm from "./components/UserForm";

const apiUrl = "http://localhost:4000";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/movie`)
      .then((res) => res.json())
      .then((res) => setMovies(res.data));
  }, []);

  const handleRegister = async ({ username, password }) => {
    // Write your register code here
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };

    fetch(`${apiUrl}/user/register`, opts)
      .then((res) => res.json())
      .then((newUser) => console.log(newUser))
      .catch((err) => console.error(err));
  };

  const handleLogin = async ({ username, password }) => {
    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    };

    fetch(`${apiUrl}/user/login`, opts)
      .then((res) => res.json())
      .then((jwtToken) => {
        console.log(JSON.stringify(jwtToken));
        localStorage.setItem("Authorization", `Bearer ${jwtToken.data}`);
      })
      .catch((err) => console.error(err));
  };

  const handleCreateMovie = async ({ title, description, runtimeMins }) => {
    const token = localStorage.getItem("Authorization");

    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ title, description, runtimeMins }),
    };

    fetch(`${apiUrl}/movie`, opts)
      .then((res) => res.json())
      .then((createdMovie) => {
        console.log(JSON.stringify(createdMovie));
        setMovies((movies) => [...movies, createdMovie.data]);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
