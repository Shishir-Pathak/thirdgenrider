import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const PackageBookingContext = createContext(null);

export function PackageBookingProvider({ children }) {
  const [isPackageBookingOpen, setIsPackageBookingOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const openPackageBookingForm = useCallback((pkg = null) => {
    setSelectedPackage(pkg);
    setIsPackageBookingOpen(true);
  }, []);

  const closePackageBookingForm = useCallback(() => {
    setIsPackageBookingOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isPackageBookingOpen,
      selectedPackage,
      openPackageBookingForm,
      closePackageBookingForm,
    }),
    [
      isPackageBookingOpen,
      selectedPackage,
      openPackageBookingForm,
      closePackageBookingForm,
    ],
  );

  return (
    <PackageBookingContext.Provider value={value}>
      {children}
    </PackageBookingContext.Provider>
  );
}

export function usePackageBooking() {
  const ctx = useContext(PackageBookingContext);
  if (!ctx) {
    throw new Error(
      "usePackageBooking must be used within PackageBookingProvider",
    );
  }
  return ctx;
}
