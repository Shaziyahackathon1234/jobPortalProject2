import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "../utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCompanyById = (COMPANY_ID) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        // 🔥 clear old data (important)
        dispatch(setSingleCompany(null));

        const res = await axios.get(
          `${COMPANY_API_END_POINT}/get/${COMPANY_ID}`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (COMPANY_ID) {
      fetchSingleCompany();
    }
  }, [COMPANY_ID, dispatch]);
};

export default useGetCompanyById;