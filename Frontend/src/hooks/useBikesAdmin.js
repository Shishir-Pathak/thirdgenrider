import { useCallback, useEffect, useRef, useState } from "react";
import { authFetch } from "../lib/api";
import { focusFirstFormError, validateImageFile } from "../lib/formValidation";
import { parseApiError } from "../lib/parseApiError";
import { toast } from "react-toastify";
export function emptyBikeDraft() {
  return {
    name: "",
    price: "",
    model: "",
    color: "",
    plateNumber: "",
    chassisNumber: "",
    engineNumber: "",
    mileage: "",
    available: true,
    engineCapacity: "",
    blueBookNumber: "",
  };
}

export function bikeToDraft(bike) {
  return {
    name: bike.name,
    price: String(bike.price || bike.pricePerDay || ""),
    model: bike.model || "",
    color: bike.color || "",
    plateNumber: bike.plateNumber || "",
    chassisNumber: bike.chassisNumber || "",
    engineNumber: bike.engineNumber || "",
    mileage: String(bike.mileage ?? ""),
    available: bike.available ?? true,
    engineCapacity: String(bike.engineCapacity ?? ""),
    blueBookNumber: bike.blueBookNumber || "",
  };
}

function validateRequiredText(value, label) {
  return value.trim() ? "" : `${label} is required.`;
}

function validateNonNegativeNumber(value, label) {
  const parsed = Number(value);
  if (!String(value).trim() || !Number.isFinite(parsed) || parsed < 0) {
    return `Enter a valid ${label}.`;
  }
  return "";
}

