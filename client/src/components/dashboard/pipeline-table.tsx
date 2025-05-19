import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Pipeline } from "@/types";
import { Rocket, CheckCircle, XCircle, AlertTriangle, Play } from "lucide-react";

interface PipelineTableProps {
  pipelines: Pipeline[];
}

export default function PipelineTable({ pipelines }: PipelineTableProps) {
  const statusIcons = {
    passed: <CheckCircle className="mr-1 h-4 w-4" />,
    failed: <XCircle className="mr-1 h-4 w-4" />,
    warning: <AlertTriangle className="mr-1 h-4 w-4" />,
    running: <Play className="mr-1 h-4 w-4" />,
  };

  const statusClasses = {
    passed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
  };

  const columns = [
    {
      key: "name",
      title: "Pipeline",
      render: (pipeline: Pipeline) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 text-gray-400">
            <Rocket className="h-4 w-4" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{pipeline.name}</div>
            <div className="text-xs text-gray-500">{pipeline.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (pipeline: Pipeline) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[pipeline.status]}`}>
          {statusIcons[pipeline.status]} {pipeline.status.charAt(0).toUpperCase() + pipeline.status.slice(1)}
        </span>
      ),
    },
    { key: "branch", title: "Branch" },
    { key: "lastRun", title: "Last Run" },
    { key: "duration", title: "Duration" },
    {
      key: "actions",
      title: "",
      render: () => (
        <div className="text-right">
          <a href="#" className="text-primary-600 hover:text-primary-900">
            Details
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">CI/CD Pipeline Status</h2>
        <p className="mt-1 text-sm text-gray-500">Overview of build, test, and deployment workflows</p>
      </div>

      <div className="px-6 py-5">
        <DataTable columns={columns} data={pipelines} />
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">Showing {pipelines.length} of {pipelines.length} pipelines</span>
        </div>
        <Button>
          <span className="-ml-1 mr-2">+</span>
          Create New Pipeline
        </Button>
      </div>
    </div>
  );
}
