<template>
  <div class="modal-container" v-if="isImageGenerated">
    <div id="modal" class="modal" v-on-click-outside="() => (isImageGenerated = false)">
      <div class="button-container">
        <a @click="isImageGenerated = false">Fechar</a>
        <a id="generatedImageLinkTop">Download</a>
      </div>
      <img id="generatedImage" />
      <div class="button-container">
        <a @click="isImageGenerated = false">Fechar</a>
        <a id="generatedImageLinkBottom">Download</a>
      </div>
    </div>
  </div>
  <input type="text" v-model="menuTitle" placeholder="Título" />
  <div class="input-container--flex">
    <input type="text" v-model="menuPrice" placeholder="Preço" />
    <input type="text" v-model="menuDay" placeholder="Data" />
  </div>
  <textarea type="text" rows="4" :value="menuContent" @input="handleInput" placeholder="Conteúdo" />
  <div>
    <div class="tiles-container">
      <img
        v-for="(tile, index) in tiles"
        :key="index"
        :alt="tile.alt"
        class="tile"
        :class="{ 'active-tile': selectedColorTile === tile.color }"
        @click="selectTileColor(tile.color)"
        :src="getImageUrl(tile.color)"
      />
    </div>
  </div>
  <a v-if="selectedColorTile" @click="generateImage">Gerar Imagem</a>
  <div
    id="tile"
    class="final-tile-container"
    v-if="selectedColorTile"
    :style="{ backgroundImage: `url(${getImageUrl(selectedColorTile)})` }"
  >
    <div class="final-tile" :class="applyColor()" @click="generateImage">
      <p class="final-tile--title">{{ menuTitle }}</p>
      <p class="final-tile--day">{{ menuDay }}</p>
      <div class="final-tile--content">
        <p v-for="(option, index) in menuContent" :key="index">{{ option }}</p>
      </div>
      <p class="final-tile--extras">Pão, azeitonas, prato principal, bebida e café</p>
      <p class="final-tile--price">{{ menuPrice }}€</p>
    </div>
  </div>
  <a v-if="selectedColorTile" @click="generateImage">Gerar Imagem</a>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import { vOnClickOutside } from '@vueuse/components';

// reactive state
const isImageGenerated = ref(false);
const menuTitle = ref('Menu Almoço');
const menuPrice = ref('9.90');
const menuDay = ref(getToday());
const menuContent = ref([
  'Bacalhau espiritual',
  'Filetes de pescada',
  'Carne de porco à alentejana',
  'Coelho no tacho',
  'Saladas frias de frango, camarão ou salmão fumado',
]);

const selectedColorTile = ref<null | string>(null);

const tiles = [
  { alt: 'Azulejo azul', color: 'blue' },
  { alt: 'Azulejo vermelho', color: 'red' },
  { alt: 'Azulejo laranja', color: 'orange' },
  { alt: 'Azulejo roxo', color: 'purple' },
  { alt: 'Azulejo rosa', color: 'pink' },
  { alt: 'Azulejo verde', color: 'green' },
  { alt: 'Azulejo dia dos namorados', color: 'valentines' },
];

function applyColor() {
  return {
    'blue-tile-color': selectedColorTile.value === 'blue',
    'red-tile-color': selectedColorTile.value === 'red' || selectedColorTile.value === 'valentines',
    'orange-tile-color': selectedColorTile.value === 'orange',
    'purple-tile-color': selectedColorTile.value === 'purple',
    'pink-tile-color': selectedColorTile.value === 'pink',
    'green-tile-color': selectedColorTile.value === 'green',
  };
}

function getToday() {
  const today = new Date();
  const currentDay = ('0' + today.getDate()).slice(-2);
  const currentMonth = ('0' + (today.getMonth() + 1)).slice(-2); // Months are zero-indexed

  return `${currentDay}/${currentMonth}`;
}

function getImageUrl(color: string) {
  // This path must be correct for your file
  return new URL(`/src/assets/tile-${color}.jpg`, import.meta.url).href;
}

function handleInput(event: Event) {
  const target = <HTMLInputElement>event.target;

  if (!target) {
    return;
  }
  menuContent.value = target.value.split(',');
}

function selectTileColor(newColor: string) {
  selectedColorTile.value = newColor;
}

