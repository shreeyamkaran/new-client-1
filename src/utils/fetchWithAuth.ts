type FetchOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: BodyInit | null;
};

export const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<Response> => {
    // Retrieve the JWT token from localStorage (or Redux store if needed)
    const token = localStorage.getItem("jwt"); 

    // Build the headers
    const headers: Record<string, string> = {
        ...options.headers,
        'Authorization': token ? `Bearer ${token}` : '',  // Attach the token if available
        'Content-Type': 'application/json',  // Assuming content-type as JSON by default
    };

    // Perform the fetch request with the constructed headers
    const response = await fetch(url, {
        ...options,  // Spread in any custom options passed in (method, body, etc.)
        headers,  // Use the constructed headers
    });

    return response;
};
