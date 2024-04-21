import googleLogo from "@/assets/google.svg";
// import React, { useState, useEffect } from "react";
// import reactLogo from "@/assets/react.svg";
// import wxtLogo from "/wxt.svg";
// import "./App.css";
// // import "./popup.css";

// const ShareGPTPopup = () => {
//   const [csrfToken, setCsrfToken] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userInfo, setUserInfo] = useState({
//       expires: '',
//       user: {
//         name: '',
//         email: '',
//         image: '',
//         id: '',
//       },
//   });

//    useEffect(() => {
//      // Fetch CSRF token and user session information
//      const fetchData = async () => {
//        try {
//          const response = await fetch(
//            `${import.meta.env.VITE_WEB_APP_URL}/api/auth/csrf`
//          );
//          const data = await response.json();
//          setCsrfToken(data.csrfToken);
//        } catch (error) {
//          console.error("Error fetching data:", error);
//        }
//      };
//      fetchData();
//    }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           `${import.meta.env.VITE_WEB_APP_URL}/api/auth/session`
//         );
//         const data = await response.json();
//         setUserInfo({
//           expires: data.expires,
//           user: {
//             name: data.user.name,
//             email: data.user.email,
//             image: data.user.image,
//             id: data.user.id,
//           },
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   return (
//     <body className="body">
//       <div id="login-div" className="container">
//         <img src="/assets/icons/icon48.png" alt="Share GPT" />
//         <h1 className="title">Login to X-Vault</h1>
//         <form
//           action={`${import.meta.env.VITE_WEB_APP_URL}/api/auth/signin/google`}
//           target="_blank"
//           method="POST"
//         >
//           <input
//             id="csrfToken-google"
//             type="hidden"
//             name="csrfToken"
//             value={csrfToken}
//           />
//           <button type="submit" className="button">
//             <img src="/assets/chrome.svg" alt="Google" />
//             <span>Log in with Google</span>
//           </button>
//         </form>
//       </div>
//       <div id="session-div" className="container">
//         <img
//           id="session-image"
//           alt="User Profile Pic"
//           className="profile-pic"
//         />
//         <h1 id="session-name" className="title"></h1>
//         <p className="subtitle">
//           You are logged in as{" "}
//           <span id="session-username">{userInfo.user.name}</span>
//         </p>
//         <button
//           onClick={() => {
//             fetch(`${import.meta.env.VITE_WEB_APP_URL}/api/me`)
//           }}
//         >
//           ping session to web app
//         </button>
//       </div>

//     </body>
//   );
// };

// function App() {
//   return (
//     <>
//       <ShareGPTPopup />
//     </>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import reactLogo from "@/assets/react.svg";
import wxtLogo from "/wxt.svg";
import "./App.css";

const ShareGPTPopup = () => {
  const [csrfToken, setCsrfToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    expires: "",
    user: {
      name: "",
      email: "",
      image: "",
      id: "",
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch CSRF token and user session information
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_WEB_APP_URL}/api/auth/csrf`
        );
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_WEB_APP_URL}/api/auth/session`
        );
        const data = await response.json();
        setUserInfo({
          expires: data.expires,
          user: {
            name: data.user.name,
            email: data.user.email,
            image: data.user.image,
            id: data.user.id,
          },
        });
        setIsLoggedIn(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoggedIn(false);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex justify-center">
      {loading ? (
        <div className="flex justify-center">
          <svg
            className="animate-spin h-5 w-5 text-gray-500"
            viewBox="0 0 24 24"
          >
            <circle className="fill-gray-500" cx="12" cy="12" r="10" />
          </svg>
        </div>
      ) : isLoggedIn ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src={userInfo.user.image}
            alt="User Profile Pic"
            className="w-12 h-12 rounded-full"
          />
          <h1 className="text-lg">{userInfo.user.name}</h1>
          <p className="text-gray-500">Signed in with {userInfo.user.email}</p>
          <button
            onClick={() => {
              fetch(`${import.meta.env.VITE_WEB_APP_URL}/api/me`);
            }}
          >
            ping session to web app
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-lg">You are not logged in</h1>
          <p className="text-gray-500">Please login to continue</p>
          <form
            action={`${
              import.meta.env.VITE_WEB_APP_URL
            }/api/auth/signin/google`}
            target="_blank"
            method="POST"
          >
            <input
              id="csrfToken-google"
              type="hidden"
              name="csrfToken"
              value={csrfToken}
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            >
              <img
                src={googleLogo}
                alt="Google"
                style={{ width: "20px", height: "20px" }}
              />
              <span>Log in with Google</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

function App() {
  return <ShareGPTPopup />;
}

export default App;
