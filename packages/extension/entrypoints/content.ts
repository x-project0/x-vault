export default defineContentScript({
  matches: ["*://*.twitter.com/*"],
  async main() {
    console.log(import.meta.env.VITE_WEB_APP_URL);
    observeCellInnerDivs();
  },
});

async function observeCellInnerDivs() {
  console.log("Waiting for 6 seconds...");
  await new Promise((resolve) => setTimeout(resolve, 6000));
  console.log("Observing cellInnerDivs");
  // Find all elements with [data-testid="cellInnerDiv"]
  const cellInnerDivElements = document.querySelectorAll(
    '[data-testid="cellInnerDiv"]'
  );

  // Find the nearest common parent for all selected elements
  const commonParent = findNearestCommonParent(cellInnerDivElements);

  if (!commonParent) return;

  addNewElementAfterBookmark(
    commonParent.querySelectorAll('[data-testid="cellInnerDiv"]')
  );

  // Add a MutationObserver to the common parent
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      console.log('The mutation type is:', mutation.type);
    
    });
    console.log("DOM changed!!");
    // You can query the DOM here to find the new elements
    const newElements = commonParent.querySelectorAll(
      '[data-testid="cellInnerDiv"]'
    );
    console.log("New elements:", newElements);
    addNewElementAfterBookmark(newElements);
  });
  observer.observe(commonParent, { childList: true});
}

async function addNewElementAfterBookmark(elements: NodeListOf<Element> | Element) {
  // Add the new element after the bookmark button for each element
  if (elements instanceof NodeList) {
    elements.forEach((element) => {
      addNewElementAfterBookmark(element);
    });
  } else if (elements instanceof Element) {
    const bookmarkButton = elements.querySelector('[data-testid="bookmark"]');
    if (bookmarkButton) {
      const bookmarkParent = bookmarkButton.parentNode;
      if (!bookmarkParent) return;
      const newElementToAdd = bookmarkParent.querySelector(".new-element");
      if (!newElementToAdd) {
        const newElement = createNewElement();

        newElement?.addEventListener("click", async () => {
          const tweetElement = newElement.closest(
            '[data-testid="cellInnerDiv"]'
          );
          if (!tweetElement) return;
          const { name, username, tweetText,tweetId } = getTwitterData(tweetElement);
          console.log("Name:", name);
          console.log("Username:", username);
          console.log("Tweet Text:", tweetText);

          const url = "https://ddnvg417vk17l.cloudfront.net/tweet/v1";
          const options = {
            method: "POST",
            headers: { "content-type": "application/json" },
            // body: '{"content":"blBL.","author_username":"@log1500","tweetId":"1776456930761875721"}',
            body: JSON.stringify({
              content: tweetText,
              author_username: username,
              tweetId: tweetId,
            }),
          };

          try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
          } catch (error) {
            console.error(error);
          }
        });

        bookmarkParent.appendChild(newElement);
      }
    }
  }
}

function createNewElement() {
  const newElement = document.createElement("div");
  newElement.innerHTML = brainSVG;
  newElement.classList.add("new-element");
  newElement.style.display = "inline-flex";
  newElement.style.alignItems = "center";
  newElement.style.justifyContent = "center";
  newElement.style.marginLeft = "8px";
  newElement.style.color = "#71767b";
  newElement.style.fontSize = "1.1rem";
  newElement.style.cursor = "pointer";
  newElement.style.height = "2.25rem";
  newElement.style.width = "2.25rem";

  // A11y
  newElement.setAttribute("role", "button");
  newElement.setAttribute("aria-label", "Add a new element to X-Vault");
  newElement.setAttribute("tabindex", "0");

  // on hover, change the color to #1DA1F2
  newElement.addEventListener("mouseover", () => {
    newElement.style.color = "#1DA1F2";
    newElement.style.borderRadius = "50%";
    newElement.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  });
  newElement.addEventListener("mouseout", () => {
    newElement.style.color = "#71767b";
    newElement.style.borderRadius = "0px";
    newElement.style.backgroundColor = "transparent";
  });
  newElement.addEventListener("click", () => {
    console.log("clicked");
    // const newElementToAdd =
    //   newElement.parentNode?.querySelector(".new-element");
    // if (newElementToAdd) {
    //   const newElementParent = newElementToAdd.parentNode;
    //   if (newElementParent) {
    //     newElementParent.removeChild(newElementToAdd);
    //   }
    // }
  });

  return newElement;
}

// Helper function to find the nearest common parent
function findNearestCommonParent(elements: NodeListOf<Element>) {
  // Start at the first element's parent node
  let current = elements[0].parentNode;

  if (!current) return null;

  // Keep going up the DOM tree until we find a parent that contains all elements
  while (true && current) {
    // Check if all elements are contained within the current node
    let allContained = true;
    for (let i = 1; i < elements.length; i++) {
      if (!current.contains(elements[i])) {
        allContained = false;
        break;
      }
    }

    // If all elements are contained, return the current node
    if (allContained) {
      return current;
    }

    // If not, move up to the next parent node
    current = current.parentNode;
  }
}

function getTwitterData(element: Element) {
  const userNameElement = element.querySelector('[data-testid="User-Name"]');
  const name = userNameElement?.querySelector("a")?.textContent?.trim();

  const allATags = userNameElement?.querySelectorAll('a');
  
  const usernameElement = allATags?.[1];

  const splitUrl = allATags?.[allATags.length - 1]?.href?.split("/"); 

  const tweetId = splitUrl?.[splitUrl.length - 1];

  const username = usernameElement?.textContent?.trim();

  // Get the tweet text
  const tweetTextElement = element.querySelector('[data-testid="tweetText"]');
  const tweetText = tweetTextElement?.textContent?.trim();

  return { name, username, tweetText,tweetId };
}

const brainSVG = `<svg
  xmlns="http://www.w3.org/2000/svg"
  width="1.25rem"
  height="1.25rem"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="lucide lucide-brain"
>
  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
  <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
  <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
  <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
  <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
  <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
  <path d="M6 18a4 4 0 0 1-1.967-.516" />
  <path d="M19.967 17.484A4 4 0 0 1 18 18" />
</svg>`;
