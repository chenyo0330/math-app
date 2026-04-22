import { useMemo, useState } from "react";

function generateQuestion() {
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

function ArithmeticPractice({ onBack }) {
  const [question, setQuestion] = useState(generateQuestion());
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
    setQuestion(generateQuestion());
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

  return (
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
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "#727892",
            color: "#fff",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          返回首頁
        </button>

        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 30,
            fontWeight: 500,
            color: "#111",
            marginRight: 110,
          }}
        >
          {titleText}
        </div>
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
                {activeField === "splitLeft"
                  ? "正在輸入：左邊粉紅框"
                  : activeField === "splitRight"
                  ? "正在輸入：右邊粉紅框"
                  : "正在輸入：答案"}
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
                    onClick={() => handleKeypadPress(String(num))}
                    style={keypadBtnStyle}
                  >
                    {num}
                  </button>
                ))}

                <button onClick={handleKeypadDelete} style={keypadBtnStyle}>
                  刪除
                </button>

                <button
                  onClick={() => handleKeypadPress("0")}
                  style={keypadBtnStyle}
                >
                  0
                </button>

                <button onClick={handleKeypadClear} style={keypadBtnStyle}>
                  清空
                </button>
              </div>
            </div>
          </div>

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
            placeholder="答案"
            value={inputAnswer}
            readOnly
            onClick={() => setActiveField("answer")}
            style={{
              width: 180,
              height: 56,
              fontSize: 32,
              textAlign: "center",
              border:
                activeField === "answer"
                  ? "3px solid #4e7ed9"
                  : "2px solid #aaa",
              borderRadius: 8,
              background: "#fff",
              color: "#222",
              outline: "none",
              cursor: "pointer",
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
  );
}

function ClockStagePlaceholder({ title, onBack, onBackToClock }) {
  return (
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
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "#727892",
            color: "#fff",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          返回首頁
        </button>

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

        <button
          onClick={onBackToClock}
          style={{
            border: "none",
            background: "#4e7ed9",
            color: "#fff",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          返回階段選單
        </button>
      </div>

      <div
        style={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 20,
          padding: 24,
        }}
      >
        <div style={{ fontSize: 40 }}>🕒</div>
        <div style={{ fontSize: 32, fontWeight: 700, color: "#2b39d1" }}>
          {title}
        </div>
        <div style={{ fontSize: 24, color: "#555", textAlign: "center" }}>
          這一階段的時鐘練習頁面，下一步我再幫你正式接上。
        </div>
      </div>
    </div>
  );
}

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
        <button
          onClick={onGoArithmetic}
          style={{
            border: "none",
            borderRadius: 20,
            padding: "28px 20px",
            background: "#d8efec",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 42, marginBottom: 10 }}>➕➖</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#1f4aa8" }}>
            單元一：加減法練習
          </div>
          <div style={{ marginTop: 8, fontSize: 20, color: "#555" }}>
            加法湊十、減法破十
          </div>
        </button>

        <button
          onClick={onGoClock}
          style={{
            border: "none",
            borderRadius: 20,
            padding: "28px 20px",
            background: "#fff4d8",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
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
        <button
          onClick={onBack}
          style={{
            border: "none",
            background: "#727892",
            color: "#fff",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
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
        <button
          onClick={onGoStage1}
          style={{
            border: "none",
            borderRadius: 18,
            padding: "24px 20px",
            background: "#eaf4ff",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1f4aa8" }}>
            第一階段
          </div>
          <div style={{ marginTop: 8, fontSize: 22, color: "#555" }}>
            整點、半點
          </div>
        </button>

        <button
          onClick={onGoStage2}
          style={{
            border: "none",
            borderRadius: 18,
            padding: "24px 20px",
            background: "#edf8e8",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "#2d7a28" }}>
            第二階段
          </div>
          <div style={{ marginTop: 8, fontSize: 22, color: "#555" }}>
            以 5 分為單位
          </div>
        </button>

        <button
          onClick={onGoStage3}
          style={{
            border: "none",
            borderRadius: 18,
            padding: "24px 20px",
            background: "#fff1f1",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 700, color: "#b54747" }}>
            第三階段
          </div>
          <div style={{ marginTop: 8, fontSize: 22, color: "#555" }}>
            任意分鐘
          </div>
        </button>
      </div>
    </div>
  );
}

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
        <ClockStagePlaceholder
          title="時鐘練習：第一階段（整點、半點）"
          onBack={() => setPage("home")}
          onBackToClock={() => setPage("clock-menu")}
        />
      )}

      {page === "clock-stage-2" && (
        <ClockStagePlaceholder
          title="時鐘練習：第二階段（5分單位）"
          onBack={() => setPage("home")}
          onBackToClock={() => setPage("clock-menu")}
        />
      )}

      {page === "clock-stage-3" && (
        <ClockStagePlaceholder
          title="時鐘練習：第三階段（任意分鐘）"
          onBack={() => setPage("home")}
          onBackToClock={() => setPage("clock-menu")}
        />
      )}
    </div>
  );
}