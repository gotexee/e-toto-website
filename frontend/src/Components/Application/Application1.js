import "./Application1.css";
import { useNavigate, Link } from "react-router-dom";
import calendarImg from "../Assets/calendar.png"; 


export default function Application1() {

  const go = useNavigate();

  return (
    <div className="app">
      <div className="left">
        <h2 className="hello">HELLO (name)👋</h2>
        <div className="box" onClick={() => go("/today")}>TODAY</div>
        <div className="box light" onClick={() => go("/history")}>HISTORY</div>
      </div>

      <div className="right">
        <h1 className="title"><b>Today</b> 26 Dec</h1>

        <div className="bloc">Summary</div>

        <div className="leftt">
          <div className="box" onClick={() => go("/today")}>TODAY</div>
          <div className="box light" onClick={() => go("/history")}>HISTORY</div>
        </div>

        <div className="tasklist">
          <div className="task"><input type="checkbox"/><p>Drink 8 glasses of water<br/><span className="t health">HEALTH</span></p></div>
          <div className="task"><input type="checkbox"/><p>Edit the PDF<br/><span className="t work">WORK</span></p></div>
          <div className="task"><input type="checkbox"/><p>Write in a gratitude journal<br/><span className="t mental">MENTAL HEALTH</span></p></div>
          <div className="task small"><input type="checkbox"/><p>Get a notebook</p></div>
          <div className="task small"><input type="checkbox"/><p>Follow the youtube tutorial</p></div>
          <div className="button_container">
          <Link to="/todolist">
            <button>
              <img
                src={calendarImg}
                alt="Calendar"
                style={{ width: 40, height: 40 }}
              />
            </button>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
