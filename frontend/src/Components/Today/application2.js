
import "./Application2.css";
import { useNavigate } from "react-router-dom";

export default function TodayPage() {
    const nav = useNavigate();
    return(

        < div className = "Today">
            <h3>TODAY</h3>





            <div className = "up"> 
                < h1 className="title"><b>Today</b> 26 Dec</h1>
            </div>

            <div className="tasklist">
                <div className="task"><input type="checkbox"/><p>Drink 8 glasses of water<br/><span className="t health">HEALTH</span></p></div>
                <div className="task"><input type="checkbox"/><p>Edit the PDF<br/><span className="t work">WORK</span></p></div>
                <div className="task"><input type="checkbox"/><p>Write in a gratitude journal<br/><span className="t mental">MENTAL HEALTH</span></p></div>
                <div className="task small"><input type="checkbox"/><p>Get a notebook</p></div>
                <div className="task small"><input type="checkbox"/><p>Follow the youtube tutorial</p></div>
            </div>

        </ div>
    );


}