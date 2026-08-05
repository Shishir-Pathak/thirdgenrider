import { useCallback, useEffect, useState } from "react";
import { apiUrl } from "../lib/api";

export function useCompanyDetails() {
	const [details, setDetails] = useState(null);
	const [loading, setLoading] = useState(true);

	const loadCompanyDetails = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(apiUrl("/api/company-details"));
			if (!res.ok) {
				setDetails(null);
				return;
			}
			setDetails(await res.json());
		} catch {
			setDetails(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadCompanyDetails();
	}, [loadCompanyDetails]);

	return { details, loading, loadCompanyDetails };
}
