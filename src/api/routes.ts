import moment from 'moment';
const userBaseUrl: any = `${process.env.NEXT_PUBLIC_USER_API}`;
const imgUploadBaseUrl: any = `${process.env.NEXT_PUBLIC_AWS_UPLOAD}`;
const contentBaseApi: any = `${process.env.NEXT_PUBLIC_CONTENT_API}`;
const awsHostBaseApi: any = `${process.env.NEXT_PUBLIC_AWS_HOST}`;
const notificationHostBaseApi: any = `${process.env.NEXT_PUBLIC_NOTIFICATION_HOST}`;
const activityHostBaseApi: any = `${process.env.NEXT_PUBLIC_ACTIVITY_HOST}`;



const routes = {

  AGENT_LIST: (params: any) =>
    `${userBaseUrl}agents?${
      params?.search !== "" ? `search=${params?.search}&` : ""}${params?.noLimit !== "" ? `pagination=${params?.noLimit}&` : ""
    }${params?.status !== "" ? `status=${params?.status}&` : ""}${params?.role !== "" ? `role=${params?.role}&` : ""
    }${params?.from !== "" ? `startDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${params?.to !== "" ? `endDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
    }${params?.direction !== "" ? `orderType=${params?.direction}&` : ""}offset=${params?.offset}&limit=${params?.limit}`,

  CREATE_AGENT:() =>`http://192.168.1.175:5000/api/agents`,
  // AGENT_LIST:() =>`http://192.168.1.175:5000/api/agents?active_only=false`,
  DELETE_AGENT:(id:any) =>`http://192.168.1.175:5000/api/agents/${id}`,
  USER_DETAIL: (id: any) => `http://192.168.1.175:5000/api/agents/${id}`,
  SYNC_AGENT:() =>`${userBaseUrl}conversations`,
  SAVE_CHAT:(id:any) =>`${userBaseUrl}conversations/${id}/messages`,
  SAVE_N8N_CHAT:() =>`${userBaseUrl}save-conversation`,
  GET_CONVERSATIONS: (params:any) => `${userBaseUrl}conversations?${params?.search !== "" ? `search=${params?.search}&` : ""}${params?.noLimit !== "" ? `pagination=${params?.noLimit}&` : ""
    }${params?.status !== "" ? `status=${params?.status}&` : ""}${params?.role !== "" ? `role=${params?.role}&` : ""
    }${params?.from !== "" ? `startDate=${moment(params?.from).format('YYYY-MM-DD')}&` : ""}${params?.to !== "" ? `endDate=${moment(params?.to).format('YYYY-MM-DD')}&` : ""}${params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
    }${params?.direction !== "" ? `orderType=${params?.direction}&` : ""}offset=${params?.offset}&limit=${params?.limit}`,

  OPEN_CONVERSATION: (id: string) => `${userBaseUrl}messages/${id}`,
  EDIT_PROMPT: (id: string) => `${userBaseUrl}agents/${id}`,



  USER_BULK_RECORD_LIST: (params: any) =>
      `${userBaseUrl}userExcelRecord?${
        params?.search !== "" ? `search=${params?.search}&` : ""}${params?.status !== "" ? `status=${params?.status}&` : ""}${params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
      }${params?.direction !== "" ? `orderType=${params?.direction}&` : ""}offset=${params?.offset}&limit=${params?.limit}`,

   
  USER_UPDATE:() => `${userBaseUrl}update-profile`,
  USER_DETAIL_BY_ID: (id: any) => `${userBaseUrl}details/${id}`,
  USER_DELETE: (id:any) => `${userBaseUrl}account-delete/${id}`,
  BULK_USER_DELETE: (id:any) => `${userBaseUrl}deleteExcel/${id}`,

  BULK_USER_TEMP_DETAIL: (params: any) => `${userBaseUrl}userExcelRecord?${params?.id !== "" ? `id=${params?.id}&` : ""}${params?.status !== "" ? `status=${params?.status}&` : ""}${params?.sorting_param !== "" ? `orderBy=${params?.sorting_param}&` : ""
    }${params?.direction !== "" ? `orderType=${params?.direction}&` : ""}offset=${params?.offset}&limit=${params?.limit}`,


  DASHBOARD_COUNTS: () => `${userBaseUrl}dashboard`,
  CONTENT: (id: string) => `content_pages/${id}`,
 

  ADMIN_PROFILE: () => `${userBaseUrl}profile`,
  UPDATE_PROFILE:(id:any) => `${userBaseUrl}update-profile`,
  CHANGE_PASSWORD: () => `${userBaseUrl}changePassword`,

  INVALIDATE_CACHE: () => `${awsHostBaseApi}content-invalid`,
  CONTENT_UPLOAD_URL:() => `${awsHostBaseApi}pre-signed`,
  MOVE_CONTENT:() => `${awsHostBaseApi}file`,

  LOGIN:() => `${userBaseUrl}auth/login`,
  SIGN_UP:() => `${userBaseUrl}auth/signup`,

  FORGOT_PASSWORD:() => `${userBaseUrl}forgotPassword`,
  OTP_VERIFY:() => `${userBaseUrl}forgotPassword/verify`,
  RESET_PASSWORD:() => `${userBaseUrl}resetPassword`,
  RESEND_OTP:() => `${userBaseUrl}forgotPassword/resendOtp`,


  GET_CONTENT:(id:any)=>`${contentBaseApi}content_pages/${id}.json`,

  CONFIG_DETAIL: () => `${activityHostBaseApi}configuration/1`,

  ADD_Category: () => `${activityHostBaseApi}admin/category`,
  UPDATE_Category: (id:any) => `${activityHostBaseApi}admin/category/${id}`,
  DELETE_Category: (id:any) => `${activityHostBaseApi}admin/category/${id}`,


  };





export default routes;
