import React, { useState, useEffect, useRef } from "react";
import BillForm from "../components/BillForm";
import BillPreview from "../components/BillPreview";
import billAPI from "../api";
import { profileAPI } from "../../profiles/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBillPageContext } from "../BillPageContext";

const PakkaBillsPage = () => {
  const navigate = useNavigate();
  const { billPageState, registerFormHandlers } = useBillPageContext();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    products: [{ name: "", rate: 0, quantity: 1, inventoryItemId: null, warehouseId: null }],
    gstPercentage: 18,
    discount: 0,
    notes: "",
  });

  const totals = (() => {
    const subtotal = formData.products.reduce(
      (s, p) => s + Number(p.rate || 0) * Number(p.quantity || 0),
      0,
    );
    const discountAmount = Number(formData.discount) || 0;
    const gst = ((subtotal - discountAmount) * formData.gstPercentage) / 100;

    return {
      subtotal,
      discount: discountAmount,
      grandTotal: Math.max(0, subtotal + (gst || 0) - discountAmount),
    };
  })();

  const isFormValid =
    formData.buyer.clientName.trim() &&
    formData.products.every(
      (p) => p.name.trim() && p.rate > 0 && p.quantity > 0,
    );

  // Update context form validity
  useEffect(() => {
    billPageState.setIsFormValid(isFormValid);
  }, [isFormValid, billPageState]);

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

    billPageState.setSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        discount: Number(formData.discount) || 0,
        notes: formData.notes || "",
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
          products: [{ name: "", rate: 0, quantity: 1, inventoryItemId: null, warehouseId: null }],
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
      billPageState.setSubmitting(false);
    }
  };

  // Register form handlers with context
  useEffect(() => {
    registerFormHandlers(formData, setFormData, handleSave);
  }, [formData, registerFormHandlers, handleSave]);

  return (
    <div className="min-h-screen bg-gray-50 p-2 md:p-4 overflow-hidden">
      <div className="max-w-[1800px] mx-auto h-full flex flex-col">
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto pb-16">
          {billPageState.activeTab === "form" ? (
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
