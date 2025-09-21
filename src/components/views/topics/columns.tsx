import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";

// This type is used to define the shape of our data.
export type Topic = {
    topic: string;
    id: string;
    project: string;
    budget: string;
    affected: "No need" | "Major need" | "Minor need";
    status:
        | "In Progress"
        | "Finished"
        | "Not Started"
        | "Cancelled"
        | "Suspended";
    Domain: string[];
    Progress: number;
};

export const columns: ColumnDef<Topic>[] = [
    {
        accessorKey: "topic",
        header: "Topic",
    },
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "project",
        header: "Project",
    },
    {
        accessorKey: "budget",
        header: "Budget",
    },
    {
        accessorKey: "affected",
        header: "Affected",
        cell: ({ row }) => {
            const affected: string = row.getValue("affected");

            return (
                <div className="w-full flex justify-center items-center">
                    <div
                        className={cn(
                            "px-2 py-1 rounded-lg w-full text-center text-white text-xs font-bold",
                            affected === "No need" && "bg-blue-200",
                            affected === "Major need" && "bg-blue-700",
                            affected === "Minor need" && "bg-blue-400"
                        )}
                    >
                        {affected}
                    </div>
                </div>
            );
        },
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
                            status === "In Progress" && "bg-yellow-500",
                            status === "Finished" && "bg-green-500",
                            status === "Not Started" && "bg-gray-400",
                            status === "Cancelled" && "bg-red-500",
                            status === "Suspended" && "bg-blue-500"
                        )}
                    >
                        {status}
                    </div>
                </div>
            );
        },
    },

    {
        accessorKey: "Domain",
        header: "Domain",
        // cell: ({ row }) => {
        //     const domains: string[] = row.getValue("Domain");

        //     return (
        //         <div className="flex flex-col gap-2">
        //             {domains.map((domain) => (
        //                 <div className="px-2 py-1 rounded-lg w-full text-center text-white text-xs font-bold bg-gray-400">
        //                     {domain}
        //                 </div>
        //             ))}
        //         </div>
        //     );
        // },
    },
    {
        accessorKey: "Progress",
        header: "Progress",
        cell: ({ row }) => {
            const progress: number = row.getValue("Progress");
            console.log(progress);
            return (
                <div className="w-full flex justify-center items-center">
                    <Progress value={progress} />
                </div>
            );
        },
    },
];
