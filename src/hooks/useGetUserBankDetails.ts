import fetcher from "@/lib/fetcher";
import { UserDetails } from "@/types/user";
import useSWR from "swr";

const useGetUserBankDetails = () => {
  const { data, isValidating, error } = useSWR("/api/me", fetcher<UserDetails>);
  if (isValidating || !data || error) {
    return null;
  }
  return data;
};

export default useGetUserBankDetails;
