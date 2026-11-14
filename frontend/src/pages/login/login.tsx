// import React from "react";
// import User from "../../models/User";
// import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import { loginAction } from "../../redux/actions/login/login.action";
// import { selectUserData } from "../../redux/actions/login/loginSlice";
// import { useWebsocketUser } from "../../context/webSocketUser";
// import { useNavigateCustom } from "../_layout/elements/custom-link";
// import { isMobile } from "react-device-detect";
// import api from "../../utils/api";
// import SubmitButton from "../../components/SubmitButton";

// // const isMobile = true
// const Login = () => {
//   const dispatch = useAppDispatch();
//   const userState = useAppSelector(selectUserData);
//   const { socketUser } = useWebsocketUser();

//   const navigate = useNavigateCustom();

//   const [loginForm, setLoginForm] = React.useState<User>({
//     username: "",
//     password: "",
//     logs: "",
//     isDemo: false,
//   });

//   const [isDemoLogin, setIsDemoLogin] = React.useState(false); // Track Demo Login

//   React.useEffect(() => {
//     api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
//       setLoginForm({ ...loginForm, logs: res.data });
//     });
//   }, []);

//   React.useEffect(() => {
//     if (userState.status === "done") {
//       const { role, _id } = userState.user;
//       socketUser.emit("login", {
//         role: userState.user.role,
//         sessionId: userState.user.sessionId,
//         _id,
//       });
//       localStorage.setItem("login-session", userState.user.sessionId);

//       if (
//         userState.user.role &&
//         ["admin", "1", "2", "3"].includes(userState.user.role)
//       ) {
//         return navigate.go("/");
//       }

//       return isMobile ? navigate.go("/") : navigate.go("/");
//     }
//   }, [userState]);

//   const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
//   };
//   const handleSubmitDemoLogin = () => {
//     const loginFormNew = { ...loginForm, isDemo: true };
//     setLoginForm(loginFormNew);
//     setIsDemoLogin(true);
//   };
//   const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     dispatch(loginAction(loginForm));
//     setIsDemoLogin(false);
//   };
//   return (
//     <div>
//       <div className="login">
//         <div className="loginInner1">
//           <div
//             className="featured-box-login featured-box-secundary default"
//             style={{
//               boxShadow: "0px 0px 30px rgb(0 0 0 / 82%)",
//               background: "transparent",
//             }}
//           >
//             <h4 className="text-center" style={{ color: "#11283E" }}>
//               <div className="log-logo m-b-20 text-center">
//                 <img src="/imgs/starlogo.png" className="logo-login" />
//               </div>
//             </h4>
//             <form
//               onSubmit={(e) => handleSubmit(e)}
//               role="form"
//               autoComplete="off"
//               method="post"
//             >
//               <div className="form-group m-b-20">
//                 <input
//                   name="username"
//                   placeholder="User Name"
//                   type="text"
//                   className="form-control"
//                   aria-required="true"
//                   aria-invalid="false"
//                   onChange={handleForm}
//                   required={!isDemoLogin}
//                 />
//                 <i className="fas fa-user text-dark"></i>
//                 <small
//                   className="text-danger"
//                   style={{ display: "none" }}
//                 ></small>
//               </div>
//               <div className="form-group m-b-20">
//                 <input
//                   name="password"
//                   placeholder="Password"
//                   type="password"
//                   className="form-control"
//                   aria-required="true"
//                   aria-invalid="false"
//                   onChange={handleForm}
//                   required={!isDemoLogin}
//                 />
//                 <i className="fas fa-key text-dark"></i>
//                 {userState.error ? (
//                   <small className="text-danger">{userState.error}</small>
//                 ) : (
//                   ""
//                 )}
//               </div>
//               <div className="form-group text-center mb-0">
//                 <SubmitButton
//                   type="submit"
//                   className="btn btn-submit btn-login mb-10"
//                   style={{ backgroundColor: "#11283E" }}
//                 >
//                   Login
//                   {userState.status === "loading" ? (
//                     <i className="ml-2 fas fa-spinner fa-spin"></i>
//                   ) : (
//                     <i className="ml-2 fas fa-sign-in-alt"></i>
//                   )}
//                 </SubmitButton>
//                 <SubmitButton
//                   type="submit"
//                   onClick={() => handleSubmitDemoLogin()}
//                   className="btn btn-submit btn-login mb-10"
//                   style={{ backgroundColor: "#11283E" }}
//                 >
//                   Login with Demo ID
//                   {userState.status === "loading" ? (
//                     <i className="ml-2 fas fa-spinner fa-spin"></i>
//                   ) : (
//                     <i className="ml-2 fas fa-sign-in-alt"></i>
//                   )}
//                 </SubmitButton>
//                 <small className="recaptchaTerms d-none">
//                   This site is protected by reCAPTCHA and the Google
//                   <a
//                     target={"_blank"}
//                     rel="noopener noreferrer"
//                     href="https://policies.google.com/privacy"
//                   >
//                     Privacy Policy
//                   </a>{" "}
//                   and
//                   <a
//                     target={"_blank"}
//                     rel="noopener noreferrer"
//                     href="https://policies.google.com/terms"
//                   >
//                     Terms of Service
//                   </a>{" "}
//                   apply.
//                 </small>
//               </div>
//               <div className="mt-2 text-center download-apk"></div>
//             </form>
//           </div>
//         </div>
//       </div>
//       <section className="footer footer-login">
//         <div className="footer-top">
//           <div className="footer-links d-none">
//             <nav className="navbar navbar-expand-sm">
//               <ul className="navbar-nav">
//                 <li className="nav-item">
//                   <a
//                     className="nav-link"
//                     href="/terms-and-conditions"
//                     target="_blank"
//                   >
//                     {" "}
//                     Terms and Conditions{" "}
//                   </a>
//                 </li>
//                 <li className="nav-item">
//                   <a
//                     className="nav-link"
//                     href="/responsible-gaming"
//                     target="_blank"
//                   >
//                     {" "}
//                     Responsible Gaming{" "}
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//           <div className="support-detail">
//             <h2>Note : This site is not for Indian Territory</h2>
//             <p></p>
//           </div>
//           <div className="social-icons-box"></div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Login;


