import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Card, CardHeader, CardTitle } from "@/components/ui/cardUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconEye } from '@tabler/icons-react';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Intern = {
    intern: string;
    supervisor: string;
    topics: string[];
    accountStatus: "Online" | "Offline";
    internshipStatus: "In Progress" | "In Extension" | "Finished" | "Suspended";
    startDate: string;
    endDate: string;
    periodAchieved: number;
};

export const columns: ColumnDef<Intern>[] = [
    {
        accessorKey: "intern",
        header: "Intern",
        cell: ({ row }) => {
            const intern: string = row.getValue("intern");
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-center items-start">
                                <p className="text-base ">{intern}</p>
                                <div className="flex flex-col justify-center items-start text-xs text-gray-400">
                                    <p>email@example.com</p>
                                    <p>+12312345678</p>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                </Card>
            );
        },
    },
    {
        accessorKey: "supervisor",
        header: "Supervisor",
    },
    {
        accessorKey: "topics",
        header: "Topics",
    },
    {
        accessorKey: "accountStatus",
        header: "Account Status",
        cell: ({ row }) => {
            const status: string = row.getValue("accountStatus");

            return (
                <div className="w-full flex justify-center items-center">
                    <div
                        className={cn(
                            "px-2 py-1 rounded-lg w-full text-center text-white text-xs font-bold",
                            status === "Online" && "bg-green-500",
                            status === "Offline" && "bg-gray-400"
                        )}
                    >
                        {status}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "internshipStatus",
        header: "Internship Status",
        cell: ({ row }) => {
            const status: string = row.getValue("internshipStatus");

            return (
                <div className="w-full flex justify-center items-center">
                    <div
                        className={cn(
                            "px-2 py-1 rounded-lg w-full text-center text-white text-xs font-bold",
                            status === "In Progress" && "bg-yellow-500",
                            status === "Finished" && "bg-green-500",
                            status === "In Extension" && "bg-blue-500",
                            status === "Suspended" && "bg-red-500"
                        )}
                    >
                        {status}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "startDate",
        header: "Start Date",
    },
    {
        accessorKey: "endDate",
        header: "End Date",
    },
    {
        accessorKey: "periodAchieved",
        header: "Period Achieved",
        cell: ({ row }) => {
            const period: number = row.getValue("periodAchieved");
            return <p>{period} months</p>;
        },
    },
    {
        id: "applicationForm",
        header: "Application Form",
        cell: ({ row }) => {
            const intern = row.original;
            return (
                <div className="flex justify-center">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => {
                            // Navigate to intern detail page
                            window.location.href = `/dashboard/interns/${intern.intern.replace(/\s+/g, '-').toLowerCase()}`;
                        }}
                        title="View Application Form" 
                        aria-label="View Application Form" 
                        className="h-8 w-8"
                    >
                        <IconEye stroke={2} className="w-5 h-5 text-gray-600" />
                    </Button>
                </div>
            );
        },
    },
];
