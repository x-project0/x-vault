export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  // browser.runtime.onMessage.addListener(function (request, sender, onSuccess) {
  //   console.log("running check");
  //   // fetch("<your-domain>/api/auth/session", {
  //   fetch(`${import.meta.env.VITE_WEB_APP_URL}/api/auth/session`, {
  //     mode: "cors",
  //   })
  //     .then((response) => response.json())
  //     .then((session) => {
  //       console.log(session);
  //       if (Object.keys(session).length > 0) {
  //         onSuccess(session);
  //       } else {
  //         onSuccess(null);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       onSuccess(null);
  //     });

  //   return true; // Will respond asynchronously.
  // });
    browser.runtime.onMessage.addListener(async (message) => {
    fetch(`${import.meta.env.VITE_WEB_APP_URL}/api/me`, {
      mode: "cors",
    })
      .then((response) => response.json())
      .then((session) => {
        console.log(session);
        if (Object.keys(session).length > 0) {
          return {ping:'pong'};
        } else {
          return {ping:'pong'};
        }
      })
      .catch((err) => {
        console.error(err);
        return {ping:'pong'};
      });
  });
});
