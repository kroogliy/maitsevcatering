import { useState, useEffect } from "react";
import axios from "axios";

export default function useProductSearch(subcategoryId, query, page) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setResults([]); // Сброс при новом поиске
  }, [query, subcategoryId]);

  useEffect(() => {
    if (!subcategoryId) return;

    setLoading(true);
    const cancelToken = axios.CancelToken.source();

    axios
      .get("/api/products-search/search", {
        params: { subcategoryId, query, page, limit: 24 },
        cancelToken: cancelToken.token,
      })
      .then((res) => {
        setResults((prev) => [...prev, ...res.data.products]);
        setHasMore(res.data.pagination.page < res.data.pagination.totalPages);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        // Search error handled silently
      })
      .finally(() => setLoading(false));

    return () => cancelToken.cancel();
  }, [query, page, subcategoryId]);

  return { results, loading, hasMore };
}
