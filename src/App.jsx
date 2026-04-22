import { useMemo, useState } from "react";
import kidPhoto from "./assets/kid.jpg";

function generateQuestion() {
  const isAdd = Math.random() < 0.5;

  if (isAdd) {
    // 加法：只出需要湊十的題
    // a: 1~9, b: 1~9, 且 a+b <= 18, 且 a+b > 10
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

  // 減法：十幾減個位數，且需要破十
  let a, b;
  do {
    a = Math.floor(Math.random() * 8) + 11; // 11~18
    b = Math.floor(Math.random() * 9) + 1;  // 1~9
  } while (b <= a % 10 || b > a);

  return {
    type: "sub",
    a,
    b,
    answer: a - b,
  };
}

function PinkInput({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      inputMode="numeric"
      maxLength={2}
      style={{
        width: 54,
        height: 44,
        border: "3px solid #eea9d4",
        background: "#fff",
        color: "#2b39d1",
        fontSize: 20,
        textAlign: "center",
        boxSizing: "border-box",
        outline: "none",
      }}
    />
  );
}

function AddSplitDiagram({
  b,
  leftValue,
  rightValue,
  onLeftChange,
  onRightChange,
}) {
  return (
    <div style={{ marginTop: 20 }}>
      <svg width="180" height="190" viewBox="0 0 180 190">
        <text x="90" y="22" textAnchor="middle" fontSize="28" fill="#2b39d1">
          {b}
        </text>

        <line x1="90" y1="40" x2="55" y2="72" stroke="#777" strokeWidth="2" />
        <line x1="90" y1="40" x2="125" y2="72" stroke="#777" strokeWidth="2" />

        <foreignObject x="28" y="72" width="70" height="70">
          <PinkInput value={leftValue} onChange={onLeftChange} />
        </foreignObject>

        <foreignObject x="98" y="72" width="70" height="70">
          <PinkInput value={rightValue} onChange={onRightChange} />
        </foreignObject>

        <line x1="55" y1="130" x2="55" y2="138" stroke="#777" strokeWidth="2" />
        <text x="55" y="170" textAnchor="middle" fontSize="24" fill="#2b39d1">
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
  onLeftChange,
  onRightChange,
}) {
  return (
    <div style={{ marginTop: 20 }}>
      <svg width="180" height="150" viewBox="0 0 180 150">
        <text x="90" y="22" textAnchor="middle" fontSize="28" fill="#2b39d1">
          {a}
        </text>

        <line x1="90" y1="34" x2="55" y2="72" stroke="#777" strokeWidth="2" />
        <line x1="90" y1="34" x2="125" y2="72" stroke="#777" strokeWidth="2" />

        <foreignObject x="28" y="72" width="70" height="80">
          <PinkInput value={leftValue} onChange={onLeftChange} />
        </foreignObject>

        <foreignObject x="98" y="72" width="70" height="80">
          <PinkInput value={rightValue} onChange={onRightChange} />
        </foreignObject>
      </svg>
    </div>
  );
}

function Explanation({ type, a, b }) {
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
        <div>
          10 + {remain} =
        </div>
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
      <div>
      </div>
    </div>
  );
}

export default function App() {
  const [question, setQuestion] = useState(generateQuestion());
  const [splitLeft, setSplitLeft] = useState("");
  const [splitRight, setSplitRight] = useState("");
  const [inputAnswer, setInputAnswer] = useState("");
  const [status, setStatus] = useState("");

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
    setQuestion(generateQuestion());
    setSplitLeft("");
    setSplitRight("");
    setInputAnswer("");
    setStatus("");
  }

  function handleRetry() {
    setInputAnswer("");
    setStatus("");
  }

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
      <div
        style={{
          width: "100%",
          maxWidth: 950,
          background: "#fff",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            background: "#d8e5fb",
            fontSize: 30,
            fontWeight: 500,
            color: "#111",
            padding: "10px 20px",
          }}
        >
          {titleText}
        </div>

        <div style={{ padding: "28px 28px 20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              alignItems: "start",
            }}
          >
            {/* 左邊改成放照片 */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 10,
              }}
            >
              <img
                src={kidPhoto}
                alt="小朋友照片"
                style={{
                  width: "100%",
                  maxWidth: "340px",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              />
            </div>

            {/* 右邊算式與拆分圖 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
                      onLeftChange={setSplitLeft}
                      onRightChange={setSplitRight}
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
                      onLeftChange={setSplitLeft}
                      onRightChange={setSplitRight}
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
            marginTop: 20,
          }}
        >
          <Explanation type={type} a={a} b={b} />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 14,
              marginTop: 22,
              flexWrap: "wrap",
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="答案"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              style={{
                width: 180,
                height: 56,
                fontSize: 32,
                textAlign: "center",
                border: "2px solid #aaa",
                borderRadius: 8,
                background: "#fff",
                color: "#222",
              }}
            />

            <button
              onClick={handleCheck}
              style={{
                minWidth: 150,
                height: 56,
                fontSize: 24,
                border: "none",
                borderRadius: 8,
                background: "#4e7ed9",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              確認答案
            </button>
          </div>

          {status === "correct" && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <div
                style={{
                  color: "#25a344",
                  fontSize: 40,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                ✓ 正確！
              </div>
              <button
                onClick={handleNext}
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
                下一題
              </button>
            </div>
          )}

          {status === "wrong" && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <div
                style={{
                  color: "#d74c4c",
                  fontSize: 34,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                ✕ 再試一次
              </div>
              <button
                onClick={handleRetry}
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
                重試
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}