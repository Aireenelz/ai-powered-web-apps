// Function to fetch an image and convert it to base64 image data
export async function fetchImageAndReturnBase64ImageData(url) {
    try {
        // fetch image
        const response = await fetch(url)

        // check if fetch was successful
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`)
        }

        // convert response to a blob
        const blob = await response.blob()

        // create a new FileReader instance
        const reader = new FileReader()

        // return a promise that resolves with the base64 string when the reader finishes
        return new Promise((resolve, reject) => {
            reader.onloadend = () => {
                // get the result from the reader
                const dataUrl = reader.result

                // extract the raw base64 string by removing the prefix
                const base64String = dataUrl.split(',')[1]

                // resolve the promise with the raw base64 string
                resolve(base64String)
            }
            reader.onerror = reject
            
            // read the blob as a data URL (base64)
            reader.readAsDataURL(blob)
        })
    } catch (error) {
        throw new Error(error)
    }
}