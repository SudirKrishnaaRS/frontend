import { useEffect, useState } from "react";
import { fetchFromCMS } from "@/utils/cmsClient";

interface CMSState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useCMSContent<T>(endpoint: string) {
  const [state, setState] = useState<CMSState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadContent() {
      try {
        const res = await fetchFromCMS(endpoint);

        if (isMounted) {
          setState({
            data: res.data[0], // Strapi response structure which returns array
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: "Failed to load CMS content",
          });
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return state;
}