// import React from "react";
// import User from "../../models/User";
// import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import { loginAction } from "../../redux/actions/login/login.action";
// import { selectUserData } from "../../redux/actions/login/loginSlice";
// import { useWebsocketUser } from "../../context/webSocketUser";
// import { useNavigateCustom } from "../_layout/elements/custom-link";
// import { isMobile } from "react-device-detect";
// import api from "../../utils/api";
// import SubmitButton from "../../components/SubmitButton";

// const Login = () => {
//   const dispatch = useAppDispatch();
//   const userState = useAppSelector(selectUserData);
//   const { socketUser } = useWebsocketUser();
//   const navigate = useNavigateCustom();

//   const [loginForm, setLoginForm] = React.useState<User>({
//     username: "",
//     password: "",
//     logs: "",
//     isDemo: false,
//   });

//   const [isDemoLogin, setIsDemoLogin] = React.useState(false);
//   const [showPassword, setShowPassword] = React.useState(false); // 👁 eye toggle

//   React.useEffect(() => {
//     api.get(`${process.env.REACT_APP_IP_API_URL}`).then((res) => {
//       setLoginForm((prev) => ({ ...prev, logs: res.data }));
//     });
//   }, []);

//   React.useEffect(() => {
//     if (userState.status === "done") {
//       const { _id, role, sessionId } = userState.user;

//       socketUser.emit("login", {
//         role,
//         sessionId,
//         _id,
//       });

//       localStorage.setItem("login-session", sessionId);
//       navigate.go("/");
//     }
//   }, [userState]);

//   const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
//   };

//   const handleSubmitDemoLogin = () => {
//     setLoginForm({ ...loginForm, isDemo: true });
//     setIsDemoLogin(true);
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     dispatch(loginAction(loginForm));
//     setIsDemoLogin(false);
//   };

//   return (
//     <div>
//       <div className="login">
//         <div className="loginInner1">
//           <div
//             className="featured-box-login featured-box-secundary default"
//             style={{
//               boxShadow: "0px 0px 30px rgb(0 0 0 / 82%)",
//               background: "transparent",
//             }}
//           >
//             <div className="log-logo m-b-20 text-center">
//               <img src="/imgs/starlogo.png" className="logo-login" />
//             </div>

//             <form onSubmit={handleSubmit} autoComplete="off">
//               {/* USERNAME */}
//               <div className="form-group m-b-20">
//                 <input
//                   name="username"
//                   placeholder="User Name"
//                   type="text"
//                   className="form-control"
//                   onChange={handleForm}
//                   required={!isDemoLogin}
//                 />
//                 <i className="fas fa-user text-dark"></i>
//               </div>

//               {/* PASSWORD */}
//               <div className="form-group m-b-20 position-relative">
//                 <input
//                   name="password"
//                   placeholder="Password"
//                   type={showPassword ? "text" : "password"}
//                   className="form-control"
//                   onChange={handleForm}
//                   required={!isDemoLogin}
//                 />

