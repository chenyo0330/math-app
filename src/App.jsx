import { useMemo, useState } from "react";

/* =========================
   共用工具
========================= */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

/* =========================
   單元一：加減法出題
========================= */
function generateArithmeticQuestion() {
  const isAdd = Math.random() < 0.5;

  if (isAdd) {
    let a, b;
    do {
      a = Math.floor(Math.random() * 9) + 1;
      b = Math.floor(Math.random() * 9) + 1;
    } while (a + b <= 10 || a + b > 18);

    return {
      type: "add",
      a,
      b,
      answer: a + b,
    };
  }

  let a, b;
  do {
    a = Math.floor(Math.random() * 8) + 11;
    b = Math.floor(Math.random() * 9) + 1;
  } while (b <= a % 10 || b > a);

  return {
    type: "sub",
    a,
    b,
    answer: a - b,
  };
}

/* =========================
   單元二：時鐘出題
========================= */
function generateClockQuestion(stage) {
  const hour = randomInt(1, 12);

  if (stage === 1) {
    const minute = Math.random() < 0.5 ? 0 : 30;
    return { hour, minute };
  }

  if (stage === 2) {
    const minuteChoices = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const minute = minuteChoices[randomInt(0, minuteChoices.length - 1)];
    return { hour, minute };
  }

  return { hour, minute: randomInt(0, 59) };
}