export function useBikesAdmin(isBike = true) {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [formModal, setFormModal] = useState(null);
  const [draft, setDraft] = useState(emptyBikeDraft);
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [imageDeleteSubmitting, setImageDeleteSubmitting] = useState(null);
  const [imageDeleteError, setImageDeleteError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const imageInputRef = useRef(null);
  const licenseImageInputRef = useRef(null);
  const blueBookImagesInputRefs = useRef([]);

  const loadBikes = useCallback(async () => {
    setListError("");
    setLoading(true);
    try {
      const res = await authFetch(`/api/bikes?isBike=${isBike ? 1 : 0}`);
      if (!res.ok) throw new Error(await parseApiError(res));
      setBikes(await res.json());
    } catch (err) {
      setListError(err.message || "Failed to load vehicles.");
      setBikes([]);
    } finally {
      setLoading(false);
    }
  }, [isBike]);

  useEffect(() => {
    loadBikes();
  }, [loadBikes]);

  useEffect(() => {
    if (!formModal) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setFormModal(null);
        setFormError("");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [formModal]);

  useEffect(() => {
    if (!deleteTarget) return;
    const onKey = (e) => {
      if (e.key === "Escape") setDeleteTarget(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteTarget]);

  const resetImageInput = () => {
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (licenseImageInputRef.current) licenseImageInputRef.current.value = "";
    for (const input of blueBookImagesInputRefs.current) {
      if (input) input.value = "";
    }
  };

  const openAdd = () => {
    setDraft(emptyBikeDraft());
    setFormError("");
    resetImageInput();
    setFormModal({ mode: "add" });
  };

  const openEdit = (bike) => {
    setDraft(bikeToDraft(bike));
    setFormError("");
    resetImageInput();
    setFormModal({ mode: "edit", bike });
  };

  const closeForm = () => {
    setFormModal(null);
    setFormError("");
    setImageDeleteError("");
  };

  const applyUpdatedBike = async (updatedBike) => {
    setBikes((items) =>
      items.map((item) => (item.id === updatedBike.id ? updatedBike : item)),
    );
    setFormModal((current) =>
      current?.bike?.id === updatedBike.id
        ? { ...current, bike: updatedBike }
        : current,
    );
  };

  // Toggle vehicle availability (List / Delist)
  const toggleAvailability = async (bike) => {
    try {
      const res = await authFetch(`/api/bikes/${bike.id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !bike.available }),
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      const updated = await res.json();
      await applyUpdatedBike(updated);
    } catch (err) {
      setListError(err.message || "Failed to toggle vehicle listing status.");
    }
  };

  const deleteLicenseImage = async (targetBike = formModal?.bike) => {
    const bike = targetBike;
    if (!bike?.licenseImage) return;
    if (!window.confirm("Delete this license image?")) return;

    setImageDeleteSubmitting(`${bike.id}-license`);
    setImageDeleteError("");
    try {
      const res = await authFetch(`/api/bikes/${bike.id}/license-image`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      await applyUpdatedBike(await res.json());
    } catch (err) {
      setImageDeleteError(err.message || "Failed to delete license image.");
    } finally {
      setImageDeleteSubmitting(null);
    }
  };

  const deleteBlueBookImage = async (index, targetBike = formModal?.bike) => {
    const bike = targetBike;
    if (!bike?.blueBookImages?.[index]) return;
    if (!window.confirm("Delete this bluebook image?")) return;

    setImageDeleteSubmitting(`${bike.id}-bluebook-${index}`);
    setImageDeleteError("");
    try {
      const res = await authFetch(
        `/api/bikes/${bike.id}/bluebook-images/${index}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error(await parseApiError(res));
      await applyUpdatedBike(await res.json());
    } catch (err) {
      setImageDeleteError(err.message || "Failed to delete bluebook image.");
    } finally {
      setImageDeleteSubmitting(null);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const name = draft.name.trim();
    const priceNum = Number.parseFloat(draft.price);
    const mileageNum = Number(draft.mileage || 0);
    const engineCapacityNum = Number(draft.engineCapacity || 0);
    const file = imageInputRef.current?.files?.[0];
    const licenseFile = licenseImageInputRef.current?.files?.[0];
    const blueBookFiles = blueBookImagesInputRefs.current.flatMap((input) =>
      Array.from(input?.files || []),
    );

    const validationError =
      validateRequiredText(name, "Name") ||
      validateRequiredText(draft.model, "Model") ||
      validateRequiredText(draft.color, "Color") ||
      validateRequiredText(draft.plateNumber, "Plate number") ||
      validateRequiredText(draft.chassisNumber, "Chassis number") ||
      validateRequiredText(draft.engineNumber, "Engine number") ||
      validateRequiredText(draft.blueBookNumber, "Blue book number") ||
      validateNonNegativeNumber(draft.price, "price per day") ||
      validateNonNegativeNumber(draft.mileage, "mileage") ||
      validateNonNegativeNumber(draft.engineCapacity, "engine capacity") ||
      validateImageFile(file, {
        label: "Vehicle image",
        required: formModal.mode === "add",
      }) ||
      validateImageFile(licenseFile, { label: "License image" }) ||
      blueBookFiles
        .map((blueBookFile) =>
          validateImageFile(blueBookFile, { label: "Bluebook image" }),
        )
        .find(Boolean) ||
      "";

    if (validationError) {
      setFormError(validationError);
      focusFirstFormError(e.currentTarget);
      return;
    }

    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", String(priceNum));
    fd.append("model", draft.model.trim());
    fd.append("color", draft.color.trim());
    fd.append("plateNumber", draft.plateNumber.trim());
    fd.append("chassisNumber", draft.chassisNumber.trim());
    fd.append("engineNumber", draft.engineNumber.trim());
    fd.append("mileage", String(mileageNum));
    fd.append("available", String(Boolean(draft.available)));
    fd.append("engineCapacity", String(engineCapacityNum));
    fd.append("blueBookNumber", draft.blueBookNumber.trim());
    fd.append("isBike", String(isBike));
    if (file) fd.append("image", file);
    if (licenseFile) fd.append("licenseImage", licenseFile);
    for (const blueBookFile of blueBookFiles) {
      fd.append("blueBookImages", blueBookFile);
    }

    setFormSubmitting(true);
    setFormError("");
    try {
      const url =
        formModal.mode === "add"
          ? "/api/bikes"
          : `/api/bikes/${formModal.bike.id}`;
      const res = await authFetch(url, {
        method: formModal.mode === "add" ? "POST" : "PUT",
        body: fd,
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      await loadBikes();
      closeForm();
      toast.success(
        res?.data?.message || res?.message || "Submitted Successfully",
      );
    } catch (err) {
      setFormError(
        err?.response?.data?.message || err.message || "Something went wrong.",
      );
      toast.error(
        err?.response?.data?.message || err.message || "Something went wrong.",
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    try {
      const res = await authFetch(`/api/bikes/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await parseApiError(res));
      await loadBikes();
      setDeleteTarget(null);
      toast.success("Deleted Succesfully");
    } catch (err) {
      setListError(err.message || "Failed to delete vehicle.");
      setDeleteTarget(null);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return {
    bikes,
    loading,
    listError,
    loadBikes,
    formModal,
    draft,
    setDraft,
    formError,
    formSubmitting,
    imageDeleteSubmitting,
    imageDeleteError,
    imageInputRef,
    licenseImageInputRef,
    blueBookImagesInputRefs,
    deleteTarget,
    setDeleteTarget,
    deleteSubmitting,
    openAdd,
    openEdit,
    closeForm,
    submitForm,
    toggleAvailability,
    deleteLicenseImage,
    deleteBlueBookImage,
    confirmDelete,
  };
}