//                 <i className="fas fa-key text-dark"></i>

//                 {/* 👁 Eye Icon */}
//                 <i
//                   className={`fas ${
//                     showPassword ? "fa-eye-slash" : "fa-eye"
//                   }`}
//                   onClick={() => setShowPassword(!showPassword)}
//                   style={{
//                     position: "absolute",
//                     right: "15px",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     cursor: "pointer",
//                     color: "#333",
//                   }}
//                 ></i>

//                 {userState.error && (
//                   <small className="text-danger">{userState.error}</small>
//                 )}
//               </div>

//               {/* BUTTONS */}
//               <div className="form-group text-center mb-0">
//                 <SubmitButton
//                   type="submit"
//                   className="btn btn-submit btn-login mb-10"
//                   style={{ backgroundColor: "#11283E" }}
//                 >
//                   Login
//                   {userState.status === "loading" ? (
//                     <i className="ml-2 fas fa-spinner fa-spin"></i>
//                   ) : (
//                     <i className="ml-2 fas fa-sign-in-alt"></i>
//                   )}
//                 </SubmitButton>

//                 <SubmitButton
//                   type="submit"
//                   onClick={handleSubmitDemoLogin}
//                   className="btn btn-submit btn-login mb-10"
//                   style={{ backgroundColor: "#11283E" }}
//                 >
//                   Login with Demo ID
//                   {userState.status === "loading" ? (
//                     <i className="ml-2 fas fa-spinner fa-spin"></i>
//                   ) : (
//                     <i className="ml-2 fas fa-sign-in-alt"></i>
//                   )}
//                 </SubmitButton>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       <section className="footer footer-login">
//         <div className="footer-top">
//           <div className="support-detail">
//             <h2>Note : This site is not for Indian Territory</h2>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Login;



