import { MediaFactory } from "./mediaFactory.js";
import { createLightBox } from "./lightBox.js";

export function photographerTemplate(data) {
  const { name, portrait, city, country, price, tagline } = data;

  const picture = `assets/photographers/${portrait}`;
  const article = document.createElement("article");
  const closeBtn = document.querySelector(".close");
  const modalContact = document.getElementById("contact_modal");

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

  //contact form
  const form = document.querySelector("form");
  const username = document.getElementById("prenom");
  const surname = document.getElementById("nom");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const submitForm = () => {
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (username.value === "" || surname.value === "" || email.value === "") {
        alert("Veuillez remplir tous les champs.");
        console.log("Veuillez remplir tous les champs.");
      } else {
        let user = {
          prenom: username.value,
          nom: surname.value,
          mail: email.value,
          msg: message.value,
        };
        // alert(`Bonjour ${user.prenom}, votre message a bien été envoyé.`);

        console.log(`Bonjour ${user.prenom}, votre message a bien été envoyé.`);
        console.log(user);
        username.value = "";
        surname.value = "";
        email.value = "";
        message.value = "";
      }

      closeModal();
    });
  };

  submitForm();

  const contactBtn = document.querySelector(".contact_button");

  const displayModal = () => {
    modalContact.style.display = "block";
    console.log(modalContact);
  };

  const closeModal = () => {
    modalContact.style.display = "none";
  };

  contactBtn?.addEventListener("click", displayModal);
  closeBtn?.addEventListener("click", closeModal);

  return { name, picture, getUserCardDOM, displayMedia };
}

const showLightBox = (index, photographerMedia) => {
  // Get the clicked media
  const clickedMedia = photographerMedia[index];

  console.log("User clicked on the image:", clickedMedia);

  createLightBox(clickedMedia, photographerMedia, index);
};

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

const addLikes = (likeBtn) => {
  // on cherche le bon element pour le like
  const mediaElement = likeBtn.closest(".media-element"); // on utilise closest pour retrouver l'ancestor le plus près

  if (mediaElement) {
    const likesContainer = mediaElement.querySelector(".likes p");

    // on check si le user a déjà liké ou pas
    const alreadyLiked = mediaElement.classList.contains("liked");

    if (!alreadyLiked) {
      // on incrémente les likes et l'UI
      const currentLikes = parseInt(likesContainer.textContent);
      likesContainer.textContent = currentLikes + 1;

      // on ajoute une classe pour montrer que l'utilisateur a déjà liké
      mediaElement.classList.add("liked");
    } else {
      // on decrement les likes
      const currentLikes = parseInt(likesContainer.textContent);
      likesContainer.textContent = currentLikes - 1;

      // on enleve la classe liked si l'utilisateur retire son like
      mediaElement.classList.remove("liked");
    }

    // on update le montant total de like sur la page du photographe
    allLikesEncart();
  }
};

const allLikesEncart = () => {
  const encartLikesContainer = document.querySelector(".encartLikes");
  const likeButtons = document.querySelectorAll(".heart-button");

  // on calcul le total des likes
  const totalLikes = Array.from(likeButtons).reduce((acc, button) => {
    const mediaElement = button.parentNode.parentNode;
    console.log(mediaElement);
    const likesContainer = mediaElement.querySelector(".likes p");
    return acc + parseInt(likesContainer.textContent);
  }, 0);

  // on update le total
  const totalLikesElement = encartLikesContainer.querySelector(".totalLikes");
  if (totalLikesElement) {
    totalLikesElement.textContent = totalLikes;
  }
};

const filterMedia = (photographerMedia, mediaContainer) => {
  const searchInput = document
    .getElementById("filtre-select")
    .value.toLowerCase();

  console.log("Search Input:", searchInput);

  if (searchInput === "popularite") {
    console.log('Selected "Popularité"');
    // on tri par like (popularité)
    photographerMedia.sort((a, b) => b.likes - a.likes);
  } else if (searchInput === "titre") {
    console.log("selected title");
    // on tri par titre
    photographerMedia.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  } else if (searchInput === "date") {
    console.log("selected date");
    // tri par date
    photographerMedia.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  mediaContainer.innerHTML = "";

  // Re-render the media based on the sorted array
  photographerMedia.forEach((media) => {
    const mediaFactory = new MediaFactory(media, media.photographerId);
    mediaContainer.innerHTML += mediaFactory.renderMedia();
  });
};
