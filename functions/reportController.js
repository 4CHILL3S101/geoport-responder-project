import {FETCH_REPORTS_ROUTES,SERVER_IP,SERVER_PORT} from "@env"
import { auth } from '../firebaseConfig';    



export default class ReportController{


        async updateReport(setReportData){
                    let socket = null;
                    const user = auth.currentUser;

                    if (!user) {
                        console.error('User not logged in');
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
                                setReportData(data);  
                            } catch (error) {
                                console.error("Error parsing WebSocket data:", error);
                            }
                        };

                        socket.onerror = (error) => {
                            console.error("WebSocket Error:", error);
                        };

                        socket.onclose = () => {
                            console.log("WebSocket Disconnected! Reconnecting...");
                            setTimeout(() => fetchReports(setReportData), 5000);  
                        };
                    }
                } catch(error) {
                    console.error("Error in fetchReports:", error);
                }
    

    removeReport(){
        
    }


}