import React, { useEffect, useState } from "react"
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react"
import api from "@/api/axiosInstance"

function MocTopCards() {
  const [cardData, setCardData] = useState({
    total_requests: 0,
    pending_review: 0,
    approved: 0,
    rejected: 0,
  })

  useEffect(() => {
    const fetchMocCounts = async () => {
      try {
        const storedUser = localStorage.getItem("userData")
        const parsedUser = storedUser ? JSON.parse(storedUser) : null
        const userId = parsedUser?.userId

        if (!userId) {
          console.error("❌ userId not found in localStorage")
          return
        }

        const res = await api.get(`/api/MOC/TotalCount`, {
          params: { user_id: userId },
        })

        if (res.data?.data) {
          setCardData(res.data.data)
          console.log("✅ MOC Data:", res.data.data)
        } else {
          console.error("⚠️ Invalid response:", res.data)
        }
      } catch (error) {
        console.error("🚨 Failed to fetch MOC counts:", error)
      }
    }

    fetchMocCounts()
  }, [])

  // ✅ Use dynamic values from API
  const cards = [
    { name: "Total Requests", value: cardData.total_requests, icon: FileText, iconColor: "text-blue-500" },
    { name: "Pending Review", value: cardData.pending_review, icon: Clock, iconColor: "text-orange-500" },
    { name: "Approved", value: cardData.approved, icon: CheckCircle, iconColor: "text-green-500" },
    { name: "Rejected", value: cardData.rejected, icon: XCircle, iconColor: "text-red-500" },
  ]

  return (
    <div className="w-full px-1 rounded-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 rounded-md">
        {cards.map((card, index) => {
          const Icon = card.icon
          return (
            <div
              key={index}
              className="bg-white rounded-md duration-200 p-2 border border-gray-300"
            >
              <div className="flex items-center justify-between ml-5">
                <h6 className="text-sm font-semibold text-gray-600">{card.name}</h6>
                <Icon className={`h-6 w-6 mr-5 mt-2 ${card.iconColor}`} />
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-800 ml-5">
                  {card.value}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MocTopCards