export const getMarkers = async(url) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${url}`)
    const data = await response.json();

    return data;
}