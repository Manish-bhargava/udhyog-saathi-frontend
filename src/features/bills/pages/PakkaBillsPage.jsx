import React, { useState, useEffect, useRef } from "react";
import BillForm from "../components/BillForm";
import BillPreview from "../components/BillPreview";
import billAPI from "../api";
import { profileAPI } from "../../profiles/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PakkaBillsPage = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [isDragging, setIsDragging] = useState(false);
  const [formWidth, setFormWidth] = useState(50);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await profileAPI.getProfile();
        if (response.success) {
          setBusinessData(response.data);
          if (
            !response.data.company?.GST ||
            !response.data.company?.companyName
          ) {
            toast.error("Profile Incomplete", {
              description:
                "A valid GST and Company Name are required for Pakka Bills.",
            });
          }
        }
      } catch (err) {
        toast.error("Error fetching profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, []);

  const [formData, setFormData] = useState({
    buyer: { clientName: "", clientAddress: "", clientGst: "" },
    products: [{ name: "", rate: 0, quantity: 1 }],
    gstPercentage: 18,
    discount: 0,
    notes: "",
  });

  const totals = (() => {
    const subtotal = formData.products.reduce(
      (s, p) => s + Number(p.rate || 0) * Number(p.quantity || 0),
      0,
    );
    const discountAmount = Number(formData.discount) || 0; // Treat as Amount
    const gst = ((subtotal - discountAmount) * formData.gstPercentage) / 100;

    return {
      subtotal,
      discount: discountAmount,
      grandTotal: Math.max(0, subtotal + (gst || 0) - discountAmount),
    };
  })();

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const handleDrag = (e) => {
    if (!isDragging || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - containerRect.left;
    let newWidth = (mouseX / containerRect.width) * 100;
    setFormWidth(Math.max(30, Math.min(70, newWidth)));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
    }
    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, [isDragging]);

  const handleSave = async () => {
    if (!businessData?.company?.GST || !businessData?.company?.companyName) {
      toast.error("Profile Incomplete", {
        description:
          "A valid GST and Company Name are required for Pakka Bills. Please update your profile.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        discount: Number(formData.discount) || 0, // Send raw amount
        notes: formData.notes || "", // Send notes
      };
      const response = await billAPI.createPakkaBill(formData);
      if (response.success) {
        toast.success("Invoice Created!", {
          description: "Your GST invoice is ready.",
          action: {
            label: "View Dashboard",
            onClick: () => navigate("/dashboard"),
          },
        });

        setFormData({
          buyer: { clientName: "", clientAddress: "", clientGst: "" },
          products: [{ name: "", rate: 0, quantity: 1 }],
          gstPercentage: 18,
          discount: 0,
          notes: "",
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to Save Invoice.";
      toast.error("Failed to Save", { description: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    formData.buyer.clientName.trim() &&
    formData.products.every(
      (p) => p.name.trim() && p.rate > 0 && p.quantity > 0,
    );

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4 overflow-hidden">
      <div className="max-w-[1800px] mx-auto h-full flex flex-col">
        {/* HEADER */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3 mb-4">
          <div className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-sm md:text-lg font-bold text-gray-900 truncate">
                Pakka Bill
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[8px] md:text-[10px] font-bold uppercase rounded">
                Tax Invoice
              </span>

              {!businessData?.company?.companyName && (
                <div className="hidden lg:flex items-center gap-1.5 ml-4 px-2 py-1 bg-red-50 border border-red-100 rounded text-[10px] text-red-600">
                  <span className="font-bold">Note:</span> Complete onboarding in Settings.
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* SEGMENTED TOGGLE */}
              <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  className={`px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all ${
                    activeTab === "form"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTab("form")}
                >
                  Edit Form
                </button>
                <button
                  className={`px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md transition-all ${
                    activeTab === "preview"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }`}
                  onClick={() => setActiveTab("preview")}
                >
                  View Preview
                </button>
              </div>

              <button
                onClick={() => setFormData({
                  buyer: { clientName: "", clientAddress: "", clientGst: "" },
                  products: [{ name: "", rate: 0, quantity: 1 }],
                  gstPercentage: 18,
                  discount: 0,
                  notes: "",
                })}
                className="px-3 py-1.5 border border-gray-300 text-gray-600 text-[10px] md:text-xs font-medium rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={handleSave}
                disabled={submitting || !isFormValid}
                className={`px-4 py-1.5 text-[10px] md:text-xs font-bold rounded-md text-white shadow-sm transition-all ${
                  submitting || !isFormValid ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {submitting ? "Saving..." : "Save Invoice"}
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto pb-16">
          {activeTab === "form" ? (
            <BillForm formData={formData} setFormData={setFormData} />
          ) : (
            <div className="flex justify-center bg-gray-50 p-4">
              <div className="w-full max-w-[900px] shadow-lg rounded-xl overflow-hidden border border-gray-200 bg-white">
                {!loading && (
                  <BillPreview
                    formData={formData}
                    totals={totals}
                    isKachaBill={false}
                    companyDetails={{
                      companyName: businessData?.company?.companyName,
                      companyAddress: businessData?.company?.companyAddress,
                      companyEmail: businessData?.company?.companyEmail,
                      companyLogo: businessData?.company?.companyLogo,
                      companyStamp: businessData?.company?.companyStamp,
                      companySignature: businessData?.company?.companySignature,
                      GST: businessData?.company?.GST,
                      bankName: businessData?.bankDetails?.bankName,
                      accountNumber: businessData?.bankDetails?.accountNumber,
                      IFSC: businessData?.bankDetails?.IFSC,
                    }}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PakkaBillsPage;
