
'use client'
import { useAppSelector } from "@/lib/hooks";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
const PermissionContext = createContext({})

export const RolePermissionProvider = ({ children }: any) => {
    const { user }: any = useAppSelector((state: any) => state.auth);
    const [permissionDetail, setPermissionDetail]: any = useState(null);
    const pathname = usePathname()

    const checkPermission = () => {
        let path = pathname?.split('/')?.[1];
        path == "Government officials" ? path = "govt-officials" : "";
        const role = {
            can_view: user?.userRole == 'admin' ? user?.userRole == 'admin' : user?.rolePermission?.includes(`${path?.toLocaleLowerCase()}_can_view`),
            can_edit: user?.userRole == 'admin' ? user?.userRole == 'admin' : user?.rolePermission?.includes(`${path?.toLocaleLowerCase()}_can_edit`),
            can_add: user?.userRole == 'admin' ? user?.userRole == 'admin' : user?.rolePermission?.includes(`${path?.toLocaleLowerCase()}_can_add`),
        };
        setPermissionDetail(role);
    }

    return (
        <PermissionContext.Provider value={{ permissionDetail, checkPermission }}>
            {children}
        </PermissionContext.Provider>
    )
}

export const usePermissionContext = () => {
    return useContext(PermissionContext)
}