import { useEffect, useState } from "react";
import { Candidate, columns } from "../components/views/candidates/columns";
import { DataTable } from "../components/views/candidates/dataTable";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaLock } from 'react-icons/fa';
import moment from "moment";

async function getData(): Promise<Candidate[]> {
    return [
        {
            id: "728ed52f",
            fullName: "John Doe",
            topic: "123456",
            deposit: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            status: "accepted",
            lastAction: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            applicationForm: "candidates/:1",
        },
        {
            id: "728ed52f",
            fullName: "John Doe",
            topic: "123456",
            deposit: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            status: "pending",
            lastAction: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            applicationForm: "candidates/:2",
        },
        {
            id: "728ed52f",
            fullName: "John Doe",
            topic: "123456",
            deposit: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            status: "rejected",
            lastAction: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            applicationForm: "candidates/:3",
        },
        {
            id: "728ed52f",
            fullName: "John Doe",
            topic: "123456",
            deposit: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            status: "affected",
            lastAction: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            applicationForm: "candidates/:4",
        },
    ];
}
async function getArchiveData(): Promise<Candidate[]> {
    return [
        {
            id: "728ed52f",
            fullName: "John Doe",
            topic: "123456",
            deposit: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            status: "accepted",
            lastAction: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            applicationForm: "candidates/:5",
        },
        {
            id: "728ed52f",
            fullName: "John Doe",
            topic: "123456",
            deposit: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            status: "pending",
            lastAction: moment(new Date()).format("DD/MM/YYYY h:mm:ss"),
            applicationForm: "candidates/:6",
        },
    ];
}

export default function Settings() {
    const [data, setData] = useState<Candidate[]>([]);
    const [tab, setTab] = useState<"active" | "archive">("active");

    useEffect(() => {
        async function getTableData() {
            if (tab === "active") {
                const data = await getData();
                setData(data);
                return;
            } else {
                const data = await getArchiveData();
                setData(data);
                return;
            }
        }
        getTableData();
    }, [tab]);

    return (
        <div className="min-h-screen pr-5">
            <div className="flex flex-col gap-10">
                
                <div className="flex flex-col gap-10">
                    <div className="flex gap-6 items-center justify-end">
                        
                        <div className="flex items-center gap-2">
                            <Button>Filter</Button>
                            <FaLock className="w-3 h-3 fill-[#E53E3E]" />
                        </div>
                    </div>
                    <div className="bg-white px-10 py-5 rounded-lg">
                        <Tabs
                            defaultValue="active"
                            className="w-full"
                            onValueChange={(value) =>
                                setTab(value as "active" | "archive")
                            }
                        >
                            <TabsList className="w-full">
                                <TabsTrigger value="active" className="w-full">
                                    Active
                                </TabsTrigger>
                                <TabsTrigger value="archive" className="w-full">
                                    Archive
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="active">
                                <DataTable columns={columns} data={data} tableId="projects" />
                            </TabsContent>
                            <TabsContent value="archive">
                                <DataTable columns={columns} data={data} tableId="projects" />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}