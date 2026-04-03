import React, { useState, useEffect, useRef } from "react";
import BillForm from "../components/BillForm";
import BillPreview from "../components/BillPreview";
import billAPI from "../api";
import { profileAPI } from "../../profiles/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBillPageContext } from "../BillPageContext";

const getTodayDateInput = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const KachaBillsPage = () => {
  const navigate = useNavigate();
  const { billPageState, registerFormHandlers } = useBillPageContext();
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
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
          if (!response.data.company?.companyName) {
            toast.error("Onboarding Required", {
              description:
                "Please complete your business profile in Settings to enable billing.",
            });
          }
        }
      } catch (err) {
        if (err.response?.status === 404 || err.response?.status === 403) {
          toast.error("Complete your profile setup to start creating bills.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyDetails();
  }, []);

  const [formData, setFormData] = useState({
    buyer: { clientName: "", clientAddress: "", clientGst: "" },
    products: [{ name: "", rate: 0, quantity: 1, inventoryItemId: null, warehouseId: null }],
    invoiceDate: "",
    discount: 0,
    notes: "",
  });

  const totals = (() => {
    const subtotal = formData.products.reduce(
      (s, p) => s + Number(p.rate || 0) * Number(p.quantity || 0),
      0,
    );
    const discountAmount = Number(formData.discount) || 0;
    const gst = 0;

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
    setShowValidation(true);
    if (!businessData?.company?.companyName) {
      toast.error("Action Blocked", { description: "Onboarding required." });
      return;
    }

    billPageState.setSubmitting(true);
    try {
      const { invoiceDate, ...restFormData } = formData;
      const payload = {
        ...restFormData,
        requestedInvoiceDate: invoiceDate || getTodayDateInput(),
      };
      const response = await billAPI.createKachaBill(payload);

      if (response.success) {
        toast.success("Kacha Bill Created!", {
          description: "Your proforma invoice has been saved.",
          action: {
            label: "View Dashboard",
            onClick: () => navigate("/dashboard"),
          },
        });

        setFormData({
          buyer: { clientName: "", clientAddress: "", clientGst: "" },
          products: [{ name: "", rate: 0, quantity: 1, inventoryItemId: null, warehouseId: null }],
          invoiceDate: "",
          discount: 0,
          notes: "",
        });
        setShowValidation(false);
      }
    } catch (err) {
      toast.error("Failed to Save");
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
            <BillForm formData={formData} setFormData={setFormData} isKachaBill={true} showValidation={showValidation} />
          ) : (
            <div className="flex justify-center bg-gray-50 p-4">
              <div className="w-full max-w-[420px] sm:max-w-[560px] md:max-w-[760px] origin-top">
                {!loading && (
                  <BillPreview
                    formData={formData}
                    totals={totals}
                    isKachaBill={true}
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

export default KachaBillsPage;
