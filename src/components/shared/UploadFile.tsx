import { useState } from "react";
import { Cloud, Trash } from "lucide-react";
import Dropzone from "react-dropzone";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useCreateUserPhotoshoot } from "@/lib/tanstack-query/queriesAndMutation";
import { Models } from "appwrite";

type UploadZoneProps = {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  data: Models.Document | null;
  openUploadModal: boolean;
  setOpenUploadModal: (openPaymentModal: boolean) => void;
};

const UploadDropZone = ({
  selectedFiles,
  setSelectedFiles,
  data,
  setOpenUploadModal,
}: UploadZoneProps) => {
  const [processingImages, setProcessingImages] = useState(false);

  const { mutateAsync: createGeneration, isPending: isCreating } =
    useCreateUserPhotoshoot();
  // console.log(data, "==>vvvv");

  // Handler to delete selected image
  const handleDelete = (file: File) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((f) => f !== file));
  };

  const handleUploadImage = async () => {
    setProcessingImages(true);
    const uploadedUrls: string[] = [];
    toast.success("Processing your images ....");
    for (const file of selectedFiles) {
      const url = await uploadToCloudinary(file);
      if (url) {
        uploadedUrls.push(url);
      }
    }
    if (!uploadedUrls) {
      setProcessingImages(false);
      toast.error("Failed to upload images.");
      return;
    }

    // console.log(uploadedUrls);

    for (const url of uploadedUrls) {
      const payload = {
        shootType: data?.PrimaryStyle,
        url: url,
        customerID: data?.creator?.$id,
      };
      const response = await createGeneration(payload);
      if (response) {
        setProcessingImages(false);
        // console.log(response);
        setOpenUploadModal(false);

        toast.success(`Image Saved successfully`);
      }
      setSelectedFiles([]);
      if (!response) {
        setProcessingImages(false);
        // console.log(response);
        setOpenUploadModal(false);
        toast.error(`Failed to save images`);
      }
    }
  };

  return (
    <Dropzone
      multiple={true}
      onDrop={async (acceptedFiles) => {
        setSelectedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div className="flex flex-col gap-1">
          <div
            {...getRootProps()}
            className="border m-4 border-dashed border-gray-300 rounded-lg"
          >
            <div className="flex items-center justify-center h-full w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-accent"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <Cloud className="h-6 w-6 text-primary-black mb-2" />
                  <p className="mb-2 text-sm text-primary-black">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                </div>
                <input
                  {...getInputProps()}
                  className="hidden"
                  // id="dropzone-file"
                />
              </label>
            </div>
          </div>

          <div className="bg-accent h-[25rem] overflow-y-scroll rounded-lg p-2">
            {selectedFiles?.length === 0 && (
              <div className="w-full h-full flex justify-center items-center text-center">
                <p className="text-base text-primary-black">
                  Your selected images will appear here
                </p>
              </div>
            )}
            <div className="p-2 bg-white w-full h-full grid grid-cols-3 gap-3">
              {selectedFiles.map((file, _i) => {
                // console.log(file, "type");
                const fileUrl = URL.createObjectURL(file);
                const isImage = file.type.startsWith("image/");

                return (
                  <div key={_i} className="relative group">
                    {isImage && (
                      <img
                        src={fileUrl}
                        alt={file.name}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                    {!isImage && (
                      <div className="bg-accent p-2">
                        <p className="text-sm text-primary-black font-medium">
                          {file.name} is not a supported file type
                        </p>
                      </div>
                    )}
                    <button
                      onClick={() => handleDelete(file)}
                      type="button"
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            type="submit"
            className="shad-button_primary my-4"
            disabled={processingImages || isCreating}
            onClick={() => handleUploadImage()}
          >
            Upload image
          </Button>
        </div>
      )}
    </Dropzone>
  );
};

const UploadFile = ({
  selectedFiles,
  setSelectedFiles,
  data,
  openUploadModal,
  setOpenUploadModal,
}: UploadZoneProps) => {
  return (
    <UploadDropZone
      selectedFiles={selectedFiles}
      setSelectedFiles={setSelectedFiles}
      data={data}
      openUploadModal={openUploadModal}
      setOpenUploadModal={setOpenUploadModal}
    />
  );
};

export default UploadFile;
