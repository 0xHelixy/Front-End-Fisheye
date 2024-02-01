import { MediaFactory } from "./mediaFactory.js";
import { createLightBox } from "./lightBox.js";

export function photographerTemplate(data) {
  const { name, portrait, city, country, price, tagline } = data;

  const picture = `assets/photographers/${portrait}`;
  const article = document.createElement("article");

  function getUserCardDOM() {
    const img = document.createElement("img");
    img.classList.add("pic");
    img.setAttribute("src", picture);
    const h2 = document.createElement("h2");
    const h4 = document.createElement("h4");
    const h5 = document.createElement("h5");
    const p = document.createElement("p");
    const priceElement = document.createElement("p");

    h2.textContent = name;
    h4.textContent = `${city}, ${country}`;
    p.textContent = `"${tagline}"`;
    priceElement.textContent = `${price}€/jour`;

    const leftSide = document.createElement("div");
    leftSide.classList.add("left-side");
    leftSide.appendChild(h2);

    const location = document.createElement("div");
    location.classList.add("location");
    location.appendChild(h4);

    article.appendChild(img);
    location.appendChild(h5);
    leftSide.appendChild(location);
    leftSide.appendChild(p);
    leftSide.appendChild(priceElement);
    article.appendChild(leftSide);

    return article;
  }

  return { name, picture, getUserCardDOM, displayMedia };
}

const displayMedia = (
  photographerMedia,
  mediaContainer,
  encartLikesContainer,
  photographerPrice,
  filtreSelect
) => {
  photographerMedia.forEach((media) => {
    const mediaFactory = new MediaFactory(media, media.photographerId);
    mediaContainer.innerHTML += mediaFactory.renderMedia();
  });

  const encartLikes = new MediaFactory(photographerMedia);
  encartLikesContainer.innerHTML = encartLikes.renderEncart(photographerPrice);

  // Add event listener for the select element
  filtreSelect.addEventListener("input", () => {
    filterMedia(photographerMedia, mediaContainer);
    console.log("test");
  });

  // ouvrir le lightbox onclick
  mediaContainer.addEventListener("click", (event) => {
    const likeButton = event.target.closest(".heart-button");
    const mediaElement = event.target.closest(".media-element");

    if (likeButton) {
      // event.stopPropagation();
      addLikes(likeButton);
    } else if (mediaElement) {
      const index = Array.from(mediaElement.parentNode.children).indexOf(
        mediaElement
      );
      showLightBox(index, photographerMedia);
    }
  });

  //ouvrir le lightbox avec le clavier et liké un media
  mediaContainer.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const likeButton = event.target.closest(".heart-button");
      const mediaElement = event.target.closest(".media-element");

      if (likeButton) {
        addLikes(likeButton);
      } else if (mediaElement) {
        const index = Array.from(mediaElement.parentNode.children).indexOf(
          mediaElement
        );
        showLightBox(index, photographerMedia);
      }
    }
  });
};

// filter with likes/popularity/date

const filterMedia = (photographerMedia, mediaContainer) => {
  const searchInput = document.getElementById("filtre-select").value.toLowerCase();

  console.log("Search Input:", searchInput);

  if (searchInput === "popularite") {
    console.log('Selected "Popularité"');
    // Sort by likes (popularity)
    photographerMedia.sort((a, b) => b.likes - a.likes);
  } else if (searchInput === "titre") {
    console.log("selected title");
    // Sort by title
    photographerMedia.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  else if (searchInput === "date") {
    console.log("selected date");
    // Sort by date
    photographerMedia.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  mediaContainer.innerHTML = "";

  // Re-render the media based on the sorted array
  photographerMedia.forEach((media) => {
    const mediaFactory = new MediaFactory(media, media.photographerId);
    mediaContainer.innerHTML += mediaFactory.renderMedia();
  });
};


 //contact form
 const form = document.querySelector("form");
 const username = document.getElementById("prenom");
 const surname = document.getElementById("nom");
 const email = document.getElementById("email");
 const message = document.getElementById("message");


