import { useState } from "react";
import {
  Table,
  TableBody,
  // TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllTrainingData } from "@/lib/tanstack-query/queriesAndMutation";
import { getTrainingDetails, truncateText } from "@/lib/utils";
import { Copy } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Models } from "appwrite";
import TrainingActionModal from "./TrainingActionModal";
import Skeleton from "react-loading-skeleton";

const TrainingRequestsTable = () => {
  const { data: trainingdata, isPending: isFetchingData } =
    useGetAllTrainingData();
  // console.log(trainingdata);

  const [selectedData, setSelectedData] = useState<Models.Document | null>(
    null
  );

  const [openActionModal, setOpenActionModal] = useState(false);

  // console.log(selectedData, "==>");
  const handleCopyPrompt = (prompt: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(prompt)
        .then(() => {
          toast.success("image urls copied to clipboard!");
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

  return (
    <>
      <Table className="bg-white">
        {/* <TableCaption>A list of training requests</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-base">Trigger Word</TableHead>
            <TableHead className="font-bold text-base">
              Styles Requests
            </TableHead>
            <TableHead className="font-bold text-base">Photo Files</TableHead>
            <TableHead className="text-center font-bold text-base">
              TxRef
            </TableHead>
            <TableHead className="text-center font-bold text-base">
              Prompt
            </TableHead>
            <TableHead className="text-center font-bold text-base">
              Status
            </TableHead>
            <TableHead className="text-center font-bold text-base">
              Date
            </TableHead>
            <TableHead className="text-center font-bold text-base"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isFetchingData && (
            <Skeleton
              height={300}
              width={930}
              className="my-2 rounded-md"
              count={2}
            />
          )}
          {trainingdata &&
            trainingdata?.documents
              ?.sort(
                (a, b) =>
                  new Date(b.$createdAt).getTime() -
                  new Date(a.$createdAt).getTime()
              )
              .map((data) => (
                <TableRow
                  key={data?.$id}
                  onClick={() => {
                    setOpenActionModal(true);
                    setSelectedData(data);
                  }}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">
                    {data?.triggerWord}
                  </TableCell>
                  <TableCell>{`${data?.PrimaryStyle ?? "-- --"}, ${
                    data?.secondaryStyle ?? "-- --"
                  }`}</TableCell>
                  <TableCell className="flex items-center gap-1">
                    <div className="font-medium">
                      {truncateText(data?.images[0], 30)}{" "}
                    </div>
                    <div
                      className="flex items-center gap-1 cursor-pointer w-full justify-end mt-2"
                      onClick={() => handleCopyPrompt(data?.images || "")}
                    >
                      <Copy className="h-4 w-4 text-black" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{data?.txRef}</TableCell>
                  <TableCell
                    className="text-center truncate"
                    onClick={() => handleCopyPrompt(data?.prompt || "")}
                  >
                    {truncateText(data?.prompt, 40)}
                  </TableCell>
                  <TableCell
                    className={`text-center font-bold uppercase text-sm`}
                    style={{
                      backgroundColor: getTrainingDetails(
                        data?.trainingStatus ?? ""
                      )?.color,
                    }}
                  >
                    {getTrainingDetails(data?.trainingStatus ?? "")?.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {format(
                      new Date(data?.$createdAt ?? ""),
                      "yyyy-MM-dd HH:mm"
                    )}
                  </TableCell>
                  {/* <TableCell className="text-center">
                  <Button variant="ghost" className="ml-auto flex h-8 w-8 p-0">
                    <Ellipsis className="h-4 w-4 text-black" />
                  </Button>
                </TableCell> */}
                </TableRow>
              ))}
        </TableBody>
        {/* <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-center">$2,500.00</TableCell>
        </TableRow>
      </TableFooter> */}
      </Table>
      <TrainingActionModal
        openActionModal={openActionModal}
        setOpenActionModal={setOpenActionModal}
        data={selectedData}
      />
    </>
  );
};

export default TrainingRequestsTable;
