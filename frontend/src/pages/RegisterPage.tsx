import React, { useState } from "react";
import { C } from "../components/Tokens";

interface RegisterPageProps {
  onBackToHome?: () => void;
  onNavigateToLogin?: () => void;
}

export function RegisterPage({ onBackToHome, onNavigateToLogin }: RegisterPageProps) {
  const [fullName, setFullName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"relative" | "doctor" | "patient">("relative");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }
    console.log("Esimde Register attempt:", { fullName, emailOrPhone, password, role, agreed });
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
            maxWidth: 1050,
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 48,
            alignItems: "center",
            justifyItems: "center",
          }}
        >
          {/* Left: Register Form Card */}
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(16px)",
              borderRadius: 32,
              padding: "40px 40px",
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 20px 48px rgba(42, 174, 227, 0.08), 0 2px 10px rgba(0,0,0,0.03)",
              border: `1px solid ${C.border}`,
              boxSizing: "border-box",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: C.text,
                  margin: 0,
                  letterSpacing: "-0.5px",
                }}
              >
                Регистрация в Esimde
              </h1>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.muted,
                  marginTop: 6,
                  marginBottom: 0,
                }}
              >
                Создайте аккаунт для отслеживания когнитивного здоровья
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Role selection pills */}
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
                  Кто вы?
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    backgroundColor: "#FAF7F2",
                    padding: 4,
                    borderRadius: 14,
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setRole("relative")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "none",
                      backgroundColor: role === "relative" ? C.blue : "transparent",
                      color: role === "relative" ? "#FFFFFF" : C.muted,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                  >
                    Близкий родственник
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("doctor")}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      border: "none",
                      backgroundColor: role === "doctor" ? C.blue : "transparent",
                      color: role === "doctor" ? "#FFFFFF" : C.muted,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                  >
                    Врач / Специалист
                  </button>
                </div>
              </div>

              {/* Full Name field */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 6,
                  }}
                >
                  Имя и фамилия
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Например, Алия Жумабаева"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
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

              {/* Email/Phone field */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 6,
                  }}
                >
                  Email или номер телефона
                </label>
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="email@example.com или +7 700 000 0000"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
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
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 6,
                  }}
                >
                  Пароль
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Придумайте надежный пароль"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 44px 12px 16px",
                      borderRadius: 12,
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

              {/* Confirm Password field */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: C.text,
                    marginBottom: 6,
                  }}
                >
                  Повторите пароль
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите пароль"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 12,
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

              {/* Terms checkbox */}
              <div style={{ marginBottom: 24 }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    cursor: "pointer",
                    fontSize: 12,
                    color: C.muted,
                    lineHeight: 1.4,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                    style={{
                      borderRadius: 4,
                      accentColor: C.blue,
                      width: 16,
                      height: 16,
                      marginTop: 2,
                      cursor: "pointer",
                    }}
                  />
                  <span>
                    Я принимаю условия{" "}
                    <a href="#agreement" onClick={(e) => e.preventDefault()} style={{ color: C.blue }}>
                      Пользовательского соглашения
                    </a>{" "}
                    и{" "}
                    <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: C.blue }}>
                      Политики конфиденциальности
                    </a>
                  </span>
                </label>
              </div>

              {/* Login Link */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: 14,
                  color: C.muted,
                  marginBottom: 20,
                }}
              >
                <span>Уже есть аккаунт? </span>
                <a
                  href="#login"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToLogin?.();
                  }}
                  style={{
                    color: C.blue,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Войти
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
                Зарегистрироваться
              </button>
            </form>
          </div>

          {/* Right: Info / Benefits Card */}
          <div
            style={{
              backgroundColor: C.altBg,
              borderRadius: 32,
              padding: "36px 32px",
              border: `1px solid ${C.border}`,
              maxWidth: 380,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <h3 style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 16 }}>
              Почему стоит завести аккаунт в Esimde?
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  icon: "📊",
                  title: "Сохранение отчетов",
                  desc: "История всех скринингов и тестов памяти сохраняется в вашем личном кабинете.",
                },
                {
                  icon: "👨‍⚕️",
                  title: "Консультации специалистов",
                  desc: "Запись на онлайн и офлайн приемы к проверенным неврологам и гериатрам.",
                },
                {
                  icon: "📖",
                  title: "Дневник воспоминаний",
                  desc: "Персональные упражнения для сохранения и тренировки памяти родственника.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    padding: "16px",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
