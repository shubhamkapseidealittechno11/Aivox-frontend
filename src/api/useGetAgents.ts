import { useQuery } from "@tanstack/react-query";
import { UseUsersInput, UseUsersResponse } from "../types/Users";
import routes from "./routes";
import {  getApiAccessToken } from "./authToken";



const getAllAgentFn: ({
    sorting,
    columnFilters,
    pagination,
  }: UseUsersInput) => Promise<UseUsersResponse> = async ({ sorting, columnFilters, pagination }: UseUsersInput) => {

  // set pagingation
 // const accessToken: any = await getAccessToken();

  
   const accessToken: any = await getApiAccessToken();

  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;

  // set filter
    let search = "",
    status = "",
    role = "",
    from= "",
    noLimit = "",
    to = "",
    isDeleted=""


  for (const filter of columnFilters) {
    const id = filter.id,
      value = filter.value;
      switch (id) {
        case "name":
          search = value as string;
          break;
        case "noLimit":
          noLimit = value as string
          break;
          case "email":
          search = value as string;
            break;
        case "status":
          status = value as string;
          break;
          case "groupType":
            role = value as string;
            break;
        case "from":
            from = value as string;
            break;
        case "to":
            to = value as string;
            break;
             case "isDeleted":
            isDeleted = value as string;
            break;
      }
  }

  // set sorting
  let sorting_param = "";
  let direction = ""

 
  for (let i = 0; i < sorting.length; i++) {
    const id = sorting[i].id;
    direction = sorting[i].desc ? "desc" : "asc";
    sorting_param += id ;

    if (i !== sorting.length - 1) {
      sorting_param += ",";
    }
  }
  const offset = (page - 1) * per_page
  const url = await routes.AGENT_LIST()
  // {
  //   search: search.trim(),
  //   status: status,
  //   role : role,
  //   noLimit : noLimit,
  //   from:from,
  //   to:to,
  //   sorting_param: sorting_param,
  //   direction: direction,
  //   offset: offset,
  //   limit: per_page,
  //   isDeleted:isDeleted
  // }
  const response = await (await fetch(
    url, {
    headers: { Authorization: 'Bearer ' + accessToken }
  }
  ));
  const res= await response.json();
  res.status= response?.status;
  res.per_page = page * per_page
  return res;
};

export const useGetAgents = ({
  sorting,
  columnFilters,
  pagination,
}: UseUsersInput) => {

  const { data: allAgentData, isLoading: isAllDataLoading } = useQuery<
    UseUsersResponse
  >({
    queryKey: ["users", sorting, columnFilters, pagination],
    queryFn: () =>
      getAllAgentFn({
        sorting,
        columnFilters,
        pagination,
      }),
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 0, // Set stale time to 5 minutes (optional)
  });
  return { allAgentData, isAllDataLoading };
};
