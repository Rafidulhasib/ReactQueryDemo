import { useQuery } from "@tanstack/react-query";
import { NavLink, useParams } from "react-router-dom";
import { fetchIndvPost } from "../../../API/api";

export const FetchIndv = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchIndvPost(id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message || "Something  went wrong!"}</p>;

  console.log(data);

  return (
    <div className="section-accordion">
      <h1>Post Id Number - {id}</h1>
      <div>
        <p>ID : {data.id}</p>
        <p>Title: {data.title}</p>
        <p>Body: {data.body}</p>
      </div>

      <NavLink to="/rq">
        <button>Go Back</button>
      </NavLink>
    </div>
  );
};