/* =========================
   共用輸入框
========================= */
function PinkInput({ value, onFocusField, isActive }) {
  return (
    <input
      value={value}
      readOnly
      onFocus={onFocusField}
      onClick={onFocusField}
      style={{
        width: 70,
        height: 60,
        border: isActive ? "4px solid #ff7ac8" : "3px solid #eea9d4",
        background: "#fff",
        color: "#2b39d1",
        fontSize: 24,
        letterSpacing: "1px",
        textAlign: "center",
        boxSizing: "border-box",
        outline: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    />
  );
}

function AnswerInput({ value, onFocusField, isActive, placeholder = "--" }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      readOnly
      onClick={onFocusField}
      style={{
        width: 140,
        height: 56,
        fontSize: 32,
        textAlign: "center",
        border: isActive ? "3px solid #4e7ed9" : "2px solid #aaa",
        borderRadius: 8,
        background: "#fff",
        color: "#222",
        outline: "none",
        cursor: "pointer",
      }}
    />
  );
}

/* =========================
   單元一：拆解圖
========================= */
function AddSplitDiagram({
  b,
  leftValue,
  rightValue,
  setActiveField,
  activeField,
}) {
  return (
    <div style={{ marginTop: 6 }}>
      <svg width="220" height="190" viewBox="0 0 220 190">
        <text x="110" y="24" textAnchor="middle" fontSize="28" fill="#2b39d1">
          {b}
        </text>

        <line x1="110" y1="38" x2="75" y2="78" stroke="#777" strokeWidth="2" />
        <line x1="110" y1="38" x2="145" y2="78" stroke="#777" strokeWidth="2" />
        <line x1="0" y1="16" x2="75" y2="98" stroke="#777" strokeWidth="2" />

        <foreignObject x="40" y="78" width="70" height="60">
          <PinkInput
            value={leftValue}
            onFocusField={() => setActiveField("splitLeft")}
            isActive={activeField === "splitLeft"}
          />
        </foreignObject>

        <foreignObject x="120" y="78" width="70" height="60">
          <PinkInput
            value={rightValue}
            onFocusField={() => setActiveField("splitRight")}
            isActive={activeField === "splitRight"}
          />
        </foreignObject>

        <line x1="75" y1="140" x2="75" y2="158" stroke="#777" strokeWidth="2" />
        <text
          x="75"
          y="184"
          textAnchor="middle"
          fontSize="24"
          fill="#2b39d1"
        >
          10
        </text>
      </svg>
    </div>
  );
}

function SubSplitDiagram({
  a,
  leftValue,
  rightValue,
  setActiveField,
  activeField,
}) {
  return (
    <div style={{ marginTop: 12 }}>
      <svg width="220" height="150" viewBox="0 0 220 150">
        <text x="110" y="24" textAnchor="middle" fontSize="28" fill="#2b39d1">
          {a}
        </text>

        <line x1="110" y1="38" x2="75" y2="78" stroke="#777" strokeWidth="2" />
        <line x1="110" y1="38" x2="145" y2="78" stroke="#777" strokeWidth="2" />

        <foreignObject x="40" y="78" width="70" height="60">
          <PinkInput
            value={leftValue}
            onFocusField={() => setActiveField("splitLeft")}
            isActive={activeField === "splitLeft"}
          />
        </foreignObject>

        <foreignObject x="120" y="78" width="70" height="60">
          <PinkInput
            value={rightValue}
            onFocusField={() => setActiveField("splitRight")}
            isActive={activeField === "splitRight"}
          />
        </foreignObject>
      </svg>
    </div>
  );
}

function ArithmeticExplanation({ type, a, b }) {
  const ones = a % 10;

  if (type === "add") {
    const need = 10 - a;
    const remain = b - need;

    return (
      <div
        style={{
          fontSize: 28,
          color: "#2b39d1",
          textAlign: "center",
          lineHeight: "1.8",
        }}
      >
        <div>
          {a} + {need} = 10
        </div>
        <div>10 + {remain} =</div>
      </div>
    );
  }

  const first = 10 - b;

  return (
    <div
      style={{
        fontSize: 28,
        color: "#222",
        textAlign: "center",
        lineHeight: "1.8",
      }}
    >
      <div>10 − {b} = {first}</div>
      <div>
        {first} + {ones} =
      </div>
    </div>
  );
}

/* =========================
   共用數字鍵盤
========================= */
const keypadBtnStyle = {
  width: "72px",
  height: "58px",
  fontSize: "24px",
  borderRadius: "12px",
  border: "none",
  background: "#4e7ed9",
  color: "#fff",
  cursor: "pointer",
};

function KeypadPanel({ activeLabel, onPress, onDelete, onClear }) {
  return (
    <div
      style={{
        minHeight: "320px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 10,
      }}
    >
      <div>
        <div
          style={{
            textAlign: "center",
            marginBottom: 12,
            fontSize: "18px",
            color: "#666",
          }}
        >
          {activeLabel}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 72px)",
            gap: 12,
            justifyContent: "center",
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => onPress(String(num))}
              style={keypadBtnStyle}
            >
              {num}
            </button>
          ))}

          <button onClick={onDelete} style={keypadBtnStyle}>
            刪除
          </button>

          <button onClick={() => onPress("0")} style={keypadBtnStyle}>
            0
          </button>

          <button onClick={onClear} style={keypadBtnStyle}>
            清空
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================
   共用頂部
========================= */
function TopBar({ title, leftButton, rightButton }) {
  return (
    <div
      style={{
        background: "#d8e5fb",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div>{leftButton}</div>

      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: 30,
          fontWeight: 500,
          color: "#111",
        }}
      >
        {title}
      </div>

      <div>{rightButton || <div style={{ width: 110 }} />}</div>
    </div>
  );
}

