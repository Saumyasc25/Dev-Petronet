import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  File,
  FileSpreadsheet,
  FileText,
  Download,
} from "lucide-react";
import MocTopHeader from "./MocTopHeader";
import api from "@/api/axiosInstance";
import TimelineStepCard from "./TimelineStepCard";
import MocRequestCreation from "@/routes/MocRequestManagement/MocRequestCreation";
import NextRequestForm from "@/routes/MocRequestManagement/NextRequestForm";
import MocNextApproverForm from "../MocApprover/MocNextApproverForm";
import ViewMocForm from "./ViewMocForm";
import ParentViewMocForm from "./ParentViewMocForm";
import HiraReviewMocRequest from "../MocHIRAReview/HiraReviewMocRequest";
import ParentViewHiraForm from "./ParentViewHiraForm";
import ViewMocClosure from "./ViewMocClosure";

interface DocumentItem {
  id: number;
  name: string;
  icon: React.ElementType;
}

interface MocDetails {
  approved_date: string | null | undefined;
  approver_name: any;
  sic_approved_date: any;
  sic_name: any;
  hira_approved_date: string | null | undefined;
  submission_date: string | null | undefined;
  hira_reviewer_name: any;
  moc_request_no: string;
  title: string;
  created_by: string;
  priority: string;
  station_name: string;
  date: string;
  documents: DocumentItem[];
  comments: string | null | undefined;
  reviewer_comments: string | null | undefined;
  sic_comments: string | null | undefined;
  approver_comments: string | null | undefined;
}

const MocRequestDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("MOC Form");
  const [mocDetails, setMocDetails] = useState<MocDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [mocId, setMocId] = useState<number | null>(null); 

  // Extract moc_request_no from URL and decode it
  const moc_request_no = decodeURIComponent(
    location.pathname.replace("/station-operations/", "")
  );
  const formatDateTime = (dateString?: string | null): string => {
  if (!dateString) return "-"; // handle null or undefined

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-"; // handle invalid dates

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
};
  useEffect(() => {
    const fetchMocDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/MOC/GetMocRequest?moc_request_no=${encodeURIComponent(
            moc_request_no
          )}`
        );

        const record = res.data;
        if (!record) {
          console.warn("⚠️ No MOC record found for request:", moc_request_no);
          setMocDetails(null);
          return;
        }
        setMocId(record.moc_request_id ?? record.id ?? null);

        setMocDetails({
          moc_request_no: record.moc_request_no,
          title: record.title || "-",
          created_by: record.created_by || "-",
          priority: record.priority || "-",
          station_name: record.station_name || "-",
          date: record.date || "-",
          documents: [],
          hira_reviewer_name: record.hira_reviewer_name || null,
          hira_approved_date: record.hira_approved_date || null,
          sic_name: record.sic_name || null,
          sic_approved_date: record.sic_approved_date || null,
          approver_name: record.approver_name || null,
          approved_date: record.approved_date || null,
          comments: record.comments || null,
          reviewer_comments: record.reviewer_comments || null,
          sic_comments: record.sic_comments || null,
          approver_comments: record.approver_comments || null,
          submission_date: record.submission_date || null,
        });
      } catch (err) {
        console.error("🚨 Failed to fetch MOC details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMocDetails();
  }, [moc_request_no]);
  
  useEffect(() => {
    if(!mocId) {
    setDocuments([]); // ensure documents cleared if no id
    return;
    }
    const controller = new AbortController();
    const fetchDocs = async () => {
      try {
        const documentResponse = await api.get(`/moc/files/by-id/${mocId}`, {
          signal: controller.signal,
        });
        const documentList: DocumentItem[] = documentResponse.data.map((doc: any) => ({
          id: doc.id,
          name: doc.filename,
          icon: File,
        }));
        setDocuments(documentList);
      } catch (err: any) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          // request was cancelled
          return;
        }
        console.error("Failed to fetch documents:", err);
        setDocuments([]); // degrade gracefully
      }
    };

    fetchDocs();

    return () => {
      controller.abort();
    };
  }, [mocId]);

  const tabs = [
    "MOC Form",
    "HIRA Form",
    "Documents",
    "Approval Timeline",
    "MOC Closure Form",
  ];
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading details...</div>
      </div>
    );
  }

  if (!mocDetails) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No MOC details found for this request.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 overflow-y-auto">
      <MocTopHeader
        title={mocDetails.moc_request_no}
        subTitle={mocDetails.title}
        showAddButton={false}
      />

      {/* 🔹 Info Row */}
      <div className="grid grid-cols-4 divide-x bg-white rounded-md mt-2 mx-4 shadow">
        <div className="p-3">
          <p className="text-sm text-gray-500">Requestor</p>
          <p className="font-medium text-gray-800">{mocDetails.created_by}</p>
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500">Priority</p>
          <p className="font-medium text-gray-800">{mocDetails.priority}</p>
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500">Station</p>
          <p className="font-medium text-gray-800">{mocDetails.station_name}</p>
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium text-gray-800">{mocDetails.date}</p>
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex border-b text-sm font-medium text-gray-500 mt-1 mx-4 bg-white rounded-t-md">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 cursor-pointer ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-gray-700"
            }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* 🔹 Tab Content */}
      <div className="flex-1 px-8 py-2 mx-4 bg-white rounded-b-md shadow overflow-y-auto">
        {activeTab === "MOC Form" && (
          <p className="text-gray-600">
            <ParentViewMocForm moc_request_no={mocDetails.moc_request_no} />
          </p>
        )}

        {activeTab === "HIRA Form" && (
          <p className="text-gray-600">
            <ParentViewHiraForm moc_request_no={mocDetails.moc_request_no}/>
          </p>
        )}

        {/* ✅ Documents Tab */}

        {activeTab === "Documents" && (
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            Attached Documents
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Supporting documents and revisions
          </p>

          {documents.length > 0 ? (
            <div className="divide-y">
              {documents.map((doc) => {
                const Icon = doc.icon;
                return (
                  <div key={doc.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <Icon className="text-blue-600 h-5 w-5" />
                      <span className="text-gray-800 font-medium">
                        {doc.name}
                      </span>
                    </div>
                    <button
                      onClick={async () => {
                        try {
                          const response = await api.get(`/moc/files/download/${doc.id}`, {
                            responseType: 'blob'
                          });
                          
                          const url = window.URL.createObjectURL(new Blob([response.data]));
                          const link = document.createElement('a');
                          link.href = url;
                          link.setAttribute('download', doc.name);
                          
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        } catch (error) {
                          console.error('Download failed:', error);
                        }
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic">No attachments available.</p>
          )}
        </div>
      )}




        {activeTab === "Approval Timeline" && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Approval Timeline
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Track the progress of this MoC request
          </p>

          {/* ✅ Timeline Steps */}
          <div className="space-y-6">
            <TimelineStepCard
              title="Submitted"
              person={mocDetails.created_by ? `${mocDetails.created_by} • Requestor` : "N/A"}
              comment={mocDetails.comments ?? undefined}
              date={formatDateTime(mocDetails.submission_date)}
              completed
            />
            <TimelineStepCard
              title="HIRA Reviewed"
              person={
                mocDetails.hira_reviewer_name? `${mocDetails.hira_reviewer_name} • Reviewer`  : "N/A"              
              }
              comment={mocDetails.reviewer_comments ?? undefined }
              date={formatDateTime(mocDetails.hira_approved_date)}
              completed={!!mocDetails.hira_approved_date}
            />
            <TimelineStepCard
              title="Under Review"
              person={mocDetails.sic_name ? `${mocDetails.sic_name} • Station Incharge` : "N/A"}
              comment= {mocDetails.sic_comments ?? undefined}
              date={formatDateTime(mocDetails.sic_approved_date)}
              completed={!!mocDetails.sic_approved_date}
            />
            <TimelineStepCard
              title="Pending Approval"
              person={mocDetails.approver_name ? `${mocDetails.approver_name} • Approver` : "N/A"}
              comment={mocDetails.approver_comments ?? undefined}
              date={formatDateTime(mocDetails.approved_date)}
              completed={!!mocDetails.approved_date}
            />
          </div>
        </div>
      )}
        {activeTab === "MOC Closure Form" && (
          <p className="text-gray-600">
            <ViewMocClosure  moc_request_no={mocDetails.moc_request_no}/>
          </p>
        )}
      </div>
      {/* ✅ Back Button */}
      <div className="flex justify-end px-3 py-3  bg-white  shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-400 hover:bg-gray-300 text-gray-800 text-xs px-5 py-2 rounded-lg shadow-sm transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default MocRequestDetails;
