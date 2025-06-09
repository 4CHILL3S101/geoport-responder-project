import {
  FETCH_REPORTS_ROUTES,
  SERVER_IP,
  SERVER_PORT,
  UPDATE_REPORT,
} from "@env";
import authapi from "../utils/auth/authapi";
import noauthapi from "../utils/noauth/noauthapi";
import { auth } from "../firebaseConfig";

export default class ReportController {
  async fetchReport(setReportData) {
    let socket = null;
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not logged in");
        return;
      }

      let token = await user.getIdToken();
      const url = `ws://${SERVER_IP}:${SERVER_PORT}/${FETCH_REPORTS_ROUTES}?token=${token}`;

      if (!socket || socket.readyState === WebSocket.CLOSED) {
        socket = new WebSocket(url);

        socket.onopen = () => {
          console.log("WebSocket Connected!");
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            let filteredData = this.filterReports(data);
            setReportData(filteredData);
          } catch (error) {
            console.error("Error parsing WebSocket data:", error);
          }
        };

        socket.onerror = (error) => {
          console.error("WebSocket Error:", error);
        };

        socket.onclose = () => {
          console.log("WebSocket Disconnected! Reconnecting...");
          setTimeout(() => this.fetchReport(setReportData), 5000);
        };
      }
    } catch (error) {
      console.error("Error in fetchReport:", error);
    }
  }

  async updateReport({
    report_id,
    status,
    value,
    currentVersion,
    setResponseModalStatus,
    setResponseMessage,
  }) {
    try {
      if (status === "Resolved") {
        status = "Solved";
      }

      let user = auth.currentUser;
      if (!user) {
        console.error("user not logged in");
        return;
      }
      let id = user.uid;

      const data = { report_id, status, value, currentVersion };
      let url = `${UPDATE_REPORT}/${id}`;

      const response = await authapi.patch(url, data);

      if (response.status === 200) {
        setResponseModalStatus("success");
        setResponseMessage("Report updated successfully");
        return "Successful update of report";
      } else {
        setResponseModalStatus("error");
        setResponseMessage("Failed to update report");
        return "Failed to update report";
      }
    } catch (error) {
      setResponseModalStatus("error");
      setResponseMessage(
        error.response?.data.message || "Failed to update report"
      );
    }
  }

  filterReports(data) {
    const filteredData = data.filter((report) => {
      return report.status !== "Solved";
    });
    return filteredData;
  }
}