/* =========================
   結果區
========================= */
function ResultBlock({ text, color, buttonText, onClick }) {
  return (
    <div style={{ textAlign: "center", marginTop: 24 }}>
      <div
        style={{
          color,
          fontSize: 40,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        {text}
      </div>
      <button
        onClick={onClick}
        style={{
          minWidth: 130,
          height: 52,
          fontSize: 24,
          border: "none",
          borderRadius: 8,
          background: "#727892",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {buttonText}
      </button>
    </div>
  );
}

/* =========================
   共用樣式
========================= */
const smallBackBtn = {
  border: "none",
  background: "#727892",
  color: "#fff",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 18,
  cursor: "pointer",
};

const menuBtnStyle = {
  border: "none",
  background: "#4e7ed9",
  color: "#fff",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 18,
  cursor: "pointer",
};

const confirmBtnStyle = {
  minWidth: 150,
  height: 56,
  fontSize: 24,
  border: "none",
  borderRadius: 8,
  background: "#4e7ed9",
  color: "#fff",
  cursor: "pointer",
};

function homeCardStyle(bg) {
  return {
    border: "none",
    borderRadius: 20,
    padding: "28px 20px",
    background: bg,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };
}

function stageCardStyle(bg) {
  return {
    border: "none",
    borderRadius: 18,
    padding: "24px 20px",
    background: bg,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  };
}

/* =========================
   單元一：加減法
========================= */
function ArithmeticPractice({ onBack }) {
  const [question, setQuestion] = useState(generateArithmeticQuestion());
  const [splitLeft, setSplitLeft] = useState("");
  const [splitRight, setSplitRight] = useState("");
  const [inputAnswer, setInputAnswer] = useState("");
  const [status, setStatus] = useState("");
  const [activeField, setActiveField] = useState("answer");

  const { type, a, b, answer } = question;
  const operator = type === "add" ? "+" : "-";
  const ones = a % 10;

  const titleText = useMemo(() => {
    return type === "add" ? `${a}加${b}是多少？` : `${a}比${b}大多少？`;
  }, [type, a, b]);

  function handleCheck() {
    const left = Number(splitLeft);
    const right = Number(splitRight);
    const ans = Number(inputAnswer);

    let splitCorrect = false;

    if (type === "add") {
      const need = 10 - a;
      const remain = b - need;
      splitCorrect = left === need && right === remain;
    } else {
      splitCorrect = left === 10 && right === ones;
    }

    const answerCorrect = ans === answer;

    if (splitCorrect && answerCorrect) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  }

  function handleNext() {
    setQuestion(generateArithmeticQuestion());
    setSplitLeft("");
    setSplitRight("");
    setInputAnswer("");
    setStatus("");
    setActiveField("answer");
  }

  function handleRetry() {
    setInputAnswer("");
    setStatus("");
    setActiveField("answer");
  }

  function handleKeypadPress(value) {
    if (activeField === "splitLeft") {
      setSplitLeft((prev) => {
        if (prev.length >= 2) return prev;
        return prev + value;
      });
      return;
    }

    if (activeField === "splitRight") {
      setSplitRight((prev) => {
        if (prev.length >= 2) return prev;
        return prev + value;
      });
      return;
    }

    setInputAnswer((prev) => {
      if (prev.length >= 2) return prev;
      return prev + value;
    });
  }

  function handleKeypadDelete() {
    if (activeField === "splitLeft") {
      setSplitLeft((prev) => prev.slice(0, -1));
      return;
    }

    if (activeField === "splitRight") {
      setSplitRight((prev) => prev.slice(0, -1));
      return;
    }

    setInputAnswer((prev) => prev.slice(0, -1));
  }

  function handleKeypadClear() {
    if (activeField === "splitLeft") {
      setSplitLeft("");
      return;
    }

    if (activeField === "splitRight") {
      setSplitRight("");
      return;
    }

    setInputAnswer("");
  }

  const activeLabel =
    activeField === "splitLeft"
      ? "正在輸入：左邊粉紅框"
      : activeField === "splitRight"
      ? "正在輸入：右邊粉紅框"
      : "正在輸入：答案";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 950,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <TopBar
        title={titleText}
        leftButton={
          <button onClick={onBack} style={smallBackBtn}>
            返回首頁
          </button>
        }
      />

      <div style={{ padding: "28px 28px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <KeypadPanel
            activeLabel={activeLabel}
            onPress={handleKeypadPress}
            onDelete={handleKeypadDelete}
            onClear={handleKeypadClear}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {type === "add" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  fontSize: 60,
                  color: "#2b39d1",
                  marginTop: 20,
                  fontWeight: 400,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div>{a}</div>
                </div>

                <div style={{ marginLeft: 10 }}>{operator}</div>

                <div style={{ textAlign: "center", marginLeft: 10 }}>
                  <div>{b}</div>
                  <AddSplitDiagram
                    b={b}
                    leftValue={splitLeft}
                    rightValue={splitRight}
                    setActiveField={setActiveField}
                    activeField={activeField}
                  />
                </div>

                <div style={{ marginLeft: 10 }}>=</div>
                <div
                  style={{
                    marginLeft: 10,
                    color: status === "correct" ? "#d74444" : "#2b39d1",
                  }}
                >
                  {status === "correct" ? answer : "?"}
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  fontSize: 60,
                  color: "#2b39d1",
                  marginTop: 20,
                  fontWeight: 400,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div>{a}</div>
                  <SubSplitDiagram
                    a={a}
                    leftValue={splitLeft}
                    rightValue={splitRight}
                    setActiveField={setActiveField}
                    activeField={activeField}
                  />
                </div>

                <div style={{ marginLeft: 10 }}>{operator}</div>
                <div style={{ marginLeft: 10 }}>{b}</div>
                <div style={{ marginLeft: 10 }}>=</div>
                <div
                  style={{
                    marginLeft: 10,
                    color: status === "correct" ? "#d74444" : "#2b39d1",
                  }}
                >
                  {status === "correct" ? answer : "?"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#d8efec",
          borderTop: "1px solid #c4dfdb",
          padding: "20px 20px 30px",
          marginTop: 10,
        }}
      >
        <ArithmeticExplanation type={type} a={a} b={b} />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            marginTop: 22,
            flexWrap: "wrap",
          }}
        >
          <AnswerInput
            value={inputAnswer}
            onFocusField={() => setActiveField("answer")}
            isActive={activeField === "answer"}
            placeholder="答案"
          />

          <button onClick={handleCheck} style={confirmBtnStyle}>
            確認答案
          </button>
        </div>

        {status === "correct" && (
          <ResultBlock
            text="✓ 正確！"
            color="#25a344"
            buttonText="下一題"
            onClick={handleNext}
          />
        )}

        {status === "wrong" && (
          <ResultBlock
            text="✕ 再試一次"
            color="#d74c4c"
            buttonText="重試"
            onClick={handleRetry}
          />
        )}
      </div>
    </div>
  );
}

/* =========================
   時鐘元件
========================= */
function ClockFace({ hour, minute, variant = "sun", stage = 1 }) {
  const center = 150;

  function handPoint(length, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + length * Math.cos(rad),
      y: center + length * Math.sin(rad),
    };
  }

  const minuteAngle = minute * 6;
  const hourAngle = ((hour % 12) + minute / 60) * 30;
  const secondAngle = 0;

  const hourPt = handPoint(54, hourAngle);
  const minutePt = handPoint(78, minuteAngle);
  const secondPt = handPoint(88, secondAngle);

  const frame =
    variant === "sun"
      ? {
          outer: "#ffcc4d",
          inner: "#fffaf0",
          bg: "#e9f6ff",
          minuteText: "#ff7f2a",
        }
      : variant === "rainbow"
      ? {
          outer: "#9bd0ff",
          inner: "#fffef7",
          bg: "#f6f0ff",
          minuteText: "#2e7bd2",
        }
      : {
          outer: "#9bd18b",
          inner: "#fffef7",
          bg: "#eef8ea",
          minuteText: "#2d8a37",
        };

  return (
    <svg width="320" height="320" viewBox="0 0 300 300">
      {variant === "sun" && (
        <>
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 360) / 16;
            const p1 = handPoint(128, angle);
            const p2 = handPoint(144, angle - 7);
            const p3 = handPoint(144, angle + 7);
            return (
              <polygon
                key={i}
                points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`}
                fill="#ffb11b"
              />
            );
          })}
        </>
      )}

      {variant === "rainbow" && (
        <>
          <path
            d="M30 120 A120 120 0 0 1 270 120"
            fill="none"
            stroke="#ffb3b3"
            strokeWidth="18"
          />
          <path
            d="M40 120 A110 110 0 0 1 260 120"
            fill="none"
            stroke="#ffd28f"
            strokeWidth="16"
          />
          <path
            d="M50 120 A100 100 0 0 1 250 120"
            fill="none"
            stroke="#fff08f"
            strokeWidth="14"
          />
          <path
            d="M60 120 A90 90 0 0 1 240 120"
            fill="none"
            stroke="#baf2a1"
            strokeWidth="12"
          />
          <path
            d="M70 120 A80 80 0 0 1 230 120"
            fill="none"
            stroke="#9bd0ff"
            strokeWidth="10"
          />
          <path
            d="M80 120 A70 70 0 0 1 220 120"
            fill="none"
            stroke="#d2b4ff"
            strokeWidth="8"
          />
          <circle cx="40" cy="225" r="18" fill="#fff" />
          <circle cx="58" cy="225" r="20" fill="#fff" />
          <circle cx="255" cy="225" r="18" fill="#fff" />
          <circle cx="238" cy="225" r="20" fill="#fff" />
        </>
      )}

      {variant === "dino" && (
        <>
          <ellipse cx="150" cy="150" rx="132" ry="128" fill="#b9e3aa" />
          {Array.from({ length: 8 }).map((_, i) => (
            <polygon
              key={i}
              points={`${215 + i * 10},${45 + i * 18} ${232 + i * 10},${
                55 + i * 18
              } ${218 + i * 10},${70 + i * 18}`}
              fill="#4e9d58"
            />
          ))}
          <circle cx="75" cy="58" r="4" fill="#3b6f3f" />
          <circle cx="96" cy="48" r="7" fill="#fff" />
          <circle cx="98" cy="48" r="3" fill="#111" />
          <circle cx="120" cy="62" r="6" fill="#ffa4a4" />
        </>
      )}

      <circle cx="150" cy="150" r="112" fill={frame.outer} />
      <circle cx="150" cy="150" r="96" fill={frame.inner} stroke="#f0d38a" strokeWidth="2" />

      {Array.from({ length: 60 }).map((_, i) => {
        const angle = i * 6;
        const outer = handPoint(91, angle);
        const inner = handPoint(i % 5 === 0 ? 82 : 86, angle);
        const stroke =
          variant === "sun" ? "#ff9c2a" : variant === "rainbow" ? "#5aa0e6" : "#4f9e51";
        return (
          <line
            key={i}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={stroke}
            strokeWidth={i % 5 === 0 ? 2 : 1}
          />
        );
      })}

      {Array.from({ length: 12 }).map((_, idx) => {
        const num = idx + 1;
        const angle = num * 30;
        const p = handPoint(70, angle);
        return (
          <text
            key={num}
            x={p.x}
            y={p.y + 8}
            textAnchor="middle"
            fontSize="22"
            fontWeight="700"
            fill="#222"
          >
            {num}
          </text>
        );
      })}

      {/* 第一、二階段才顯示外圈 5 分標示；第三階段不顯示 */}
      {stage !== 3 &&
        [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((m) => {
          const angle = m === 60 ? 0 : m * 6;
          const p = handPoint(108, angle);
          return (
            <text
              key={m}
              x={p.x}
              y={p.y + 6}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={frame.minuteText}
            >
              {m}
            </text>
          );
        })}

      <line
        x1={150}
        y1={150}
        x2={hourPt.x}
        y2={hourPt.y}
        stroke="#1f63b7"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <line
        x1={150}
        y1={150}
        x2={minutePt.x}
        y2={minutePt.y}
        stroke="#ef4040"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <line
        x1={150}
        y1={150}
        x2={secondPt.x}
        y2={secondPt.y}
        stroke="#f5c000"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle cx="150" cy="150" r="7" fill="#ffd24d" stroke="#cc8a00" strokeWidth="2" />
    </svg>
  );
}

/* =========================
   單元二：時鐘練習
========================= */
function ClockPractice({ stage, onBack, onBackToClockMenu }) {
  const [question, setQuestion] = useState(generateClockQuestion(stage));
  const [hourInput, setHourInput] = useState("");
  const [minuteInput, setMinuteInput] = useState("");
  const [status, setStatus] = useState("");
  const [activeField, setActiveField] = useState("hour");

  const { hour, minute } = question;

  const title =
    stage === 1
      ? "時鐘練習：第一階段（整點、半點）"
      : stage === 2
      ? "時鐘練習：第二階段（5分單位）"
      : "時鐘練習：第三階段（任意分鐘）";

  const variant =
    stage === 1 ? "sun" : stage === 2 ? "rainbow" : "dino";

  function handleCheck() {
    const hourCorrect = Number(hourInput) === hour;
    const minuteCorrect = Number(minuteInput) === minute;

    if (hourCorrect && minuteCorrect) {
      setStatus("correct");
    } else {
      setStatus("wrong");
    }
  }

  function handleNext() {
    setQuestion(generateClockQuestion(stage));
    setHourInput("");
    setMinuteInput("");
    setStatus("");
    setActiveField("hour");
  }

  function handleRetry() {
    setStatus("");
  }

  function handleKeypadPress(value) {
    if (activeField === "hour") {
      setHourInput((prev) => {
        if (prev.length >= 2) return prev;
        return prev + value;
      });
      return;
    }

    setMinuteInput((prev) => {
      if (prev.length >= 2) return prev;
      return prev + value;
    });
  }

  function handleKeypadDelete() {
    if (activeField === "hour") {
      setHourInput((prev) => prev.slice(0, -1));
      return;
    }

    setMinuteInput((prev) => prev.slice(0, -1));
  }

  function handleKeypadClear() {
    if (activeField === "hour") {
      setHourInput("");
      return;
    }

    setMinuteInput("");
  }

  const activeLabel =
    activeField === "hour" ? "正在輸入：小時" : "正在輸入：分鐘";

  const stageHint =
    stage === 1
      ? "這一關只會出整點和半點"
      : stage === 2
      ? "這一關以 5 分為單位"
      : "這一關會出任意分鐘";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 950,
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <TopBar
        title={title}
        leftButton={
          <button onClick={onBack} style={smallBackBtn}>
            返回首頁
          </button>
        }
        rightButton={
          <button onClick={onBackToClockMenu} style={menuBtnStyle}>
            返回階段選單
          </button>
        }
      />

      <div style={{ padding: "24px 24px 10px" }}>
        <div
          style={{
            textAlign: "center",
            color: "#666",
            fontSize: 22,
            marginBottom: 6,
          }}
        >
          請看時鐘，輸入正確時間
        </div>
        <div
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: 18,
            marginBottom: 10,
          }}
        >
          {stageHint}
        </div>
      </div>

      <div style={{ padding: "10px 28px 20px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <KeypadPanel
            activeLabel={activeLabel}
            onPress={handleKeypadPress}
            onDelete={handleKeypadDelete}
            onClear={handleKeypadClear}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 10,
            }}
          >
            <ClockFace
              hour={hour}
              minute={minute}
              variant={variant}
              stage={stage}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 6,
              }}
            >
              <AnswerInput
                value={hourInput}
                onFocusField={() => setActiveField("hour")}
                isActive={activeField === "hour"}
                placeholder="--"
              />

              <div style={{ fontSize: 32, fontWeight: "bold" }}>:</div>

              <AnswerInput
                value={minuteInput}
                onFocusField={() => setActiveField("minute")}
                isActive={activeField === "minute"}
                placeholder="--"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#d8efec",
          borderTop: "1px solid #c4dfdb",
          padding: "20px 20px 30px",
          marginTop: 10,
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: 24,
            color: "#444",
            marginBottom: 16,
          }}
        >
          請輸入正確時間
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 14,
            flexWrap: "wrap",
          }}
        >
          <button onClick={handleCheck} style={confirmBtnStyle}>
            確認答案
          </button>
        </div>

        {status === "correct" && (
          <ResultBlock
            text={`✓ 正確！ ${hour}:${pad2(minute)}`}
            color="#25a344"
            buttonText="下一題"
            onClick={handleNext}
          />
        )}

        {status === "wrong" && (
          <ResultBlock
            text="✕ 再試一次"
            color="#d74c4c"
            buttonText="重試"
            onClick={handleRetry}
          />
        )}
      </div>
    </div>
  );
}

/* =========================
   首頁 / 階段頁
========================= */
function HomePage({ onGoArithmetic, onGoClock }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 950,
        background: "#fff",
        minHeight: "100vh",
        padding: "32px 24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontSize: 42,
          fontWeight: 700,
          color: "#2b39d1",
          marginBottom: 16,
        }}
      >
        數學練習
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 22,
          color: "#666",
          marginBottom: 40,
        }}
      >
        請選擇要練習的單元
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
          maxWidth: 620,
          margin: "0 auto",
        }}
      >
        <button onClick={onGoArithmetic} style={homeCardStyle("#d8efec")}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>➕➖</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#1f4aa8" }}>
            單元一：加減法練習
          </div>
          <div style={{ marginTop: 8, fontSize: 20, color: "#555" }}>
            加法湊十、減法破十
          </div>
        </button>

        <button onClick={onGoClock} style={homeCardStyle("#fff4d8")}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>🕒</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#9b5d00" }}>
            單元二：時鐘練習
          </div>
          <div style={{ marginTop: 8, fontSize: 20, color: "#555" }}>
            分三階段練習判讀時間
          </div>
        </button>
      </div>
    </div>
  );
}

function ClockMenuPage({ onBack, onGoStage1, onGoStage2, onGoStage3 }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 950,
        background: "#fff",
        minHeight: "100vh",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <button onClick={onBack} style={smallBackBtn}>
          返回首頁
        </button>

        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#9b5d00",
          }}
        >
          單元二：時鐘練習
        </div>

        <div style={{ width: 110 }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 22,
          maxWidth: 680,
          margin: "0 auto",
        }}
      >
        <button onClick={onGoStage1} style={stageCardStyle("#eaf4ff")}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1f4aa8" }}>
            第一階段
          </div>
          <div style={{ marginTop: 8, fontSize: 22, color: "#555" }}>
            整點、半點（太陽款）
          </div>
        </button>

        <button onClick={onGoStage2} style={stageCardStyle("#f6f0ff")}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#8457d5" }}>
            第二階段
          </div>
          <div style={{ marginTop: 8, fontSize: 22, color: "#555" }}>
            5 分單位（彩虹款）
          </div>
        </button>

        <button onClick={onGoStage3} style={stageCardStyle("#eef8ea")}>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#2d7a28" }}>
            第三階段
          </div>
          <div style={{ marginTop: 8, fontSize: 22, color: "#555" }}>
            任意分鐘（恐龍款）
          </div>
        </button>
      </div>
    </div>
  );
}

/* =========================
   App
========================= */
export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f2f2f2",
        display: "flex",
        justifyContent: "center",
        fontFamily:
          '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", Arial, sans-serif',
      }}
    >
      {page === "home" && (
        <HomePage
          onGoArithmetic={() => setPage("arithmetic")}
          onGoClock={() => setPage("clock-menu")}
        />
      )}

      {page === "arithmetic" && (
        <ArithmeticPractice onBack={() => setPage("home")} />
      )}

      {page === "clock-menu" && (
        <ClockMenuPage
          onBack={() => setPage("home")}
          onGoStage1={() => setPage("clock-stage-1")}
          onGoStage2={() => setPage("clock-stage-2")}
          onGoStage3={() => setPage("clock-stage-3")}
        />
      )}

      {page === "clock-stage-1" && (
        <ClockPractice
          stage={1}
          onBack={() => setPage("home")}
          onBackToClockMenu={() => setPage("clock-menu")}
        />
      )}

      {page === "clock-stage-2" && (
        <ClockPractice
          stage={2}
          onBack={() => setPage("home")}
          onBackToClockMenu={() => setPage("clock-menu")}
        />
      )}

      {page === "clock-stage-3" && (
        <ClockPractice
          stage={3}
          onBack={() => setPage("home")}
          onBackToClockMenu={() => setPage("clock-menu")}
        />
      )}
    </div>
  );
}