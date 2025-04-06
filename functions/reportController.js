import {FETCH_REPORTS_ROUTES,SERVER_IP,SERVER_PORT,UPDATE_REPORT} from "@env"
import { auth } from '../firebaseConfig';    
import axios  from 'axios';




export default class ReportController {

    
    async fetchReport(setReportData) {
        let socket = null;
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('User not logged in');
                return;
            }

            let token = await user.getIdToken();
            const url = `ws://${SERVER_IP}:${SERVER_PORT}/${FETCH_REPORTS_ROUTES}?token=${token}`;
            console.log("WebSocket URL:", url);

            if (!socket || socket.readyState === WebSocket.CLOSED) {
                socket = new WebSocket(url);

                socket.onopen = () => {
                    console.log("WebSocket Connected!");
                };

                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        let filteredData = this.filterReports(data);
                        console.log("Filtered Data:", filteredData);
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


   async updateReport(report_id,status){
        try{

            if(status === "Resolved"){
                status = "Solved";
            }
            
            const data = { report_id,  status};
            console.log(status);
            let url = `http://${SERVER_IP}:${SERVER_PORT}/${UPDATE_REPORT}`
            const response = await axios.patch(url, {
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),  
            });
        
            if (!response.ok) {
              throw new Error('Cannot delete report');
            }
        
            return 'Successful deletion of report';
        }catch(error){
            console.error("Error in updateReport:", error);
        }
    }



    filterReports(data){
        const filteredData = data.filter(report => {
            return report.status !== 'Solved';
        });
        return filteredData;
    }

}