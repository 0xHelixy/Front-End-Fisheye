export class MediaFactory {
    constructor(media, photographerID) {
      this.media = media;
      this.photographerID = photographerID;
    }
  
    renderMedia() {
      if (this.media.video) {
        return this.renderVideo();
      } else {
        return this.renderImage();
      }
    }
  
    renderImage() {
      const imagePath = `../../assets/photos/${this.photographerID}/${this.media.image}`;
      return `
        <div class="media-element">
          <div class="image-element">
            <img src="${imagePath}" alt="${this.media.title}" aria-label="${this.media.title}" tabindex="0">
          </div>
          <div class="info">
            <h2>${this.media.title}</h2>
            <div class="likes">
              <p>${this.media.likes}</p>
              <span role="img" aria-label="likes"><i class="heart-button fas fa-heart" tabindex="0"></i></span>
            </div>
          </div>
       
      `;
    }
  
    renderVideo() {
      const videoPath = `../../assets/photos/${this.photographerID}/${this.media.video}`;
      return `
      <div class="media-element">
      <div class="image-element">
            <video src="${videoPath}" controls aria-label="${this.media.title}" alt="${this.media.title}"  ></video>
          </div>
          <div class="info">
            <h2>${this.media.title}</h2>
            <div class="likes">
              <p>${this.media.likes}</p>
              <span role="img" aria-label="likes"><i class="heart-button fas fa-heart" tabindex="0"></i></span>
            </div>
          </div>
        </div>
      `;
    }
  
    renderEncart(photographerPrice) {
      const totalLikes = this.media.reduce((acc, mediaItem) => acc + mediaItem.likes, 0);
      return `
        <div class="encart" role="region" aria-label="Informations sur les likes et le prix du photographe">
          <div class="likestotal">
            <p class="totalLikes" aria-live="polite">${totalLikes}</p>
            <span role="img" aria-label="likes"><i class="fas fa-heart black-heart"></i></span>
            </div>
          <h2>${photographerPrice}€ / jour</h2>
        </div>
      `;
    }
  }
  