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

    photographCard.addEventListener("keydown", (event) => {
      if (event.key === 'Enter') {
        window.location.href = `/photographer.html?id=${photographCard.dataset.id}`;
      }
    });

    photographersSection.appendChild(photographCard);
  });
}


async function init() {
  // récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);

  // Ajoutez votre gestionnaire de touches fléchées ici
  document.addEventListener('keydown', handleArrowKeys);
}

function handleArrowKeys(event) {
  const photographersSection = document.querySelector('.photographer_section');
  const photographers = Array.from(photographersSection.querySelectorAll('article'));
  const activeElementIndex = photographers.indexOf(document.activeElement);

  let newActiveIndex = -1; // Nous allons calculer cela en fonction de la touche appuyée

  switch (event.key) {
    case 'ArrowRight':
      newActiveIndex = activeElementIndex + 1 < photographers.length ? activeElementIndex + 1 : 0;
      break;
    case 'ArrowLeft':
      newActiveIndex = activeElementIndex - 1 >= 0 ? activeElementIndex - 1 : photographers.length - 1;
      break;
    case 'ArrowDown':
      // Supposons qu'il y ait 3 colonnes
      newActiveIndex = activeElementIndex + 3 < photographers.length ? activeElementIndex + 3 : (activeElementIndex + 3) % photographers.length;
      break;
    case 'ArrowUp':
      // Supposons qu'il y ait 3 colonnes
      newActiveIndex = activeElementIndex - 3 >= 0 ? activeElementIndex - 3 : photographers.length - (3 - activeElementIndex % 3);
      break;
  }

  if (newActiveIndex !== -1) {
    photographers[newActiveIndex].focus();
    event.preventDefault(); // Empêche le défilement par défaut du navigateur
  }
}

init();
