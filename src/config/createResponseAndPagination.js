export const createResponseAndPagination = (array, status, page = 1, limit = 10, baseUrl) => {
    const totalItems = array.length;
    const totalPages = Math.ceil(totalItems / limit);

    const prevPage = page > 1 ? page - 1 : null;
    const nextPage = page < totalPages ? page + 1 : null;
    const hasPrevPage = prevPage !== null;
    const hasNextPage = nextPage !== null;

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const payload = array.slice(startIndex, endIndex);

    return {
        status,
        payload, 
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}` : null,
        nextLink: hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}` : null
    };
};