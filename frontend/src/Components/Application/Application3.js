
import "./Application3.css";
import { useNavigate } from "react-router-dom";

export default function Application3() {
  const go = useNavigate();
  return (
    <div className="page">
      <h1 className="title"><b>Today</b> 26 Dec</h1>

      <div className="content">
        <h2 className="hist">HISTORY</h2>

        <div className="taskbox">
          <div className="task">
            <input type="checkbox" />
            <p>6 Task CATEGORY :<br/><span className="t health">HEALTH</span></p>
          </div>

          <div className="task">
            <input type="checkbox" />
            <p>4 tasks CATEGORY :<br/><span className="t sport">SPORT</span></p>
          </div>

          <div className="task big">
            <input type="checkbox" />
            <p>Write in a gratitude journal<br/><span className="t mental">MENTAL HEALTH</span></p>

            <div className="sub"><input type="checkbox" /> Get a notebook</div>
            <div className="sub"><input type="checkbox" /> Follow the youtube tutorial</div>
          </div>
        </div>

        <div className="back" onClick={() => go("/Application")}>←</div>
      </div>
    </div>
  );
}
