import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import UploadFile from "./UploadFile";
import { Models } from "appwrite";

type UploadModalProps = {
  openUploadModal: boolean;
  setOpenUploadModal: (openUploadModal: boolean) => void;
  data: Models.Document | null;
};

const UploadImageModal = ({
  openUploadModal,
  setOpenUploadModal,
  data
}: UploadModalProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  return (
    <Dialog
      open={openUploadModal}
      onOpenChange={(visible) => {
        if (!visible) {
          setOpenUploadModal(visible);
        }
      }}
    >
      <DialogContent>
        <div className="w-full flex flex-col gap-2">
          <UploadFile
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            data={data}
            setOpenUploadModal={setOpenUploadModal}
            openUploadModal={openUploadModal}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadImageModal;
