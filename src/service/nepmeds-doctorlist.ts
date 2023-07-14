import { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { IGetDoctorProfile } from "./nepmeds-doctor-profile";
import { PaginatedResponse, api } from "./service-api";
import { HttpClient } from "./service-axios";

export const getDoctorList = async ({
  page_no,
  status,
  from_date,
  to_date,
  specialization,
  page_size,
  name,
}: {
  page_no: number;
  page_size: number;
  status?: string;
  from_date?: string;
  to_date?: string;
  specialization?: string;
  name?: string;
}) => {
  let apiUrl = `${api.registereddoctor}/?page=${page_no}&page_size=${page_size}`;
  if (specialization) {
    apiUrl += `&specialization=${specialization}`;
  }
  if (status) {
    apiUrl += `&status=${status}`;
  }
  if (from_date) {
    apiUrl += `&created_at__date__gte=${from_date}`;
  }
  if (to_date) {
    apiUrl += `&created_at__date__lte=${to_date}`;
  }
  if (name) {
    apiUrl += `?user__name__icontains=${name}`;
  }
  const response = await HttpClient.get<PaginatedResponse<IGetDoctorProfile>>(
    apiUrl
  );
  return response;
};

export const useDoctorList = ({
  page_no,
  status,
  from_date,
  to_date,
  specialization,
  page_size,
  name,
}: {
  page_no: number;
  status?: string;
  from_date?: string;
  to_date?: string;
  page_size?: number;
  specialization?: string;
  name?: string;
}) => {
  let apiUrl = `${api.registereddoctor}/?page=${page_no}&page_size=${page_size}`;
  if (specialization) {
    apiUrl += `&specialization=${specialization}`;
  }
  if (status) {
    apiUrl += `&status=${status}`;
  }
  if (from_date) {
    apiUrl += `&created_at__date__gte=${from_date}`;
  }
  if (to_date) {
    apiUrl += `&created_at__date__lte=${to_date}`;
  }
  if (name) {
    apiUrl += `?user__name__icontains=${name}`;
  }
  return useQuery(
    apiUrl,
    () =>
      getDoctorList({
        page_no: page_no,
        status: status,
        from_date: from_date,
        to_date: to_date,
        name: name,
        specialization: specialization,
        page_size: page_size ?? 10,
      }),
    {
      select: data => data.data.data,
    }
  );
};

const deleteDoctorList = async (id: number) => {
  console.log(id);
  const response = await HttpClient.delete(api.registereddoctor + `${id}/`);
  return response;
};

export const useDeleteDoctorData = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<AxiosResponse<any, any>, unknown, number>(
    id => deleteDoctorList(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(api.registereddoctor);
        queryClient.fetchQuery(api.registereddoctor);
      },
    }
  );

  return mutation;
};
