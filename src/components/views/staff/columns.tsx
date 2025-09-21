import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IconEye } from '@tabler/icons-react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Staff = {
    id: string;
    fullName: string;
    topicId: string;
    availabilityDate: string;
    duration: string;
    mustEndDate: string;
    status:
        | "Accepted"
        | "Pending"
        | "Affected"
        | "Rejected"
        | "Banned"
        | "Finished";
    applicationDate: string;
    applicationForm: string;
};

export const columns: ColumnDef<Staff>[] = [
    {
        accessorKey: "fullName",
        header: "Full Name",
    },
    {
        accessorKey: "topicId",
        header: "Topic ID",
    },
    {
        accessorKey: "availabilityDate",
        header: "Availability date",
    },
    {
        accessorKey: "duration",
        header: "Duration",
    },
    {
        accessorKey: "mustEndDate",
        header: "Must-end Date",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status: string = row.getValue("status");

            return (
                <div className="w-full flex justify-center items-center">
                    <div
                        className={cn(
                            "px-2 py-1 rounded-lg w-full text-center text-white text-xs font-bold",
                            status === "Accepted" && "bg-blue-500",
                            status === "Pending" && "bg-gray-400",
                            status === "Affected" && "bg-yellow-500",
                            status === "Rejected" && "bg-red-500",
                            status === "Banned" && "bg-black ",
                            status === "Finished" && "bg-green-500"
                        )}
                    >
                        {status}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "applicationDate",
        header: "Application Date",
    },
    {
        accessorKey: "applicationForm",
        header: "Application Form",
        cell: ({ row }) => {
            return (
                <div className="w-full flex justify-center">
                    <a
                        href={row.getValue("applicationForm") as string}
                        rel="noreferrer"
                        className="text-blue-500 underline"
                    >
                        <IconEye className="w-5 h-5" />
                    </a>
                </div>
            );
        },
    },
];
