import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useState, useEffect } from "react"
import { Container, Heading, Button, Input, Label } from "@medusajs/ui"

type CollectionImage = {
    id: string
    url: string
    file_id: string
    type: "thumbnail" | "banner"
    collection_id: string
}

const CollectionImagesWidget = ({ data }: { data: any }) => {
    const collectionId = data?.id
    const [images, setImages] = useState<CollectionImage[]>([])
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)

    // Fetch existing images
    useEffect(() => {
        if (!collectionId) return

        fetch(`/admin/collections/${collectionId}/images`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setImages(data.images || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error("Failed to fetch images:", err)
                setLoading(false)
            })
    }, [collectionId])

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = event.target.files
        if (!files || files.length === 0) return

        setUploading(true)

        try {
            // Upload files
            const formData = new FormData()
            Array.from(files).forEach((file) => {
                formData.append("files", file)
            })

            const uploadRes = await fetch("/admin/uploads", {
                method: "POST",
                credentials: "include",
                body: formData,
            })

            if (!uploadRes.ok) {
                throw new Error(`Upload failed: ${uploadRes.statusText}`)
            }

            const uploadData = await uploadRes.json()

            // Medusa returns { files: [...] } not { uploads: [...] }
            const uploadedFiles = uploadData.files || uploadData.uploads || []

            if (uploadedFiles.length === 0) {
                throw new Error("No files returned from upload")
            }

            // Create collection images
            const imageInputs = uploadedFiles.map((upload: any) => ({
                url: upload.url,
                file_id: upload.id,
                type: "thumbnail",
            }))

            const createRes = await fetch(`/admin/collections/${collectionId}/images`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ images: imageInputs }),
            })

            if (!createRes.ok) {
                throw new Error(`Failed to create collection image: ${createRes.statusText}`)
            }

            const createData = await createRes.json()
            setImages([...images, ...(createData.images || [])])
        } catch (error) {
            console.error("Failed to upload images:", error)
            alert(`Failed to upload images: ${error}`)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (imageId: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return

        try {
            await fetch(`/admin/collections/${collectionId}/images/${imageId}`, {
                method: "DELETE",
                credentials: "include",
            })

            setImages(images.filter((img) => img.id !== imageId))
        } catch (error) {
            console.error("Failed to delete image:", error)
            alert("Failed to delete image")
        }
    }

    if (loading) {
        return <Container>Loading images...</Container>
    }

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Collection Images</Heading>
            </div>

            <div className="px-6 py-4">
                {/* Upload Section */}
                <div className="mb-6">
                    <Label htmlFor="image-upload" className="mb-2 block">
                        Upload Images
                    </Label>
                    <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        disabled={uploading}
                    />
                    {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
                </div>

                {/* Images Grid */}
                {images.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {images.map((image) => (
                            <div key={image.id} className="relative group">
                                <img
                                    src={image.url}
                                    alt={`Collection ${image.type}`}
                                    className="h-40 w-full rounded-lg object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    <Button
                                        variant="danger"
                                        size="small"
                                        onClick={() => handleDelete(image.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                                <div className="mt-2">
                                    <span className="text-xs text-gray-500 capitalize">
                                        {image.type}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No images uploaded yet. Upload images to display them on your storefront.
                    </p>
                )}
            </div>
        </Container>
    )
}

export const config = defineWidgetConfig({
    zone: "product_collection.details.after",
})

export default CollectionImagesWidget
