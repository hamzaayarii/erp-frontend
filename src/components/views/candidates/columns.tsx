import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { IconEye, IconTrash } from '@tabler/icons-react';
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Candidate = {
    id: string;
    fullName: string;
    topicId: string;
    availabilityDate: string;
    duration: string;
    mustEndDate: string;
    score: number;
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

export const columns: ColumnDef<Candidate>[] = [
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
        accessorKey: "score",
        header: "score",
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
        accessorKey: "actions",
        id: "actions",
        header: () => (
            <div className="text-gray-500 text-xs font-medium uppercase tracking-wider">Actions</div>
        ),
        enableResizing: true,
        size: 120,
        cell: ({ row }) => {
            const candidate = row.original;
            
            const handleViewDetails = () => {
                // Open application form in new tab
                window.open(candidate.applicationForm, '_blank', 'noopener,noreferrer');
            };

            const handleArchiveToggle = () => {
                // This will be handled by the parent component through event delegation
                const event = new CustomEvent('candidateArchiveToggle', { 
                    detail: { candidateId: candidate.id } 
                });
                window.dispatchEvent(event);
            };

            const handleDelete = () => {
                // This will be handled by the parent component through event delegation
                const event = new CustomEvent('candidateDelete', { 
                    detail: { candidateId: candidate.id } 
                });
                window.dispatchEvent(event);
            };

            const isActive = ["Accepted", "Pending", "Affected", "Rejected", "Banned"].includes(candidate.status);

            return (
                <div className="flex items-center justify-center gap-1.5">
                    <Button variant="ghost" size="icon" onClick={handleViewDetails} title="View Application Form" aria-label="View Application Form" className="h-8 w-8">
                        <IconEye stroke={2} className="w-5 h-5 text-gray-600" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleArchiveToggle}
                        title={isActive ? "Archive Candidate" : "Unarchive Candidate"}
                        aria-label={isActive ? "Archive Candidate" : "Unarchive Candidate"}
                        className="h-8 w-8"
                    >
                        {isActive ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 18l4-4l-1.4-1.4l-1.6 1.6V10h-2v4.2l-1.6-1.6L8 14zm-7 3q-.825 0-1.412-.587T3 19V6.525q0-.35.113-.675t.337-.6L4.7 3.725q.275-.35.687-.538T6.25 3h11.5q.45 0 .863.188t.687.537l1.25 1.525q.225.275.338.6t.112.675V19q0 .825-.587 1.413T19 21zm.4-15h13.2l-.85-1H6.25z"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                <path fill="currentColor" d="m21.706 5.292l-2.999-2.999A1 1 0 0 0 18 2H6a1 1 0 0 0-.707.293L2.294 5.292A1 1 0 0 0 2 6v13c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6a1 1 0 0 0-.294-.708M6.414 4h11.172l1 1H5.414zM14 14v3h-4v-3H7l5-5l5 5z"></path>
                            </svg>
                        )}
                    </Button>
                    
                </div>
            );
        },
    },
];
