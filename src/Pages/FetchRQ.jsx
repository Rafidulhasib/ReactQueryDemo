import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { deletePost, fetchPosts, updatePost } from "../API/api";
export const FetchRQ = () => {
  const [pageNumber, setPageNumber] = useState(0);

  const QueryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts", pageNumber],
    queryFn: () => fetchPosts(pageNumber),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: (data, id) => {
      QueryClient.setQueryData(["posts", pageNumber], (curElem) => {
        return curElem?.filter((post) => post.id != id);
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (id) => updatePost(id),
    onSuccess: (apiData, postId) => {
      console.log(apiData, postId);
      QueryClient.setQueryData(["posts", pageNumber], (postsData) => {
        return postsData?.map((curPost) =>
          curPost.id === postId
            ? { ...curPost, title: apiData.data.title }
            : curPost
        );
      });
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error : {error.message || "Something went wrong!"}</p>;

  return (
    <>
      <ul className="section-accordion">
        {data?.map((curElem) => {
          const { id, title, body } = curElem;
          return (
            <li key={id}>
              <NavLink to={`/rq/${id}`}>
                <p>{id}</p>
                <p>{title}</p>
                <p>{body}</p>
              </NavLink>
              <button onClick={() => deleteMutation.mutate(id)}>Delete</button>
              <button onClick={() => updateMutation.mutate(id)}>Update</button>
            </li>
          );
        })}
      </ul>

      <div className="pagination-section">
        <button
          disabled={pageNumber === 0 ? true : false}
          onClick={() => setPageNumber((prev) => (prev > 0 ? prev - 3 : prev))}
        >
          Prev
        </button>
        <h2 className="page-number">{pageNumber / 3 + 1}</h2>
        <button onClick={() => setPageNumber((prev) => prev + 3)}>Next</button>
      </div>
    </>
  );
};
