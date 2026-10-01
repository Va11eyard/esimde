import React, { useState } from "react";
import { C } from "../components/Tokens";

interface LoginPageProps {
  onBackToHome?: () => void;
  onNavigateToRegister?: () => void;
}

export function LoginPage({ onBackToHome, onNavigateToRegister }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Esimde Login attempt:", { login, password, rememberMe });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #FAF7F2 0%, #F4F9FC 60%, #E8EFF6 100%)",
        fontFamily: "'Manrope', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Top Header */}
      <header
        style={{
          padding: "24px 48px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          onClick={onBackToHome}
          style={{
            cursor: onBackToHome ? "pointer" : "default",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: C.green,
              letterSpacing: "-0.5px",
            }}
          >
            esimde
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.muted,
              marginTop: -2,
            }}
          >
            Платформа когнитивного здоровья
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              style={{
                background: "#FFFFFF",
                border: `1px solid ${C.border}`,
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: 14,
                fontWeight: 600,
                color: C.text,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.18s",
              }}
            >
              ← На главную
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 32px 60px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 48,
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          {/* Left: Login Card */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(16px)",
              borderRadius: 32,
              padding: "44px 40px",
              width: "100%",
              maxWidth: 420,
              boxShadow: "0 20px 48px rgba(42, 174, 227, 0.08), 0 2px 10px rgba(0,0,0,0.03)",
              border: `1px solid ${C.border}`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  color: C.text,
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                Вход в систему
              </h1>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.muted,
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                Введите ваши данные для доступа к личному кабинету
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Login/Email field */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 8,
                  }}
                >
                  Email или логин
                </label>
                <input
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Введите ваш email или логин"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: `1px solid ${C.border}`,
                    backgroundColor: "#FAF7F2",
                    fontSize: 14,
                    color: C.text,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s",
                  }}
                />
              </div>

              {/* Password field */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 8,
                  }}
                >
                  Пароль
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите пароль"
                    required
                    style={{
                      width: "100%",
                      padding: "14px 44px 14px 16px",
                      borderRadius: 14,
                      border: `1px solid ${C.border}`,
                      backgroundColor: "#FAF7F2",
                      fontSize: 14,
                      color: C.text,
                      outline: "none",
                      boxSizing: "border-box",
                      transition: "all 0.2s",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                      display: "flex",
                      alignItems: "center",
                      color: C.muted,
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* Checkbox and Forgot Password */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 13,
                  marginBottom: 24,
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    color: C.muted,
                    fontWeight: 500,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      borderRadius: 4,
                      accentColor: C.blue,
                      width: 16,
                      height: 16,
                      cursor: "pointer",
                    }}
                  />
                  Запомнить меня
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => e.preventDefault()}
                  style={{
                    color: C.blue,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Забыли пароль?
                </a>
              </div>

              {/* Register Link */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: C.muted,
                  marginBottom: 24,
                }}
              >
                <span>Еще нет аккаунта? </span>
                <a
                  href="#register"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToRegister?.();
                  }}
                  style={{
                    color: C.blue,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Зарегистрироваться
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 999,
                  border: "none",
                  backgroundColor: C.blue,
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(42, 174, 227, 0.3)",
                  transition: "all 0.18s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = C.blueDark;
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(42, 174, 227, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = C.blue;
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(42, 174, 227, 0.3)";
                }}
              >
                Войти в Esimde
              </button>
            </form>
          </div>

          {/* Right: Phone Mockup with Esimde Theme */}
          <div
            style={{
              position: "relative",
              width: 320,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* Phone outer shell */}
            <div
              style={{
                width: 300,
                borderRadius: 44,
                backgroundColor: C.text,
                padding: "16px 12px",
                boxShadow:
                  "0 24px 56px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255,255,255,0.1) inset",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              {/* Dynamic Island / Notch */}
              <div
                style={{
                  position: "absolute",
                  top: 22,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 90,
                  height: 22,
                  backgroundColor: C.text,
                  borderRadius: 16,
                  zIndex: 10,
                }}
              />

              {/* Phone Screen */}
              <div
                style={{
                  backgroundColor: "#F6F8FA",
                  borderRadius: 34,
                  overflow: "hidden",
                  padding: "40px 14px 20px",
                  minHeight: 490,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxSizing: "border-box",
                  position: "relative",
                }}
              >
                {/* Header inside phone */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: C.green,
                        letterSpacing: "-0.5px",
                      }}
                    >
                      esimde
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        backgroundColor: "rgba(42, 174, 227, 0.12)",
                        color: C.blue,
                        padding: "2px 8px",
                        borderRadius: 12,
                        fontWeight: 600,
                      }}
                    >
                      Онлайн скрининг
                    </span>
                  </div>

                  {/* Card 1: Memory prompt */}
                  <div
                    style={{
                      backgroundColor: "rgba(42, 174, 227, 0.08)",
                      borderRadius: 14,
                      padding: "12px 14px",
                      marginBottom: 12,
                      border: `1px solid rgba(42, 174, 227, 0.15)`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: C.text,
                        margin: 0,
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      Запомните 3 слова Mini-Cog:
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: C.blue,
                        margin: "4px 0 0",
                      }}
                    >
                      яблоко · стол · монета
                    </p>
                  </div>

                  {/* User response bubble */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: C.blue,
                        borderRadius: "14px 14px 4px 14px",
                        padding: "10px 14px",
                        boxShadow: "0 4px 12px rgba(42, 174, 227, 0.25)",
                      }}
                    >
                      <p style={{ fontSize: 11, color: "#FFFFFF", margin: 0, fontWeight: 600 }}>
                        Все слова запомнил ✓
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 14,
                      padding: "12px 14px",
                      border: `1px solid ${C.border}`,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>
                        Прогресс теста
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.blue }}>
                        3 / 5 задач
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        backgroundColor: "rgba(42,174,227,0.15)",
                        borderRadius: 999,
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: "60%",
                          backgroundColor: C.blue,
                          borderRadius: 999,
                        }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 12,
                        padding: "10px 12px",
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <div style={{ fontSize: 10, color: C.muted }}>Память</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>
                        Норма
                      </div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderRadius: 12,
                        padding: "10px 12px",
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <div style={{ fontSize: 10, color: C.muted }}>Внимание</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>
                        Хорошо
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Badge */}
                <div
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    padding: "10px 14px",
                    textAlign: "center",
                    border: `1px solid ${C.border}`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.text }}>
                    ⏱ 7 минут · 🔒 Конфиденциально
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
