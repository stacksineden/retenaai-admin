import { useState } from "react";
import { Models } from "appwrite";
import { Dialog, DialogContent } from "../ui/dialog";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { training_status_options } from "@/modelDataset";
import { Button } from "../ui/button";
import { useUpdateUserTrainingData } from "@/lib/tanstack-query/queriesAndMutation";
import UploadImageModal from "./UploadImageModal";

type ActionModalProps = {
  openActionModal: boolean;
  setOpenActionModal: (openActionModal: boolean) => void;
  data: Models.Document | null;
};

const TrainingActionModal = ({
  openActionModal,
  setOpenActionModal,
  data,
}: ActionModalProps) => {
  //   console.log(data);

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateUserTrainingData();

  const [selectedStatus, setSelectedStatus] = useState(data?.trainingStatus);
  const [openUploadModal, setOpenUploadModal] = useState(false);

  //   console.log(selectedStatus)
  const handleCopyPrompt = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          toast.success("text copied to clipboard!");
        })
        .catch((err) => {
          toast.error("Failed to copy");
          console.error("Failed to copy: ", err);
        });
    } else {
      toast.error("Clipboard API not supported");
      console.error("Clipboard API not supported");
    }
  };

  const handleUpdateTrainingStatus = async () => {
    const payload = {
      document_id: data?.$id ?? "",
      status: selectedStatus,
    };
    const response = await updateStatus(payload);
    if (response) {
      setOpenActionModal(false);
      toast.success("Status Updating Successfully");
    }
    if (!response) {
      toast.error("Error Updating Status");
    }
  };

  return (
    <>
      <UploadImageModal
        openUploadModal={openUploadModal}
        setOpenUploadModal={setOpenUploadModal}
        data={data}
      />
      <Dialog
        open={openActionModal}
        onOpenChange={(visible) => {
          if (!visible) {
            setOpenActionModal(visible);
          }
        }}
      >
        <DialogContent>
          <div className="w-full flex flex-col gap-2">
            <div className="flex flex-col">
              <h2 className="text-primary-black text-2xl font-medium">
                Training Details
              </h2>
            </div>

            <div className="mt-2 mx-2">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col mt-2">
                  <p className="text-sm font-semibold text-primary-black">
                    Creator Name
                  </p>
                  <p className="text-base text-primary-blue">
                    {data?.creator?.name ?? "-- --"}
                  </p>
                </div>
                <div className="flex flex-col mt-2">
                  <p className="text-sm font-semibold text-primary-black">
                    Email
                  </p>
                  <p className="text-base text-primary-blue">
                    {data?.creator?.email ?? "-- --"}
                  </p>
                </div>
                <div className="flex flex-col mt-2">
                  <p className="text-sm font-semibold text-primary-black">
                    AccountID
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-base text-primary-blue">
                      {data?.creator?.$id ?? "-- --"}
                    </p>
                    <div
                      className="flex items-center cursor-pointer w-full"
                      onClick={() =>
                        handleCopyPrompt(data?.creator?.$id || "")
                      }
                    >
                      <Copy className="h-4 w-4 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 mx-2">
              <h2 className="text-primary-blue opacity-70 font-semibold text-xl">
                Update Training Status
              </h2>
              <div className="my-3 w-full flex flex-col gap-1">
                <Select
                  value={selectedStatus}
                  onValueChange={(value) => setSelectedStatus(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {training_status_options?.map((option, _i) => (
                      <SelectItem value={option?.value} key={_i}>
                        {option?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="submit"
                  className="shad-button_primary my-2"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateTrainingStatus()}
                >
                  Update Status
                </Button>

                <Button
                  className="bg-black text-white text-base font-medium"
                  onClick={() => {
                    setOpenUploadModal(true);
                    setOpenActionModal(false);
                  }}
                >
                  Upload Images
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrainingActionModal;
