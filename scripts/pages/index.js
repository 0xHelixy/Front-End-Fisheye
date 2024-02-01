import { photographerTemplate } from "../templates/photographer.js";

async function getPhotographers() {
  try {
    // on utilise fetch pour récupérer le fichier JSON
    const response = await fetch("data/photographers.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // on recupere les données du fichier
    const data = await response.json();

    // on retour les données des photographes
    return { photographers: data.photographers };
  } catch (error) {
    console.error("Could not fetch photographers:", error);
  }
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const photographCard = photographerModel.getUserCardDOM();

    // gestion de l'accessibilité avec aria-label
    photographCard.setAttribute("aria-label", `${photographer.name}'s profile. Location: ${photographer.city}, ${photographer.country}. Tagline: ${photographer.tagline}. Price: ${photographer.price} euros per day.`);

    photographCard.dataset.id = photographer.id;

    photographCard.addEventListener("click", () => {
      const photographerId = photographCard.dataset.id;
      console.log(photographerId);
      window.location.href = `/photographer.html?id=${photographerId}`;
    });

    photographersSection.appendChild(photographCard);
  });
}

async function init() {
  // récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
