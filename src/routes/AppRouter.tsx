import { useAuth } from "@/contexts/auth"
import NotFound from "@/routes/NotFound"
import Profile from "@/routes/Profile"
import Settings from "@/routes/Settings"
import SignOut from "@/routes/SignOut"
import nookies from "nookies"
import { useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import AccessWrapper from "./AccessWrapper"
import MyDashboard from "./MyDashboard"
import ManageUsers from "./UserManagement/ManageUsers"
import RoleAssignment from "./UserManagement/RoleAssignment"
import RoleAssignmentConfiguration from "./UserManagement/RoleAssignmentConfiguration"
import RolePermission from "./UserManagement/RolePermission"
import UserIdCreation from "./UserManagement/UserIdCreation"
import api from "@/api/axiosInstance"
import AlarmTrace from "./Alarms/AlarmTrace"
import DigitalLog from "./DigitalLogbook/DigitalLog"
import MocDashboard from "@/components/moc/MocDashboard"
import MocRequestCreation from "./MocRequestManagement/MocRequestCreation"
import NextRequestForm from "./MocRequestManagement/NextRequestForm"
import RequestClosure from "@/components/MocClosure/RequestClosure"
import MocViewAll from "@/components/moc/MocViewAll"
import ReviewMocRequest from "@/components/MocReview/ReviewMocRequest"
import HiraReviewMocRequest from "@/components/MocHIRAReview/HiraReviewMocRequest"
import FinalNextReviewForm from "@/components/MocReview/FinalNextReviewForm"
import HiraNextReviewForm from "@/components/MocHIRAReview/HiraNextReviewForm"
import MocApproverMocRequest from "@/components/MocApprover/MocApproverMocRequest"
import MocNextApproverForm from "@/components/MocApprover/MocNextApproverForm"
import MocRequestDetails from "@/components/moc/MocRequestDetails"
import NotificationsPage from "@/components/Notifications/NotificationsPage"
import ReviewerClosure from "@/components/MocClosure/ReviewerClosure"
import ApproverClosure from "@/components/MocClosure/ApproverClosure"
import MocDraftFormCreation from "./MocRequestManagement/MocDraftFormCreation"
import ViewAllGatePass from "@/components/GatePass/ViewAllGatePass"
import GatePassDashboard from "@/components/GatePass/GatePassDashboard"
// import ReviewDashboard from "@/components/MocReview/ReviewDashboard"
// import ReviewDashboard from "@/components/MocReview/ReviewDashboard"

interface INavbarProps {
  isOpenMenu: boolean
}

const AppRouter: React.FunctionComponent<INavbarProps> = ({ isOpenMenu }) => {
  const { user, loading } = useAuth()
  const token = nookies.get(null).accessToken || ""
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [roleMap, setRoleMap] = useState(new Map())

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/api/SubMenus")
        console.log("Roles response:", response.data)
        const rolesMap = new Map<string, string[]>()
        response.data.forEach(
          (submenu: {
            subMenuName: string
            subMenuUrl: string
            getRoleList: { roleName: string }[]
          }) => {
            const roleNames = submenu.getRoleList.map((role) => role.roleName)
            const key = submenu.subMenuUrl || submenu.subMenuName
            rolesMap.set(key, roleNames)
          },
        )
        setRoleMap(rolesMap)
      } catch (error) {
        console.error("Error fetching roles:", error)
      } finally {
        setLoadingRoles(false)
      }
    }
    fetchRoles()
  }, [token])

  if (!loading && !loadingRoles) {
    return (
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isOpenMenu ? '80px' : '0px'
        }}
      >
        <Routes>
          {/* 👇 Default redirect */}
          {/* <Route path="/" element={<Navigate to="/station-operations/moc" replace />} /> */}
          <Route path="/" />
          <Route
            path="/my-dashboard"
            element={
              <MyDashboard
                user={user}
                isOpenMenu={isOpenMenu}
              />
            }
          />
          <Route
            path="/user-management/manage-user"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/manage-user")
                }
              >
                <ManageUsers />
              </AccessWrapper>
            }
          />
          <Route
            path="/user-management/manage-user/user-creation"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/manage-user")
                }
              >
                <UserIdCreation user={user} />
              </AccessWrapper>
              // <AccessWrapper
              //   user={user}
              //   accessRole={roleMap
              //     .get("/manage-users")
              //     ?.includes(user?.role || "")}
              // >
              //   {/* <UserIdCreation user={user} /> */}
              //   <MocRequestCreation />
              // </AccessWrapper>
            }
          />
          <Route
            path="/user-management/user-mapping"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/user-mapping")
                }
              >
                <RoleAssignment />
              </AccessWrapper>
            }
          />
          <Route
            path="/user-management/user-mapping/creation"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/user-mapping")
                }
              >
                <RoleAssignmentConfiguration user={user} />
              </AccessWrapper>
            }
          />
          <Route
            path="/user-management/roles-permissions"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/roles-permissions")
                }
              >
                <RolePermission />
              </AccessWrapper>
            }
          />
          <Route
            path="/"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-creation"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocRequestCreation />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/next-request-form"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <NextRequestForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/hira-reviewer/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <HiraReviewMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/hira-next-reviewer"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <HiraNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-closure/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <RequestClosure />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/viewAll"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocViewAll />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocRequestDetails />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/notifications"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <NotificationsPage />
              </AccessWrapper>
            }
          />
          {/*Moc Reviewer Dashboard Route*/}
          {/* <Route
            path="/station-operations/moc/ReviewDashboard"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <ReviewDashboard />
              </AccessWrapper>
            }
          /> */}
          <Route
            path="/station-operations/moc/HiraReview/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <HiraReviewMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/NextHiraReview/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <HiraNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/FinalReview/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <ReviewMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/NextFinalReview/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <FinalNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/approver/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <MocApproverMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/NextApprover/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <MocNextApproverForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/Moc/ReviewHiraRequest/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <FinalNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/FinalNextReviewer"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <FinalNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/approver"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocApproverMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/next-form-approver"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <MocNextApproverForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/utilities"
            element={
              <AccessWrapper
                user={user}
                accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
              >
                <RequestClosure />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-closure/creation/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <RequestClosure />
              </AccessWrapper>
            }
          />
            <Route
            path="/station-operations/moc/request-closure/reviewer/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <ReviewerClosure />
              </AccessWrapper>
            }
          />
 
          <Route
            path="/station-operations/moc/request-closure-approver"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <ApproverClosure />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-creation/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc") // ✅ parent route
                }
              >
                <MocDraftFormCreation />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass") // ✅ parent route
                }
              >
                <GatePassDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/viewAll"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass") // ✅ parent route
                }
              >
                <ViewAllGatePass />
              </AccessWrapper>
            }
          />
          {/* For Testing SignAL R -- Alarms Trace*/}
          <Route
            path="/alarms-trace"
            element={
              <AccessWrapper
                user={user}
                accessRole={roleMap
                  .get("/alarms-trace")
                  ?.includes(user?.role || "")}
              >
                {/* <SignalRTest genId={1} /> */}
                <AlarmTrace />
              </AccessWrapper>
            }
          />

          {/* For Alarms - Alarms Trends */}
          {/* <Route
          path="/alarms-trends"
          element={
            <AccessWrapper
              user={user}
              accessRole={roleMap
                .get("/alarms-trends")
                ?.includes(user?.role || "")}
            >
              <AlarmAndNotifications />
            </AccessWrapper>
          }
        /> */}
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<SignOut />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    )
  }
  return null
}

export default AppRouter