import React, { useEffect, useRef, useState } from "react";
import User from "../../models/User";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { loginAction } from "../../redux/actions/login/login.action";
import { selectUserData } from "../../redux/actions/login/loginSlice";
import { useWebsocketUser } from "../../context/webSocketUser";
import { useNavigateCustom } from "../_layout/elements/custom-link";
import api from "../../utils/api";
import "./login.css";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const userState = useAppSelector(selectUserData);
  const { socketUser } = useWebsocketUser();
  const navigate = useNavigateCustom();

  const [loginForm, setLoginForm] = useState<User>({
    username: "",
    password: "",
    logs: "",
    isDemo: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginMode, setLoginMode] = useState<"normal" | "demo">("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loginRequested = useRef(false);
  const handledSession = useRef<string | null>(null);

  // Fetch visitor IP information
  useEffect(() => {
    const controller = new AbortController();

    const loadIP = async () => {
      const url = process.env.REACT_APP_IP_API_URL;
      if (!url) return;

      try {
        const res = await api.get(url, {
          signal: controller.signal,
        });

        setLoginForm((prev) => ({
          ...prev,
          logs:
            typeof res.data === "string"
              ? res.data
              : JSON.stringify(res.data),
        }));
      } catch (error) {
        // Login remains available if IP API fails.
        console.error("IP API request failed:", error);
      }
    };

    loadIP();

    return () => controller.abort();
  }, []);

  // Login success handler
  useEffect(() => {
    if (
      userState.status !== "done" ||
      !userState.user ||
      !loginRequested.current
    ) {
      return;
    }

    const { _id, role, sessionId } = userState.user;

    if (!sessionId || handledSession.current === sessionId) {
      return;
    }

    handledSession.current = sessionId;
    loginRequested.current = false;

    socketUser.emit("login", {
      role,
      sessionId,
      _id,
    });

    localStorage.setItem("login-session", sessionId);

    setIsSubmitting(false);
    setLoginSuccess(true);

    // Show popup before navigating
    redirectTimer.current = setTimeout(() => {
      navigate.go("/match/4");
    }, 1500);
  }, [userState, socketUser, navigate]);

  // Login error handler
  useEffect(() => {
    if (userState.status === "loading" && loginRequested.current) {
      setIsSubmitting(true);
    }

    if (userState.error && loginRequested.current) {
      setIsSubmitting(false);
      loginRequested.current = false;
    }
  }, [userState.status, userState.error]);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
      isDemo: false,
    }));
  };

  const submitLogin = (demo: boolean) => {
    if (isSubmitting || loginSuccess) return;

    if (!demo && (!loginForm.username.trim() || !loginForm.password)) {
      return;
    }

    setLoginSuccess(false);
    setLoginMode(demo ? "demo" : "normal");
    setIsSubmitting(true);
    loginRequested.current = true;
    handledSession.current = null;

    const payload: User = {
      ...loginForm,
      username: demo ? loginForm.username : loginForm.username.trim(),
      isDemo: demo,
    };

    Promise.resolve(dispatch(loginAction(payload))).catch((error) => {
      console.error("Login request failed:", error);
      loginRequested.current = false;
      setIsSubmitting(false);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitLogin(false);
  };

  const handleDemoLogin = () => {
    submitLogin(true);
  };

  return (
    <main className="star-login-page">
      <div className="star-background-grid" aria-hidden="true" />
      <div className="star-glow star-glow-left" aria-hidden="true" />
      <div className="star-glow star-glow-right" aria-hidden="true" />

      <div className="star-login-container">
        {/* Brand */}
        
<header className="star-brand">
  {/* <div className="star-brand-logo">
    <img
      src="/imgs/starlogo.png"
      alt="STAR-99"
      className="star-logo-image"
    />
  </div> */}

  <h1 className="star-brand-name">STAR-99</h1>
</header>


        {/* Devotional banner */}
      

        {/* Login card */}
        <section className="star-login-card">
          <div className="star-card-shine" aria-hidden="true" />

          <div className="star-card-header">
            <div className="star-lock-icon">
              <i className="fas fa-shield-alt" aria-hidden="true" />
            </div>

            <h2>WELCOME BACK</h2>
            <p>Login to your STAR-99 account</p>
          </div>

          <form
            className="star-login-form"
            onSubmit={handleSubmit}
            autoComplete="on"
          >
            {/* Username */}
            <div className="star-form-field">
              <label htmlFor="star-username">USERNAME</label>

              <div className="star-input-container">
                <i className="fas fa-user" aria-hidden="true" />

                <input
                  id="star-username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginForm.username}
                  onChange={handleForm}
                  autoComplete="username"
                  disabled={isSubmitting || loginSuccess}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="star-form-field">
              <label htmlFor="star-password">PASSWORD</label>

              <div className="star-input-container">
                <i className="fas fa-lock" aria-hidden="true" />

                <input
                  id="star-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={handleForm}
                  autoComplete="current-password"
                  disabled={isSubmitting || loginSuccess}
                  required
                />

                <button
                  type="button"
                  className="star-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showPassword}
                >
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {/* Error */}
            {userState.error && !loginSuccess && (
              <div className="star-error-message" role="alert">
                <i
                  className="fas fa-exclamation-circle"
                  aria-hidden="true"
                />
                <span>{String(userState.error)}</span>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              className="star-login-button"
              disabled={isSubmitting || loginSuccess}
            >
              {isSubmitting && loginMode === "normal" ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  <span>LOGGING IN...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt" />
                  <span>SECURE LOGIN</span>
                  <i className="fas fa-arrow-right star-button-arrow" />
                </>
              )}
            </button>

            {/* Success popup directly below login button */}
            {loginSuccess && (
              <div
                className="star-success-popup"
                role="status"
                aria-live="polite"
              >
                <div className="star-success-check">
                  <i className="fas fa-check" aria-hidden="true" />
                </div>

                <div className="star-success-content">
                  <strong>Login Successful!</strong>
                  <span>
                    Welcome to STAR-99. Redirecting to dashboard...
                  </span>
                </div>
              </div>
            )}

            <div className="star-form-divider">
              <span>OR</span>
            </div>

            {/* Demo button */}
            <button
              type="button"
              className="star-demo-button"
              onClick={handleDemoLogin}
              disabled={isSubmitting || loginSuccess}
            >
              {isSubmitting && loginMode === "demo" ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  <span>PLEASE WAIT...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-gamepad" />
                  <span>LOGIN WITH DEMO ID</span>
                </>
              )}
            </button>
          </form>

          <div className="star-card-bottom">
            <i className="fas fa-shield-alt" aria-hidden="true" />
            <span>Secure Account Access</span>
          </div>
        </section>

        {/* Footer */}
        <footer className="star-login-footer">
          <div className="star-footer-warning">
            <i
              className="fas fa-exclamation-triangle"
              aria-hidden="true"
            />
            <span>
              Note: This site is not for Indian Territory
            </span>
          </div>

          {/* <div className="star-powered">
            <span>Powered by</span>
            <img
              src="/imgs/betfair-starlogo.png"
              alt="Betfair"
            />
          </div> */}

          <p className="star-copyright">
            © {new Date().getFullYear()} STAR-99
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Login;