function generateImage() {
  const tileDiv = document.getElementById('tile');
  if (!tileDiv) {
    return;
  }
  const options = {
    windowWidth: 1080,
    windowHeight: 1080,
  };

  isImageGenerated.value = true;
  html2canvas(tileDiv, options).then(function (canvas) {
    const generatedImageImg = document.getElementById('generatedImage') as HTMLImageElement;
    const generatedImageLinkTop = document.getElementById(
      'generatedImageLinkTop',
    ) as HTMLAnchorElement;
    const generatedImageAnchorBottom = document.getElementById(
      'generatedImageLinkBottom',
    ) as HTMLAnchorElement;

    if (generatedImageLinkTop && generatedImageAnchorBottom && generatedImageImg) {
      const img = canvas.toDataURL('image/png');
      generatedImageImg.src = img;
      generatedImageLinkTop.href = img;
      generatedImageLinkTop.download = `${menuTitle.value} ${menuDay.value}`;
      generatedImageAnchorBottom.href = img;
      generatedImageAnchorBottom.download = `${menuTitle.value} ${menuDay.value}`;
    }
  });
}
</script>
<style lang="scss" scoped>
input,
textarea {
  margin: 2px 0;
  padding: 6px;
  width: 100%;
  font-size: 20px;
}

@media (max-width: 768px) {
  textarea {
    font-size: 14px;
  }
}

a,
button {
  flex: 1;
  transition: 0.4s;
  cursor: pointer;
  margin: 10px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  background-color: var(--color-background-mute);
  padding: 10px;
  max-height: 52px;
  color: var(--color-text-active);
  font-size: 20px;
  text-align: center;

  &:hover {
    background-color: var(--color-background-soft);
  }
}

.modal-container {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
}

.modal {
  align-content: center;
  align-self: center;
  margin: 0 auto;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
  background-color: var(--color-background);
  padding: 0 5%;
  height: 80vh;
  text-align: center;

  .button-container {
    display: flex;
  }

  img {
    z-index: 2;
    height: 60vh;
  }
}

@media (max-width: 768px) {
  .modal {
    padding: 20px 0;
    height: unset;

    img {
      width: 100vw;
      height: auto;
    }
  }
}

.input-container {
  &--flex {
    display: flex;
    flex-direction: row;
    gap: 4px;
  }
}
.tiles-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 5px;
}

.tile {
  flex: 1;
  transition: 0.4s;
  cursor: pointer;
  padding: 8px;
  max-width: 100px;
}

.active-tile {
  border: 1px solid white;
}

.final-tile-container {
  position: relative;
  transition: 0.4s;
  cursor: pointer;
  background-position: top center;
  background-size: contain;
  background-repeat: no-repeat;
  padding-bottom: 100%;
  width: 100%;
  height: 0;

  &:hover {
    box-shadow: 0px 0px 10px 2px rgba(255, 255, 255, 0.75);
    -webkit-box-shadow: 0px 0px 10px 2px rgba(255, 255, 255, 0.75);
    -moz-box-shadow: 0px 0px 10px 2px rgba(255, 255, 255, 0.75);
  }
}

.final-tile {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  text-align: center;

  &--title {
    margin: 0 auto;
    padding-top: 10%;
    width: 35%;
    font-weight: 600;
  }

  &--day {
    margin: 4px auto;
    width: 40%;
    font-weight: 600;
  }

  &--content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
  }

  &--extras {
    position: absolute;
    bottom: 18%;
    left: 50%;
    transform: translate(-50%, 0);
    width: 35%;
  }
  &--price {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translate(-50%, 0);
  }

  @media (max-width: 320px) {
    &--title,
    &--price {
      font-size: 22px;
      line-height: 18px;
    }

    &--day {
      font-size: 16px;
      line-height: 16px;
    }

    &--content {
      font-size: 16px;
      line-height: 18px;
    }

    &--extras {
      font-size: 12px;
      line-height: 12px;
    }
  }

  @media (min-width: 321px) and (max-width: 425px) {
    &--title,
    &--price {
      font-size: 28px;
      line-height: 22px;
    }

    &--day {
      font-size: 20px;
      line-height: 20px;
    }

    &--content {
      font-size: 18px;
      line-height: 22px;
    }

    &--extras {
      font-size: 12px;
      line-height: 12px;
    }
  }

  @media (min-width: 426px) and (max-width: 1024px) {
    &--title,
    &--price {
      font-size: 60px;
      line-height: 50px;
    }

    &--day {
      font-size: 36px;
      line-height: 36px;
    }

    &--content {
      font-size: 36px;
      line-height: 48px;
    }

    &--extras {
      font-size: 24px;
      line-height: 24px;
    }
  }
  @media (min-width: 1025px) {
    &--title,
    &--price {
      font-size: 70px;
      line-height: 64px;
    }

    &--day {
      font-size: 48px;
      line-height: 48px;
    }

    &--content {
      font-size: 40px;
      line-height: 64px;
    }

    &--extras {
      font-size: 28px;
      line-height: 28px;
    }
  }
}

.blue-tile-color {
  color: var(--color-100m-blue);
}
.red-tile-color,
.valentines-tile-color {
  color: var(--color-100m-red);
}
.orange-tile-color {
  color: var(--color-100m-orange);
}
.purple-tile-color {
  color: var(--color-100m-purple);
}
.pink-tile-color {
  color: var(--color-100m-pink);
}
.green-tile-color {
  color: var(--color-100m-green);
}
</style>
